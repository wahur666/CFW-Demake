import Wormhole from "../../entity/Wormhole";
import GameScene from "../../scenes/GameScene";

export default class Sector {
    wormholes: Wormhole[] = [];
    size = 32;
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: GameScene) {
        this.graphics = scene.add.graphics();
    }

    update() {
        // const rect1 = this.graphics.fillRectShape(10, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        // const rect2 = this.add.rectangle(500, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
    }
}
