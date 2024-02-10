import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


class VirtualTour {
    /**
     * @param {String} tourFile path to a .json file containing the tour data
     */
    constructor(tourFile) {
        this.arrows = [];
        this.scenes;
        this.textureLoader = new THREE.TextureLoader();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-1, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.lookaroundControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.lookaroundControls.enableZoom = false;
        this.lookaroundControls.rotateSpeed = -0.4;

        // loads the scene from a .json file
        this.fetchData(tourFile)
            .then(() => {
                this.createSphere("images/" + this.scenes.startLocation + ".jpg");
                for (let arrow of this.scenes[this.scenes.startLocation]) {
                    this.createArrow(arrow.position, arrow.ref);
                }

                this.addResizeListener();
                this.addArrowClickListener();
            });
    }

    /**
     * Adds a pano-image projected onto a sphere to the scene
     * @param {String} texturePath file path to a 360° panoramic image
     */
    createSphere(texturePath) {
        const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            map: this.textureLoader.load(texturePath),
            side: THREE.DoubleSide
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
    }

    /**
     * Adds arrow buttons that link to other scenes
     * @param {int[]} coordinates int array containing the arrows x,y,z coordinates
     * @param {String} ref name of the linkes panoramic scene
     */
    createArrow(coordinates, ref) {
        const arrowTexture = this.textureLoader.load('assets/arrow.png');
        const arrowMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const arrowSprite = new THREE.Sprite(arrowMaterial);
        arrowSprite.scale.set(2, 2, 1);
        arrowSprite.position.set(coordinates[0], coordinates[1], coordinates[2]);
        arrowSprite.userData.ref = ref;
        this.scene.add(arrowSprite);
        this.arrows.push(arrowSprite);
    }

    /**
     * Displays an arrow if it's in the middle section of the screen
     */
    updateArrowVisibility() {
        for (let arrow of this.arrows) {
            const arrowPosition = arrow.position.clone();
            arrowPosition.project(this.camera);
            arrow.visible = (arrowPosition.x > -0.7 && arrowPosition.x < 0.7);
        }
    }

    /**
     * Adapts the scenes size to the viewports size
     */
    addResizeListener() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    /**
     * Listens for clicks on the arrows and switches to the corresponding scenes 
     */
    addArrowClickListener() {
        window.addEventListener('click', (event) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            // checks if any of the arrows were clicked
            for (let arrow of this.arrows) {
                const clicked = raycaster.intersectObject(arrow).length > 0;
                if (!clicked) continue;

                // removes old scene and its arrows
                this.scene.remove(this.sphere);
                this.arrows.forEach(a => this.scene.remove(a));
                this.arrows = [];
                
                // moves to the new scene
                const referedScene = arrow.userData.ref;
                this.sphere = this.createSphere("images/" + referedScene + ".jpg");
                for (let newArrow of this.scenes[referedScene]) {
                    this.createArrow(newArrow.position, newArrow.ref);
                }
            }
        });
    }

    /**
     * loads the scene data from a .json file
     * @param {String} tourFile path to a .json file containing the tour data
     */
    async fetchData(tourFile) {
        const response = await fetch(tourFile);
        this.scenes = await response.json();
        // return this.scenes
    }
}


const testTour = new VirtualTour("scenes.json");
animate();

function animate() {
    requestAnimationFrame(animate);
    testTour.lookaroundControls.update();
    testTour.updateArrowVisibility();
    testTour.renderer.render(testTour.scene, testTour.camera);
}
