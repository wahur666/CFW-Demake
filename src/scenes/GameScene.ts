import Phaser from "phaser";
import {SceneRegistry} from "./SceneRegistry";
import {SHARED_CONFIG} from "../model/config";
import Wormhole from "../entity/Wormhole";
import Unit from "../entity/Unit";
import {route} from "preact-router";
import Building from "../entity/Building";
import {Images} from "./PreloadScene";
import Planet from "../entity/Planet";
import Pointer = Phaser.Input.Pointer;
import Vector2 = Phaser.Math.Vector2;
import GameMap from "../model/GameMap/GameMap";
import {inRect} from "../helpers/utils";
import cursor from "../assets/cursor.png";
import {Navigation} from "../model/Navigation";

export default class GameScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    private unit1: Unit;
    private inSector1 = true;
    private graphics: Phaser.GameObjects.Graphics;
    private graphics2: Phaser.GameObjects.Graphics;
    private building: Building | null = null;
    private planet: Planet;
    private controls: Phaser.Cameras.Controls.FixedKeyControl;
    private wormholes: Wormhole[] = [];

    private target: Vector2 | null = null;
    private map: GameMap;
    private dragging = false;
    private dragStart: Vector2 | null = null;
    private navi: Navigation;

    constructor() {
        super(SceneRegistry.GAME);
        // @ts-ignore
        window.game = this;
        this.config = SHARED_CONFIG;
    }

    create() {
        const size = 64;
        this.input.setDefaultCursor(`url(${cursor}), default`);
        const width = 20;
        const c = (a: number) => a * width;
        this.graphics = this.add.graphics();
        this.graphics2 = this.add.graphics();


        this.map = new GameMap(size);
        const navi = new Navigation(this.map);
        this.graphics.lineStyle(2, 0x0000ff);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.map.sectorNodeMap[i][j]) {
                    this.graphics.strokeRect(c(i), c(j), width, width);
                }
            }
        }
        for (const wormhole of this.map.wormholes) {
            const x1 = c(wormhole.node1.position.x) + 10;
            const y1 = c(wormhole.node1.position.y) + 10;
            this.wormholes.push(new Wormhole(this, x1, y1));
            const x2 = c(wormhole.node2.position.x) + 10;
            const y2 = c(wormhole.node2.position.y) + 10;
            this.wormholes.push(new Wormhole(this, x2, y2));
        }


        // this.input.mouse.disableContextMenu();
        // const rect1 = this.add.rectangle(10, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        // const rect2 = this.add.rectangle(500, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        // this.wh1 = new Wormhole(this, 260, 120);
        // this.wh2 = new Wormhole(this, 560, 120);
        this.unit1 = new Unit(this, 50, 50);
        this.input.keyboard.on("keyup-ESC", (ev) => {
            route("/", true);
        });

        this.input.on("pointerdown", (ev: Pointer) => {
            console.log(ev.button);
            if (ev.button === 0) {
                this.dragging = true;
                this.dragStart = ev.position.clone();
            } else if (ev.button === 2) {
                const [x, y] = this.calcSquare(ev.x, ev.y);
                if (this.unit1.selected) {
                    const [x1, y1] = this.calcSquare(this.unit1.x, this.unit1.y);
                    const path = navi.findPath(this.map.getNode(x1, y1), this.map.getNode(x, y))
                        .map(e => e.position.clone().multiply({
                            x: 20,
                            y: 20
                        }).add({x: 10, y: 10}));
                    // console.log(path)
                    this.unit1.setNav(path)
                }
            }
        });
        this.input.on("pointerup", (ev: Pointer) => {
            if (ev.button === 0) {
                if (this.dragStart) {
                    this.unit1.selected = inRect(this.unit1.pos, ev.position, this.dragStart);
                }
                this.dragging = false;
                this.dragStart = null;
                this.graphics2.clear();
            }
        })

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

        this.input.on("pointermove", (ev: Pointer) => {
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
            if (this.dragging) {
                this.drawSelectionRect(ev);
            }
        });

        // this.planet = new Planet(this, 500, 500, Images.PLANET);
        // this.building = new Building(this, 500, 500, Images.HOUSE_ICON);
    }

    calcSquare(x: number, y: number): [number, number] {
        return [Math.floor(x / 20), Math.floor(y / 20)]
    }

    update(time: number, delta: number) {
        this.building?.update(delta);
        this.planet?.update(delta);
        this.unit1.update(delta);

        const [x, y] = this.calcSquare(this.unit1.x, this.unit1.y);
        // this.graphics2.clear();
        // this.graphics2.fillStyle(0x00ff00, 1);
        // this.graphics2.fillRect(x * 20, y * 20, 20, 20);
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
        if (this.target) {
            if (this.unit1.pos.distance(this.target) <= 5) {
                this.unit1.body.stop();
                this.target = null;
            } else {
                if (this.unit1.selected) {
                    this.unit1.setRotation(Math.atan2(-this.unit1.y + this.target.y, -this.unit1.x + this.target.x) + Math.PI / 2);
                    this.physics.moveTo(this.unit1, this.target.x, this.target.y, 50);
                }
            }
        }
        // }
    }

    drawSelectionRect(ev: Pointer) {
        const p1 = ev.position;
        const p2 = this.dragStart!;
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p1.x - p2.x);
        const h = Math.abs(p1.y - p2.y);
        this.graphics2.clear();
        this.graphics2.lineStyle(2, 0x00ff00);
        this.graphics2.fillStyle(0x00ff00, 0.2)
        this.graphics2.strokeRect(x, y, w, h);
        this.graphics2.fillRect(x, y, w, h);
    }
}
