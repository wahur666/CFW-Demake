import { Images } from "../../scenes/PreloadScene";
import { GAME_SCALE } from "../../helpers/utils";
import Vector2 = Phaser.Math.Vector2;

export class GasResource extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, position: Vector2) {
        super(scene, position.x, position.y, Images.LAVA_PLANET);
        this.scene.add.existing(this);
        this.setScale(0.4 * GAME_SCALE);
    }
}
