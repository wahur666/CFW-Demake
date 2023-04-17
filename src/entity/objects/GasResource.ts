import {Images} from "../../scenes/PreloadScene";


export class GasResource extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.LAVA_PLANET);
        this.scene.add.existing(this);
        this.setScale(0.4)
    }

}
