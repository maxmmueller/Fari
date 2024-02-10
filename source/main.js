import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const scenes = {
    pano_1: [{ possition: [45, 3, 0], ref: "pano_2.jpg" }, { possition: [-10, 0, -25], ref: "pano_2.jpg" }],
    pano_2: [{ possition: [-10, 2, -25], ref: "pano_1.jpg" }]
};

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-1, 0, 0);
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const lookaroundControls = new OrbitControls(camera, renderer.domElement);
lookaroundControls.enableZoom = false;
lookaroundControls.rotateSpeed = -0.4;

let sphere = createSphere('images/pano_4.jpg');
let arrowSprite = createArrow([-10, 0, -25], "pano_1.jpg");
const arrows = [arrowSprite];


function animate() {
    requestAnimationFrame(animate);
    lookaroundControls.update();
    updateArrowVisibility();
    renderer.render(scene, camera);
}
animate();


// displays the arrow if its in the middle third of the screen
function updateArrowVisibility() {
    const arrowPosition = arrowSprite.position.clone();
    arrowPosition.project(camera);
    arrowSprite.visible = (arrowPosition.x > -0.7 && arrowPosition.x < 0.7);
}


function createArrow(coordinates, ref) {
    const arrowTexture = textureLoader.load('assets/arrow.png');
    const arrowMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
    const arrowSprite = new THREE.Sprite(arrowMaterial);
    arrowSprite.scale.set(2, 2, 1);
    arrowSprite.position.set(coordinates[0], coordinates[1], coordinates[2]);
    arrowSprite.userData.ref = "images/" + ref;
    scene.add(arrowSprite);
    return arrowSprite;
}


function createSphere(texturePath) {
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texturePath),
        side: THREE.DoubleSide
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    return sphere;
}


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // checks if any of the arrows were clicked
    for (let arrow of arrows) {
        const intersects = raycaster.intersectObject(arrow);
        if (intersects.length > 0) {
            scene.remove(sphere);

            // moves to the corresponfing pano view
            sphere = createSphere(arrow.userData.ref);
            scene.add(sphere);
        }
    }
});
