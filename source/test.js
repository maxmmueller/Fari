import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


class VirtualTour {
    constructor(tourFile) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-1, 0, 0);

        this.textureLoader = new THREE.TextureLoader();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.lookaroundControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.lookaroundControls.enableZoom = false;
        this.lookaroundControls.rotateSpeed = -0.4;

        this.arrows = [];

        this.createSphere("images/" + scenes.startLocation + ".jpg");
        for (let arrow of scenes[scenes.startLocation]) {
            this.createArrow(arrow.possition, arrow.ref);
            console.log(arrow.possition);
        }
    }

    createSphere(texturePath) {
        const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            map: this.textureLoader.load(texturePath),
            side: THREE.DoubleSide
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
    }

    createArrow(coordinates, ref) {
        const arrowTexture = this.textureLoader.load('assets/arrow.png');
        const arrowMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const arrowSprite = new THREE.Sprite(arrowMaterial);
        arrowSprite.scale.set(2, 2, 1);
        arrowSprite.position.set(coordinates[0], coordinates[1], coordinates[2]);
        arrowSprite.userData.ref = "images/" + ref;
        this.scene.add(arrowSprite);
        this.arrows.push(arrowSprite);
    }

    // displays the arrow if its in the middle third of the screen
    updateArrowVisibility() {
        const arrowPosition = this.arrows[0].position.clone();
        arrowPosition.project(this.camera);
        // this.arrows[0].visible = (arrowPosition.x > -0.7 && arrowPosition.x < 0.7);
    }
}



const scenes = {
    startLocation: "pano_1",
    pano_1: [{ possition: [45, 3, 0], ref: "pano_2.jpg" }, { possition: [-10, 0, -25], ref: "pano_4.jpg" }],
    pano_2: [{ possition: [-10, 2, -25], ref: "pano_1.jpg" }]
};

const testTour = new VirtualTour("scenes.json");

function animate() {
    requestAnimationFrame(animate);
    testTour.lookaroundControls.update();
    testTour.updateArrowVisibility();
    testTour.renderer.render(testTour.scene, testTour.camera);
}

animate();

window.addEventListener('resize', () => {
    testTour.renderer.setSize(window.innerWidth, window.innerHeight);
    testTour.camera.aspect = window.innerWidth / window.innerHeight;
    testTour.camera.updateProjectionMatrix();
});


window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, testTour.camera);

    // checks if any of the arrows were clicked
    for (let arrow of testTour.arrows) {
        const intersects = raycaster.intersectObject(arrow);
        if (intersects.length > 0) {
            testTour.scene.remove(testTour.sphere);

            // moves to the corresponfing pano view
            testTour.sphere = testTour.createSphere(arrow.userData.ref);
            testTour.scene.add(testTour.sphere);
        }
    }
});

// function processObject(object) {
//     if (object instanceof THREE.Sprite) {
//         console.log('Found sprite:', object);
//     }
// }
// scene.traverse(processObject);
