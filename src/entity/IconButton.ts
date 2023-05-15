import Phaser from "phaser";

export default class IconButton extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.setInteractive();
        this.on("pointerdown", () => {
            console.log("icon button clicked");
        });
    }
}
