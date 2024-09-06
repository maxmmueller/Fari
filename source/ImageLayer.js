import { TourSceneLayer } from './TourSceneLayer.js';

import * as THREE from 'three';


class ImageLayer extends TourSceneLayer {
    constructor(startLocation, preloadedTextures) {
        super(startLocation, preloadedTextures);
        this.createProjectionSphere();
    }
    
    createProjectionSphere() {
        const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
        const texture = this.preloadedTextures[this.startLocation];
        if (!texture) throw new Error(`Texture for startLocation (${this.startLocation}) is not loaded.`);
        
        const sphereMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            transparent: true,
            opacity: 1
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.add(this.sphere);
    }

    updateTexture(scene, texture) {
        this.sphere.material.map = texture;
        this.sphere.material.needsUpdate = true;
    }
}

export { ImageLayer };
