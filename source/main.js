import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class VirtualTour {
    /**
     * @param {String} tourFile Path to a .json file containing the tour data
     * @param {String} elementId ID of an HTML element to contain the virtual tour
     * @param {String} imageDirectory Directory containing the panoramic images
     */
    constructor(tourFile, elementId, imageDirectory) {
        this.arrows = [];
        this.scenes;
        this.imageDirectory = imageDirectory;
        this.arrowImagePath = '../node_modules/fari/source/assets/dot.png';
        this.textureLoader = new THREE.TextureLoader();

        this.container = document.getElementById(elementId)
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

        // loads the scene from a .json file
        this.#fetchData(tourFile)
            .then(() => {
                this.#createSphere(this.imageDirectory + "/" + this.scenes.startLocation + ".jpg");
                for (let arrow of this.scenes[this.scenes.startLocation]) {
                    this.#createArrow(arrow.position, arrow.ref);
                }

                this.#addResizeListener();
                this.#addArrowClickListener();
            });
    }

    /**
     * Adds a pano-image projected onto a sphere to the scene
     * @param {String} texturePath File path to a 360° panoramic image
     */
    #createSphere(texturePath) {
        const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
        const texture = this.textureLoader.load(texturePath);
        texture.colorSpace = THREE.SRGBColorSpace;
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

    /**
     * Listens for clicks on the arrows and switches to the corresponding scenes 
     */
    #addArrowClickListener() {
        window.addEventListener('click', (event) => {
            const mouse = new THREE.Vector2();

            const offsetTop = this.container.getBoundingClientRect().y;
            const offsetLeft = this.container.getBoundingClientRect().x;
            mouse.x = ((event.clientX - offsetLeft) / this.container.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - offsetTop) / this.container.clientHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            // checks if any of the arrows were clicked
            for (let arrow of this.arrows) {
                const clicked = raycaster.intersectObject(arrow).length > 0;
                if (!clicked) continue;

                // removes the arrows of the old scene
                this.arrows.forEach(a => this.scene.remove(a));
                this.arrows = [];

                // moves to the new scene
                const referedScene = arrow.userData.ref;
                const newTexture = this.textureLoader.load(this.imageDirectory + "/" + referedScene + ".jpg");
                newTexture.colorSpace = THREE.SRGBColorSpace;
                this.sphere.material.map = newTexture;
                this.sphere.material.needsUpdate = true;

                for (let newArrow of this.scenes[referedScene]) {
                    this.#createArrow(newArrow.position, newArrow.ref);
                }
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
     * Changes the HTML element containing the virtual tour
     * @param {String} elementId HTML element ID 
     */
    setContainer(elementId) {
        this.container.removeChild(this.renderer.domElement);
        this.container = document.getElementById(elementId);
        this.container.appendChild(this.renderer.domElement);
    }
}

export { VirtualTour };