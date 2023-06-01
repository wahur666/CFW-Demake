import IconButton from "../entity/IconButton";
import { Images } from "./PreloadScene";
import Pointer = Phaser.Input.Pointer;

export class UIScene extends Phaser.Scene {
    scoreText: Phaser.GameObjects.Text;
    counter = 0;
    backgroundRect: Phaser.GameObjects.Rectangle;
    buttons: IconButton[] = [];

    constructor() {
        super({ key: "uiScene", active: true });
    }

    create() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        console.log("canvas", w, h);
        console.log(this.game.config);

        this.backgroundRect = this.add.rectangle(0, h, 300, 200, 0x0a12fa, 1);
        this.backgroundRect.setOrigin(0, 1);
        this.backgroundRect.setInteractive();

        const a = new IconButton(this, 50, h - 150, Images.HQ_ICON);
        const b = new IconButton(this, 50 + a.width + 5, h - 150, Images.REFINERY_ICON);
        const c = new IconButton(this, 50 + a.width + b.width + 10, h - 150, Images.LIGHT_SHIPYARD_ICON);
        this.buttons = [a, b, c];
        // Add your UI elements to this scene
        this.scoreText = this.add
            .text(w, h, `Score: ${this.counter}`, {
                fontSize: "32px",
                color: "#fff",
            })
            .setOrigin(1, 1);
        this.scale.on("resize", (ev) => {
            const [w, h] = [this.game.canvas.width, this.game.canvas.height];
            if (this.scoreText) {
                this.scoreText.x = w;
                this.scoreText.y = h;
            }
            this.backgroundRect.y = h;
        });

        // Set the scrollFactor of the UI elements to 0
        this.scoreText.setScrollFactor(0);
    }

    handlePointerOver(pointer: Pointer, gameObjects: any[], inHandler: Function) {
        if (gameObjects[0] === this.backgroundRect) {
            inHandler();
        } else if (this.buttons.includes(gameObjects[0])) {
            inHandler();
        }
    }

    handlePointerOut(pointer: Pointer, gameObjects: any[], inHandler: Function, outHandler: Function) {
        if (gameObjects[0] === this.backgroundRect) {
            outHandler();
        } else if (this.buttons.includes(gameObjects[0])) {
            inHandler();
        }
    }

    registerInOutEventHandlers(inHandler: Function, outHandler: Function) {
        this.input.on("pointerover", (pointer, gameObjects) => this.handlePointerOver(pointer, gameObjects, inHandler));
        this.input.on("pointerout", (pointer, gameObjects) => this.handlePointerOut(pointer, gameObjects, inHandler, outHandler));
    }

    setScore() {
        this.counter += 1;
        this.scoreText.setText(`Score: ${this.counter}`);
    }

    update() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        // this.background.clear();
        // this.background.fillStyle(0x0000FF, 1);
        // this.background.fillRect(0, h - 200, 300, 200);
    }
}
