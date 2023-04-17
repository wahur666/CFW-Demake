import {Images} from "../../scenes/PreloadScene";


export class OreResource extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.BAREN_PLANET);
        this.scene.add.existing(this);
        this.setScale(0.4)
    }

}
