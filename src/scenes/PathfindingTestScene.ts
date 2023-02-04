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

    constructor() {
        super(SceneRegistry.PATHFINDIG_TEST);
        this.config = SHARED_CONFIG;
    }

    create() {
        const c = (i: number) => 20 + (i * 20);
        const map = new GameMap(this.sectorSize);
        this.graphics = this.add.graphics()
        this.graphics.fillStyle(0xff00ff, 1);
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                if (map.sectorMap[i][j] === 1) {
                    this.graphics.fillCircle(c(i), c(j), this.radius);
                }
            }
        }

        this.graphics.lineStyle(5, 0x00ff00, 1);
        for (const gate of map.wormholes) {
            this.graphics.lineBetween(c(gate.x1), c(gate.y1), c(gate.x2), c(gate.y2));
        }
        const navi = new Navigation(map);
        const path = navi.findPath(new Vector2(1, 1), new Vector2(13, 23))

        console.log(path);
        this.graphics.lineStyle(3, 0xff0000, 3);
        for (let i = 0; i < path.length - 1; i++) {
            this.graphics.lineBetween(c(path[i].x), c(path[i].y), c(path[i+1].x), c(path[i+1].y));
        }

    }

}
