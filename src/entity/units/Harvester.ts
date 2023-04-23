import { SupportUnit } from "./SupportUnit";
import Phaser from "phaser";
import { Images } from "../../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;

enum PayloadType {
    ORE,
    GAS,
}

export class Harvester extends SupportUnit {
    harvestRange: number;
    capacity: number;
    payload: PayloadType;

    constructor(scene: Phaser.Scene, position: Vector2) {
        super(scene, position.x, position.y, Images.HARVESTER);
        this.flipY = true;
    }

    harvest() {}
}
