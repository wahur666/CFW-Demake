import {Images} from "../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;


export default class Unit extends Phaser.Physics.Arcade.Sprite {
    travelling = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.SHIP);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.5);
    }
    get pos(): Vector2 {
        return new Vector2(this.x, this.y);
    }

}
