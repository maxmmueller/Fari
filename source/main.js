import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class VirtualTour {
    /**
     * @param {String} tourFile Path to a .json file containing the tour data
     * @param {String} containerElement ID of an HTML element to contain the virtual tour
     * @param {String} imageDirectory Directory containing the panoramic images
     */
    constructor(tourFile, containerElement, imageDirectory) {
        this.scenes;
        this.arrows = [];
        this.preloadedTextures = {};

        this.imageDirectory = imageDirectory;
        this.arrowImagePath = '../node_modules/fari/source/assets/dot.png';
        this.textureLoader = new THREE.TextureLoader();

        this.container = document.getElementById(containerElement)
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.camera.position.set(-1, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        this.lookaroundControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.lookaroundControls.enableZoom = false;
        this.lookaroundControls.rotateSpeed = -0.4;

        // loads the virtual tour from a .json file
        this.#fetchData(tourFile)
            .then(() => {
                // loads the start location
                this.#loadTexture(this.scenes.startLocation)
                this.#createProjectionSphere();
                for (let arrow of this.scenes[this.scenes.startLocation]) {
                    this.#createArrow(arrow.position, arrow.ref);
                }

                this.#addResizeListener();
                this.#addArrowClickListener();
                this.#preloadNeighboringScenes(this.scenes.startLocation);
            });
    }

    /**
     * Adds the pano-projection sphere to the scene
     */
    #createProjectionSphere() {
        const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
        const texture = this.preloadedTextures[this.scenes.startLocation];
        const sphereMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
    }

    /**
     * Adds arrow buttons that link to other scenes
     * @param {int[]} coordinates Array containing the arrows x,y,z coordinates
     * @param {String} ref Name of the linkes panoramic scene
     */
    #createArrow(coordinates, ref) {
        // const arrowTexture = this.textureLoader.load('assets/arrow.png');
        const arrowTexture = this.textureLoader.load(this.arrowImagePath);
        const arrowMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const arrowSprite = new THREE.Sprite(arrowMaterial);
        arrowSprite.scale.set(5, 5, 1);
        arrowSprite.position.set(coordinates[0], coordinates[1], coordinates[2]);
        arrowSprite.userData.ref = ref;
        this.scene.add(arrowSprite);
        this.arrows.push(arrowSprite);
    }

    /**
     * Prelaods the textures that are neighboring the active one
     * @param {String} currentScene Name of the active scene 
     */
    #preloadNeighboringScenes(currentScene) {
        for (const texture of this.scenes[currentScene]) {
            this.#loadTexture(texture.ref);
        }

        // deletes the old preloaded texture images
        const neighboringScenes = [currentScene, ...this.scenes[currentScene].map(item => item.ref)];
        for (const texture in this.preloadedTextures) {
            if (!neighboringScenes.includes(texture)) {
                delete this.preloadedTextures[texture];
            }
        }
        // console.log(Object.keys(this.preloadedTextures).length);
    }

    /**
     * Creates a threejs texture out of an image
     * @param {String} textureName Name of the texture image
     */
    #loadTexture(textureName) {
        const newTexture = this.textureLoader.load(this.imageDirectory + "/" + textureName + ".jpg");
        newTexture.colorSpace = THREE.SRGBColorSpace;
        this.preloadedTextures[textureName] = newTexture;
    }

    /**
     * Displays an arrow if it's in the middle section of the screen
     */
    #updateArrowVisibility() {
        for (let arrow of this.arrows) {
            const arrowPosition = arrow.position.clone();
            arrowPosition.project(this.camera);
            arrow.visible = (arrowPosition.x > -0.7 && arrowPosition.x < 0.7);
        }
    }

    /**
     * Adapts the scenes size to the viewports size
     */
    #addResizeListener() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });
    }

    #getClickPosition(event) {
        const offsetTop = this.container.getBoundingClientRect().y;
        const offsetLeft = this.container.getBoundingClientRect().x;

        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - offsetLeft) / this.container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - offsetTop) / this.container.clientHeight) * 2 + 1;

        return mouse;
    }

    /**
     * Listens for clicks on the arrows and switches to the corresponding scenes 
     */
    #addArrowClickListener() {
        window.addEventListener('click', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.#getClickPosition(event), this.camera);

            // checks if any of the arrows were clicked
            for (const arrow of this.arrows) {
                const clicked = raycaster.intersectObject(arrow).length > 0;
                if (!clicked) continue;

                // removes the arrows of the old scene
                this.arrows.forEach(a => this.scene.remove(a));
                this.arrows = [];

                // moves to the refered scene scene
                const referedScene = arrow.userData.ref;
                this.sphere.material.map = this.preloadedTextures[referedScene];
                this.sphere.material.needsUpdate = true;

                for (let newArrow of this.scenes[referedScene]) {
                    this.#createArrow(newArrow.position, newArrow.ref);
                }

                this.#preloadNeighboringScenes(referedScene);
            }
        });
    }

    /**
     * Loads the scene data from a .json file
     * @param {String} tourFile Path to a .json file containing the tour data
    */
    async #fetchData(tourFile) {
        const response = await fetch(tourFile);
        this.scenes = await response.json();
    }

    /**
     * Starts the animation of the virtual tour
     */
    start() {
        this.animationId = requestAnimationFrame(this.start.bind(this));
        this.lookaroundControls.update();
        this.#updateArrowVisibility();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Stops the animation of the virtual tour 
     */
    stop() {
        cancelAnimationFrame(this.animationId);
    }

    /**
     * Changes the HTML element containing the virtual tour canvas
     * @param {String} elementId HTML element ID 
     */
    setContainer(elementId) {
        this.container.removeChild(this.renderer.domElement);
        this.container = document.getElementById(elementId);
        this.container.appendChild(this.renderer.domElement);
    }
}

export { VirtualTour };