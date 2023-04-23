import { FighterUnit } from "./FighterUnit";
import { Images } from "../../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;

export class Corvette extends FighterUnit {
    constructor(scene: Phaser.Scene, position: Vector2) {
        super(scene, position.x, position.y, Images.CORVETTE);
    }
}
