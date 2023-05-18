import IconButton from "../entity/IconButton";
import { Images } from "./PreloadScene";

export class UIScene extends Phaser.Scene {
    scoreText: Phaser.GameObjects.Text;
    counter = 0;
    backgroundRect: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "uiScene", active: true });
    }

    create() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        console.log("canvas", w, h);
        console.log(this.game.config);

        this.backgroundRect = this.add.rectangle(0, h, 300, 200, 0x0a12fa, 1);
        this.backgroundRect.setOrigin(0, 1);
        this.backgroundRect.setInteractive()

        const a = new IconButton(this, 50, h - 150, Images.HQ_ICON);
        const b = new IconButton(this, 50 + a.width + 5, h - 150, Images.REFINERY_ICON);
        const c = new IconButton(this, 50 + a.width + b.width + 10, h - 150, Images.LIGHT_SHIPYARD_ICON);
        // Add your UI elements to this scene
        this.scoreText = this.add
            .text(w, h, `Score: ${this.counter}`, {
                fontSize: "32px",
                color: "#fff",
            })
            .setOrigin(1, 1);
        this.scale.on("resize", (ev) => {
            const [w, h] = [this.game.canvas.width, this.game.canvas.height];
            console.log("yeet");
            if (this.scoreText) {
                this.scoreText.x = w;
                this.scoreText.y = h;
            }
            this.backgroundRect.y = h;
        });

        this.backgroundRect.on("pointerdown", () => {
            console.log("fuck you");
        });

        // Set the scrollFactor of the UI elements to 0
        this.scoreText.setScrollFactor(0);
    }

    setScore() {
        this.counter += 1;
        this.scoreText.setText(`Score: ${this.counter}`);
    }

    update() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        console.log("canvas", w, h);
        // this.background.clear();
        // this.background.fillStyle(0x0000FF, 1);
        // this.background.fillRect(0, h - 200, 300, 200);
    }
}
