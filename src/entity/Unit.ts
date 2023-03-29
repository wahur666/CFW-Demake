import {Images} from "../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;

export default class Unit extends Phaser.Physics.Arcade.Sprite {
    travelling = false;
    selected = false;
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.SHIP);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.5);
        this.graphics = this.scene.add.graphics()
    }
    get pos(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    update(delta: number) {
        this.graphics.clear();
        if (this.selected) {
            this.graphics.lineStyle(2, 0x00ff00, 1);
            this.graphics.strokeCircle(this.x, this.y, this.width * 1.2 * this.scale / 2);
        }
    }

}
