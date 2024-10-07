import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ArrowLayer } from './ArrowLayer.js';
import { ImageLayer } from './ImageLayer.js';

import enterFullscreen from './assets/enter_fullscreen.png';
import exitFullscreen from './assets/exit_fullscreen.png';

class VirtualTour {
    /**
     * @param {string} containerElement ID of the HTML element that should contain the tour
     * @param {string} sceneData Path of a json file that contains the structure of the tour
     * @param {string} [imageDirectory] Path of the directory that contains the 360-degree images (optional)
     */
    constructor(containerElement, sceneData, imageDirectory) {
        this.tourStructure = {};
        this.preloadedTextures = {};
        this.textureLoader = new THREE.TextureLoader();
        this.imageDirectory = imageDirectory;

        this.containerId = containerElement;
        this.container = document.getElementById(containerElement);
        this.#addCss();
        this.#addUiComponents();
        this.#setupRendererAndCamera();
        this.#setupControls();

        this.scene = new THREE.Scene();
        this.sceneSwitchAllowed = true;

        this.#loadTourData(sceneData)
            .then(() => this.setImageDirectory(imageDirectory))
            .then(() => this.#preloadTexture(this.tourStructure.startLocation))
            .then(() => this.#initializeLayers(this.tourStructure.startLocation))
            .then(() => {
                // Is executed at the beginning to fit the initial window size
                this.#onWindowResize();

                this.#addEventListeners();
                this.#preloadNeighboringTextures(this.tourStructure.startLocation);

                // Stops the loading animation and displays the ui components
                const loadingScreen = document.getElementById('loadingScreen');
                loadingScreen.parentNode.removeChild(loadingScreen);
                document.getElementById("roomInformation").style.display = "inline-block";
                document.getElementById("toggleFullScreen").style.display = "block";
            });
    }

    /**Adds the UI components of the tour to the DOM*/
    #addUiComponents() {
        this.container.innerHTML = `
            <div id="loadingScreen"></div>
            <div id="roomInformation">
                <p id="roomName"></p>
            </div>
            <button id="toggleFullScreen" class="toggleFullScreen">
                <img src="${enterFullscreen}" class="toggleFullScreen">
            </button>
        `;
    }

    
    async #addCss() {
        const cssFile = new URL('./styles.css', import.meta.url);

        try {
            const response = await fetch(cssFile);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let cssContent = await response.text();

            cssContent = cssContent.replace("virtualTour", this.containerId);

            const head = document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(cssContent));
            head.appendChild(style);

            document.querySelector(`#${this.containerId} canvas`).style.borderRadius = "20px";
            
        } catch (error) {
            console.error('Failed to fetch the CSS file:', error);
        }
    }


    setImageDirectory(imageDirectory) {
        this.imageDirectory = imageDirectory ?? this.tourStructure.imageDirectory;
    }
    

    #setupRendererAndCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.camera.position.set(-1, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.sortObjects = false;
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);
    }

    #setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.rotateSpeed = -0.4;
    }

    async #loadTourData(sceneData) {
        const response = await fetch(sceneData);
        this.tourStructure = await response.json();
    }

    async #preloadTexture(textureName) {
        return new Promise(resolve => {
            const texture = this.textureLoader.load(`${this.imageDirectory}/${textureName}.jpg`, () => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.x = -1;
                this.preloadedTextures[textureName] = texture;
                resolve();
            });
            texture.colorSpace = THREE.SRGBColorSpace;
        });
    }


    #initializeLayers(startLocation) {
        this.imageLayer = new ImageLayer(startLocation, this.preloadedTextures);
        this.arrowLayer = new ArrowLayer(startLocation, this.tourStructure, this.textureLoader);

        this.scene.add(this.imageLayer);
        this.scene.add(this.arrowLayer);

        document.getElementById("roomName").innerText = this.tourStructure[startLocation][0];
    }

    #preloadNeighboringTextures(currentScene) {
        const texturesToPreload = this.tourStructure[currentScene]
            .filter(item => typeof item === 'object' && item.hasOwnProperty('ref'))
            .map(item => item.ref);
        texturesToPreload.push(currentScene);


        const preloadPromises = texturesToPreload.map(scene =>
            this.preloadedTextures[scene] ? Promise.resolve() : this.#preloadTexture(scene)
        );

        Promise.all(preloadPromises)
            .then(() => {
                for (const key in this.preloadedTextures) {
                    if (!texturesToPreload.includes(key)) {
                        delete this.preloadedTextures[key];
                    }
                }
            })
            .then(() => {
                this.sceneSwitchAllowed = true;
            })
    }

    #addEventListeners() {
        window.addEventListener('resize', this.#onWindowResize.bind(this));
        window.addEventListener('click', this.#onWindowClick.bind(this));
        window.addEventListener('click', this.#onFullscreenToggle.bind(this));
        window.addEventListener('fullscreenchange', this.#onFullscreenchange.bind(this));
    }

    #onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    #getClickPosition(event) {
        const { top, left } = this.container.getBoundingClientRect();
        return new THREE.Vector2(
            ((event.clientX - left) / this.container.clientWidth) * 2 - 1,
            -((event.clientY - top) / this.container.clientHeight) * 2 + 1
        );
    }

    #onWindowClick(event) {
        const mousePosition = this.#getClickPosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePosition, this.camera);

        for (const arrow of this.arrowLayer.arrows) {
            if (raycaster.intersectObject(arrow).length > 0) {
                this.newScene = arrow.userData.ref;
                this.#switchScene(arrow.userData.ref);
                break;
            }
        }
    }

    #onFullscreenToggle(event) {

        if (!event.target.classList.contains("toggleFullScreen")) return;

        if (!document.fullscreenElement) {
            this.container.requestFullscreen()
            document.querySelector(`#${this.containerId} canvas`).style.borderRadius = "0px";
            document.querySelector("#toggleFullScreen img").setAttribute("src", exitFullscreen);
        } else {
            document.exitFullscreen();
        }
    }

    #onFullscreenchange() {
        if (!document.fullscreenElement) {
            document.querySelector(`#${this.containerId} canvas`).style.borderRadius = "20px";
            document.querySelector("#toggleFullScreen img").setAttribute("src", enterFullscreen);
        }
    }

    #switchScene(newScene) {
        if (!this.sceneSwitchAllowed) return;
        this.sceneSwitchAllowed = false;
        this.arrowLayer.clearArrows();
        this.#fadeTransition(-1);
        document.getElementById("roomName").innerText = this.tourStructure[newScene][0];
    }

    #fadeTransition(direction) {
        let opacity = this.imageLayer.sphere.material.opacity;

        if ((direction == -1 && opacity > 0) || (direction == 1 && opacity < 1)) {
            this.imageLayer.sphere.material.opacity += direction * 0.06;
            this.camera.fov += 0.4 * direction;
            this.camera.updateProjectionMatrix();

            setTimeout(() => this.#fadeTransition(direction), 16);
        } else if (opacity <= 0) {
            this.#fadeTransition(1);

            this.imageLayer.updateTexture(this.newScene, this.preloadedTextures[this.newScene]);
            this.#preloadNeighboringTextures(this.newScene);
        } else {
            this.arrowLayer.createArrows(this.tourStructure[this.newScene]);
        }
    }

    start() {
        this.animationId = requestAnimationFrame(this.start.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }

    setContainer(elementId) {
        this.container.removeChild(this.renderer.domElement);
        this.container = document.getElementById(elementId);
        this.container.appendChild(this.renderer.domElement);
    }
}

export { VirtualTour };
