import { SupportUnit } from "./SupportUnit";
import Phaser from "phaser";
import { Images } from "../../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;

export class Fabricator extends SupportUnit {
    constructor(scene: Phaser.Scene, position: Vector2) {
        super(scene, position.x, position.y, Images.FABRICATOR);
        this.flipY = true;
    }

    build() {}
}
