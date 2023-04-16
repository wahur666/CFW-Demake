import {SupportUnit} from "./SupportUnit";
import Phaser from "phaser";
import {Images} from "../../scenes/PreloadScene";


export class Fabricator extends SupportUnit {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.FABRICATOR);
        this.flipY = true
    }

    build() {

    }

}
