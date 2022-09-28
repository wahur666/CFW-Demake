import GameScene from "../scenes/GameScene";
import {d2r} from "../helpers/utils";


export default class Planet extends Phaser.GameObjects.Sprite {

    radius = 130;
    graphics: Phaser.GameObjects.Graphics;
    showBuildRings = true;

    constructor(scene: GameScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.graphics = this.scene.add.graphics()
    }

    update() {
        if (this.showBuildRings) {
            this.graphics.clear();
            this.graphics.lineStyle(5, 0x23a343, 1);
            for (let i = 0; i < 12; i++) {
                this.graphics.beginPath();
                this.graphics.arc(this.x, this.y, this.radius, d2r(i * 30 + 3), d2r(i * 30 + 27));
                this.graphics.stroke();
            }

        }

    }


}