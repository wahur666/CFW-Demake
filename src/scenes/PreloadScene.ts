import * as Phaser from "phaser";
import { SceneRegistry } from "./SceneRegistry";
import { defaultFont } from "../helpers/utils";
import { SHARED_CONFIG } from "../model/config";

import wormhole from "../assets/ufoBlue.png";
import corvette from "../assets/playerShip1_blue.png";
import structure_house from "../assets/structure_house.png";
import structure_farm from "../assets/structure_farm.png";
import planet00 from "../assets/planet00_d.png";
import factory_icon from "../assets/icons8-factory-96.png";
import home_icon from "../assets/icons8-home-96.png";
import lava_planet from "../assets/Lava.png";
import baren_planet from "../assets/Baren.png";
import fabricator from "../assets/enemyBlack3.png";
import harvester from "../assets/enemyBlack4.png";

export enum Images {
    HOUSE_ICON = "house-icon",
    FARM_ICON = "farm-icon",
    WORMHOLE = "wormhole",
    CORVETTE = "corvette",
    PLANET = "planet",
    FACTORY_ICON = "factory-icon",
    HOME_ICON = "home-icon",
    LAVA_PLANET = "lava-planet",
    BAREN_PLANET = "baren-planet",
    FABRICATOR = "fabricator",
    HARVESTER = "harvester",
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
            fontSize: "50px",
        });
        this.background = this.add.rectangle(this.config.width / 2, this.config.height / 2 + 50, 600, 50, 0xffffff);
        this.foreground = this.add.rectangle(343, this.config.height / 2 + 50, 595, 45, 0x233565).setOrigin(0, 0.5);
        this.load.on("progress", (value) => {
            this.foreground.setDisplaySize((595 * value) | 0, 45);
        });
    }

    preload() {
        this.load.image(Images.CORVETTE, corvette);
        this.load.image(Images.WORMHOLE, wormhole);
        this.load.image(Images.HOUSE_ICON, structure_house);
        this.load.image(Images.FARM_ICON, structure_farm);
        this.load.image(Images.PLANET, planet00);
        this.load.image(Images.FACTORY_ICON, factory_icon);
        this.load.image(Images.HOME_ICON, home_icon);
        this.load.image(Images.LAVA_PLANET, lava_planet);
        this.load.image(Images.BAREN_PLANET, baren_planet);
        this.load.image(Images.FABRICATOR, fabricator);
        this.load.image(Images.HARVESTER, harvester);
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
