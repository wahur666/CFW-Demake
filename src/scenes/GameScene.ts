import Phaser from "phaser";
import { SceneRegistry } from "./SceneRegistry";
import { SHARED_CONFIG } from "../model/config";
import Wormhole from "../entity/Wormhole";
import Unit from "../entity/Unit";
import { route } from "preact-router";
import Building from "../entity/Building";
import { Images } from "./PreloadScene";
import Planet from "../entity/Planet";

export default class GameScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    private wh1: Wormhole;
    private wh2: Wormhole;
    private unit1: Unit;
    private inSector1 = true;
    private graphics: Phaser.GameObjects.Graphics;
    private building: Building | null = null;
    private planet: Planet;
    private controls: Phaser.Cameras.Controls.FixedKeyControl;

    constructor() {
        super(SceneRegistry.GAME);
        // @ts-ignore
        window.game = this;
        this.config = SHARED_CONFIG;
    }

    create() {
        // this.input.mouse.disableContextMenu();
        const rect1 = this.add.rectangle(10, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        const rect2 = this.add.rectangle(500, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        this.wh1 = new Wormhole(this, 260, 120);
        this.wh2 = new Wormhole(this, 560, 120);
        this.unit1 = new Unit(this, 50, 50);
        this.graphics = this.add.graphics();
        this.input.keyboard.on("keyup-ESC", (ev) => {
            route("/", true);
        });
        this.input.on("pointerdown", (ev) => {
            console.log("mouseee", ev);
        });

        // const cursors = this.input.keyboard.createCursorKeys();

        // const controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        //     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        //     acceleration: 0.06,
        //     drag: 0.0005,
        //     maxSpeed: 1.0
        // };

        // this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        //     up: cursors.up,
        //     down: cursors.down,
        //     left: cursors.left,
        //     right: cursors.right,
        //     camera: this.cameras.main,
        //     speed: 1,
        //     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        //     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        //     zoomSpeed: 0.01
        // });
        //
        // const cam = this.cameras.main;
        //
        //
        // this.input.on("wheel",  (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        //
        //     if (deltaY > 0) {
        //         var newZoom = cam.zoom -.1;
        //         if (newZoom > 0.3) {
        //             cam.zoom = newZoom;
        //         }
        //     }
        //
        //     if (deltaY < 0) {
        //         var newZoom = cam.zoom +.1;
        //         if (newZoom < 1.3) {
        //             cam.zoom = newZoom;
        //             cam.pan(pointer.worldX, pointer.worldY, 10, "Power2");
        //         }
        //     }
        //
        //
        // });

        this.input.keyboard.on("keyup-Q", (ev) => {
            if (this.building) {
                this.building.wide = 1;
            }
        });

        this.input.keyboard.on("keyup-W", (ev) => {
            if (this.building) {
                this.building.wide = 2;
            }
        });

        this.input.keyboard.on("keyup-E", (ev) => {
            if (this.building) {
                this.building.wide = 3;
            }
        });

        this.input.on("pointermove", (ev) => {
            if (this.building) {
                const distance = Phaser.Math.Distance.Between(
                    ev.x,
                    ev.y,
                    this.planet.x,
                    this.planet.y
                );
                if (Math.abs(distance - this.planet.radius) < 20) {
                    this.building.unBound = false;
                    this.building.nearPlanet = this.planet;
                    const loc = this.building.calculatePlace(this.planet, ev.x, ev.y);
                    console.log("loc", loc);
                } else {
                    this.building.unBound = true;
                    this.building.nearPlanet = null;
                    this.building.setPosition(ev.x, ev.y);
                }
            }
        });

        this.planet = new Planet(this, 500, 500, Images.PLANET);
        this.building = new Building(this, 500, 500, Images.HOUSE_ICON);
    }

    update(time: number, delta: number) {
        this.building?.update(delta);
        this.planet?.update(delta);
        // this.controls.update(delta);
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
