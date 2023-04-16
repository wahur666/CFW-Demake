import {FighterUnit} from "./FighterUnit";
import {Images} from "../../scenes/PreloadScene";


export class Corvette extends FighterUnit {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.CORVETTE);
    }

}
