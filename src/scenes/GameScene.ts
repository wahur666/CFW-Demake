import Phaser from "phaser";
import {SceneRegistry} from "./SceneRegistry";
import {SHARED_CONFIG} from "../model/config";
import Wormhole from "../entity/Wormhole";
import Unit, {TravelState} from "../entity/Unit";
import {route} from "preact-router";
import Building from "../entity/Building";
import Planet from "../entity/Planet";
import GameMap from "../model/GameMap/GameMap";
import {calculateRect, drawWidth, getRandomInt, inRect, toVec2} from "../helpers/utils";
import cursor from "../assets/cursor.png";
import {Navigation} from "../model/Navigation";
import Pointer = Phaser.Input.Pointer;
import Vector2 = Phaser.Math.Vector2;

export default class GameScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    private units: Unit[] = [];
    private selectedUnits: Unit[] = [];
    private graphics: Phaser.GameObjects.Graphics;
    private selectionRectGraphics: Phaser.GameObjects.Graphics;
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

    getWorldPos(pointer: Pointer): Vector2 {
        return this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    create() {
        const size = 64;
        this.input.setDefaultCursor(`url(${cursor}), default`);
        this.graphics = this.add.graphics();
        this.selectionRectGraphics = this.add.graphics();

        this.map = new GameMap(size);
        const navi = new Navigation(this.map);
        this.graphics.lineStyle(2, 0x0000ff);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.map.sectorNodeMap[i][j]) {
                    this.graphics.strokeRect(calculateRect(i), calculateRect(j), drawWidth, drawWidth);
                }
            }
        }
        for (const wormhole of this.map.wormholes) {
            const x1 = calculateRect(wormhole.node1.position.x) + drawWidth / 2;
            const y1 = calculateRect(wormhole.node1.position.y) + drawWidth / 2;
            this.wormholes.push(new Wormhole(this, x1, y1));
            const x2 = calculateRect(wormhole.node2.position.x) + drawWidth / 2;
            const y2 = calculateRect(wormhole.node2.position.y) + drawWidth / 2;
            this.wormholes.push(new Wormhole(this, x2, y2));
        }


        // this.input.mouse.disableContextMenu();
        // const rect1 = this.add.rectangle(10, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        // const rect2 = this.add.rectangle(500, 10, 300, 300, 0xa1a1a1).setOrigin(0, 0);
        // this.wh1 = new Wormhole(this, 260, 120);
        // this.wh2 = new Wormhole(this, 560, 120);
        this.units.push(new Unit(this, 50, 50, this.map));
        this.units.push(new Unit(this, 90, 30, this.map));
        this.input.keyboard.on("keyup-ESC", (ev) => {
            route("/", true);
        });

        this.input.on("pointerdown", (ev: Pointer) => {
            console.log(ev.button);
            if (ev.button === 0) {
                this.dragging = true;
                this.dragStart = this.getWorldPos(ev);
            } else if (ev.button === 2) {
                const worldPoint = this.getWorldPos(ev);
                const [x, y] = this.calcSquare(worldPoint.x, worldPoint.y);
                for (const selectedUnit of this.selectedUnits) {
                    if (selectedUnit.traveling === TravelState.NOT_TRAVELING) {
                        const [x1, y1] = this.calcSquare(selectedUnit.x, selectedUnit.y);
                        let endNode = this.map.getNode(x, y);
                        if (endNode.hasWormhole) {
                            const directions: [number, number][] = [
                                [-1, -1], [-1, 0], [-1, 1],
                                [0, -1], [0, 1],
                                [1, -1], [1, 0], [1, 1]
                            ]
                            const wormhole = this.map.wormholes.find(wh => wh.isConnected(endNode));
                            if (wormhole) {
                                const node = wormhole.getOtherNode(endNode);
                                const newEndNodePos = node.position.clone().add(toVec2(directions[getRandomInt(8)]) );
                                endNode = this.map.getNode(newEndNodePos.x, newEndNodePos.y);
                            }
                        }
                        const path = navi.findPath(this.map.getNode(x1, y1), endNode);
                        selectedUnit.setNav(path)
                    }
                }
            }
        });
        this.input.on("pointerup", (ev: Pointer) => {
            if (ev.button === 0) {
                if (this.dragStart) {
                    this.selectedUnits = [];
                    for (const unit of this.units) {
                        unit.setSelected(inRect(unit.pos, this.getWorldPos(ev), this.dragStart));
                        if (unit.isSelected) {
                            this.selectedUnits.push(unit);
                        }
                    }
                }
                this.dragging = false;
                this.dragStart = null;
                this.selectionRectGraphics.clear();
            }
        })

        const cursors = this.input.keyboard.createCursorKeys();

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            up: cursors.up,
            down: cursors.down,
            left: cursors.left,
            right: cursors.right,
            camera: this.cameras.main,
            speed: 1,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            zoomSpeed: 0.01
        });

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
                this.drawSelectionRect(this.getWorldPos(ev));
            }
        });

        // this.planet = new Planet(this, 500, 500, Images.PLANET);
        // this.building = new Building(this, 500, 500, Images.HOUSE_ICON);
    }

    calcSquare(x: number, y: number): [number, number] {
        return [Math.floor(x / drawWidth), Math.floor(y / drawWidth)]
    }

    update(time: number, delta: number) {
        this.controls.update(delta);
        this.building?.update(delta);
        this.planet?.update(delta);
        this.units.forEach(unit => unit.update(delta));
    }

    drawSelectionRect(endPoint: Vector2) {
        const p1 = endPoint;
        const p2 = this.dragStart!;
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p1.x - p2.x);
        const h = Math.abs(p1.y - p2.y);
        this.selectionRectGraphics.clear();
        this.selectionRectGraphics.lineStyle(2, 0x00ff00);
        this.selectionRectGraphics.fillStyle(0x00ff00, 0.2)
        this.selectionRectGraphics.strokeRect(x, y, w, h);
        this.selectionRectGraphics.fillRect(x, y, w, h);
    }
}
