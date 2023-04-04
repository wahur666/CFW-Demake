import {Images} from "../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;


export default class Wormhole extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.WORMHOLE);
        this.scene.add.existing(this);
        this.setScale(0.2);
    }

    get pos(): Vector2 {
        return new Vector2(this.x, this.y);
    }

}
