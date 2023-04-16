import {SupportUnit} from "./SupportUnit";
import Phaser from "phaser";
import {Images} from "../../scenes/PreloadScene";


enum PayloadType {
    ORE,
    GAS
}

export class Harvester extends SupportUnit {

    harvestRange: number;
    capacity: number;
    payload: PayloadType;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.HARVESTER);
        this.flipY = true
    }

    harvest() {

    }
}
