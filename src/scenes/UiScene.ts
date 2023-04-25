export class UIScene extends Phaser.Scene {
    scoreText: Phaser.GameObjects.Text;
    counter = 0;

    constructor() {
        super({ key: "uiScene", active: true });
    }

    create() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        console.log("canvas", w, h);
        console.log(this.game.config);
        // Add your UI elements to this scene
        this.scoreText = this.add
            .text(w, h, `Score: ${this.counter}`, {
                fontSize: "32px",
                color: "#fff",
            })
            .setOrigin(1, 1);
        this.scale.on("resize", (ev) => {
            console.log("yeet")
            if (this.scoreText) {
                const [w, h] = [this.game.canvas.width, this.game.canvas.height];
                this.scoreText.x = w;
                this.scoreText.y = h;
            }
        });

        // Set the scrollFactor of the UI elements to 0
        this.scoreText.setScrollFactor(0);
    }

    setScore() {
        this.counter += 1;
        this.scoreText.setText(`Score: ${this.counter}`)
    }

    update() {
        const [w, h] = [this.game.canvas.width, this.game.canvas.height];
        console.log("canvas", w, h);
    }
}
