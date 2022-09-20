import Phaser from "phaser";
import {SceneRegistry} from "./SceneRegistry";
import {SHARED_CONFIG} from "../model/config";
import Wormhole from "../model/Wormhole";
import Unit from "../model/Unit";
import {invoke} from "@tauri-apps/api";
import {route} from "preact-router";
import Building from "../model/Building";
import {Images} from "./PreloadScene";
import Planet from "../model/Planet";


export default class GameScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    private wh1: Wormhole;
    private wh2: Wormhole;
    private unit1: Unit;
    private inSector1 = true;
    private graphics: Phaser.GameObjects.Graphics;
    private building: Building | null = null;
    private planet: Planet;

    constructor() {
        super(SceneRegistry.GAME);
        // @ts-ignore
        window.game = this;
        this.config = SHARED_CONFIG;
    }

    create() {
        // this.input.mouse.disableContextMenu();
        const rect1 = this.add.rectangle(10, 10, 300, 300, 0xA1A1A1).setOrigin(0, 0);
        const rect2 = this.add.rectangle(500, 10, 300, 300, 0xA1A1A1).setOrigin(0, 0);
        this.wh1 = new Wormhole(this, 260, 120);
        this.wh2 = new Wormhole(this, 560, 120);
        this.unit1 = new Unit(this, 50, 50);
        this.graphics = this.add.graphics();
        this.input.keyboard.on("keyup-ESC", (ev) => {
            route("/", true);
        })
        this.input.keyboard.on("keyup-Q", (ev) => {
            if (this.building) {
                this.building.wide = 1
            }
        });

        this.input.keyboard.on("keyup-W", (ev) => {
            if (this.building) {
                this.building.wide = 2
            }
        });

        this.input.keyboard.on("keyup-E", (ev) => {
            if (this.building) {
                this.building.wide = 3
            }
        });

        this.input.keyboard.on("keyup-Q", (ev) => {

        });

        this.input.on('pointermove', (ev) => {
            if (this.building) {
                const distance = Phaser.Math.Distance.Between(ev.x, ev.y, this.planet.x, this.planet.y);
                if (Math.abs(distance - this.planet.radius) < 20) {
                    this.building.unBound = false;
                    this.building.calculatePlace(this.planet, ev.x, ev.y);
                } else {
                    this.building.unBound = true;
                    this.building.setPosition(ev.x, ev.y);
                }
            }
        });

        this.planet = new Planet(this, 500, 500, Images.PLANET);
        this.building = new Building(this, 500, 500, Images.HOUSE_ICON);
        invoke("greet", {name: "yeet"}).then(console.log)
    }


    update(time: number, delta: number) {
        this.building?.update(delta);
        this.planet.update();
        // if (this.unit1.travelling) {
        //     this.graphics.clear();
        //     this.graphics.lineStyle(1, 0x00FF00);
        //     this.graphics.lineBetween(this.wh1.x, this.wh1.y, this.wh2.x, this.wh2.y);
        //     return;
        // }
        // if (this.inSector1) {
        //     if (this.unit1.pos.distance(this.wh1.pos) <= 5) {
        //         this.unit1.setPosition(this.wh2.x, this.wh2.y);
        //         this.inSector1 = false;
        //         this.unit1.visible = false;
        //         this.unit1.body.stop();
        //         this.unit1.travelling = true;
        //         setTimeout(() => {
        //             this.unit1.visible = true;
        //             this.unit1.travelling = false;
        //         }, 1000);
        //     } else {
        //         this.unit1.setRotation(Math.atan2(-this.unit1.y + this.wh1.y, -this.unit1.x + this.wh1.x) + Math.PI / 2);
        //         this.physics.moveTo(this.unit1, this.wh1.x, this.wh1.y, 50);
        //     }
        // } else {
        //     this.graphics.clear();
        //     const target = {x: 600, y: 50};
        //     if (this.unit1.pos.distance(target) <= 5) {
        //         this.unit1.body.stop();
        //     } else {
        //         this.unit1.setRotation(Math.atan2(-this.unit1.y + target.y, -this.unit1.x + target.x) + Math.PI / 2);
        //         this.physics.moveTo(this.unit1, target.x, target.y, 30);
        //     }
        // }
    }


}


