import * as Phaser from "phaser";
import {SceneRegistry} from "./SceneRegistry";
import wormhole from "../assets/ufoBlue.png";
import ship from "../assets/playerShip1_blue.png";
import {defaultFont} from "../helpers/utils";
import {SHARED_CONFIG} from "../model/config";

export enum Images {
    WORMHOLE = "wormhole",
    SHIP = "ship"
}


export default class PreloadScene extends Phaser.Scene {
    loadingText: Phaser.GameObjects.Text;
    background: Phaser.GameObjects.Rectangle;
    foreground: Phaser.GameObjects.Rectangle;
    private config: typeof SHARED_CONFIG;

    constructor() {
        super(SceneRegistry.PRELOAD);
        this.config = SHARED_CONFIG;
    }

    createLoadingGui() {
        this.loadingText = this.add.text(this.config.width / 2 - 85, this.config.height / 2 - 110, "Loading...", {
            fontFamily: defaultFont,
            fontSize: "50px"
        });
        this.background = this.add.rectangle(this.config.width / 2, this.config.height / 2 + 50, 600, 50, 0xFFFFFF);
        this.foreground = this.add.rectangle(343, this.config.height / 2 + 50, 595, 45, 0x233565)
            .setOrigin(0, 0.5);
        this.load.on("progress", (value) => {
            this.foreground.setDisplaySize(595 * value | 0, 45);
        });
    }

    preload() {
        this.load.image(Images.SHIP, ship);
        this.load.image(Images.WORMHOLE, wormhole);
        this.createLoadingGui();
        this.load.once("complete", () => {
            this.startGame();
        });
    }

    startGame() {
        this.foreground.destroy();
        this.background.destroy();
        this.loadingText.destroy();
        this.scene.start(SceneRegistry.GAME);
    }

}
