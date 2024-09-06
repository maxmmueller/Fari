import * as THREE from 'three';

class TourSceneLayer extends THREE.Scene {
    constructor(startLocation, preloadedTextures) {
        super();
        this.startLocation = startLocation;
        this.preloadedTextures = preloadedTextures;
    }
}

export { TourSceneLayer };
