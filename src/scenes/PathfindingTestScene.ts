import Phaser from "phaser";
import {SHARED_CONFIG} from "../model/config";
import {SceneRegistry} from "./SceneRegistry";
import {zeroMatrix} from "../helpers/utils";
import WormholeObject from "../model/WormholeObject";
import {Navigation} from "../model/Navigation";
import GameMap from "../model/GameMap";
import Vector2 = Phaser.Math.Vector2;

export default class PathfindingTestScene extends Phaser.Scene {

    private config: typeof SHARED_CONFIG;
    graphics: Phaser.GameObjects.Graphics;

    radius = 3

    sectorSize = 25
    sectorMap: number[][] = []

    gates: WormholeObject[] = [];

    constructor() {
        super(SceneRegistry.PATHFINDIG_TEST);
        this.config = SHARED_CONFIG;
    }

    create() {
        const map = new GameMap(this.sectorSize);
        this.graphics = this.add.graphics()
        this.graphics.fillStyle(0xff00ff, 1);
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                if (map.sectorMap[i][j] === 1) {
                    this.graphics.fillCircle(20 + (i * 20), 20 + (j * 20), this.radius);
                }
            }
        }

        this.graphics.lineStyle(2, 0x00ff00, 3);
        for (const gate of this.gates) {
            this.graphics.lineBetween(20 + (gate.x1 * 20), 20 + (gate.y1 * 20),
                20 + (gate.x2 * 20), 20 + (gate.y2 * 20));
        }
        const navi = new Navigation(map);
        const path = navi.findPath(new Vector2(1, 1), new Vector2(13, 23))
        console.log(path);
    }

}