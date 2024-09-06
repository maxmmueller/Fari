import * as THREE from 'three';

import { TourSceneLayer } from './TourSceneLayer.js';
import dot from './assets/dot.png';

class ArrowLayer extends TourSceneLayer {
    constructor(startLocation, scenes, textureLoader) {
        super(startLocation, {});
        this.scenes = scenes;
        this.textureLoader = textureLoader;
        this.arrows = [];
        this.arrowImagePath = dot;
        this.createArrows(scenes[startLocation]);
    }

    createArrows(arrowData) {
        arrowData.slice(1).forEach(arrow => {
            const arrowTexture = this.textureLoader.load(this.arrowImagePath);
            const arrowMaterial = new THREE.SpriteMaterial({ map: arrowTexture });

            const arrowSprite = new THREE.Sprite(arrowMaterial);
            arrowSprite.scale.set(5, 5, 1);
            // (vorne/hinten    oben/unten    links/rechts) <--- (x,y,z)
            arrowSprite.position.set(...arrow.position);
            arrowSprite.userData.ref = arrow.ref;
            this.add(arrowSprite);
            this.arrows.push(arrowSprite);
        });
    }

    async clearArrows() {
        this.arrows.forEach(arrow => this.remove(arrow));
        this.arrows = [];
    }
}

export { ArrowLayer };
