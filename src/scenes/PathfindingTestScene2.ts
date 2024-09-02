import Phaser from "phaser";
import { SHARED_CONFIG } from "../model/config";
import { SceneRegistry } from "./SceneRegistry";
import GameMap from "../model/GameMap/GameMap.ts";
import { Navigation } from "../model/Navigation";

export default class PathfindingTestScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    graphics: Phaser.GameObjects.Graphics;

    radius = 3;

    sectorSize = 64;

    constructor() {
        super(SceneRegistry.PATHFINDIG_TEST);
        this.config = SHARED_CONFIG;
    }

    create() {
        const dc = 20;
        const c = (i: number) => dc + i * dc;
        const map = new GameMap(this.sectorSize);
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xff00ff, 1);
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                if (map.sectorNodeMap[i][j]) {
                    this.graphics.fillCircle(c(i), c(j), this.radius);
                }
            }
        }

        this.graphics.lineStyle(5, 0x00ff00, 1);
        for (const gate of map.wormholes) {
            this.graphics.lineBetween(
                c(gate.node1.position.x),
                c(gate.node1.position.y),
                c(gate.node2.position.x),
                c(gate.node2.position.y)
            );
        }
        const navi = new Navigation(map);
        let path = navi.findPath(map.getNode(1, 1), map.getNode(6, 4));
        path = navi.optimizePath(path);
        console.log(path);
        this.graphics.lineStyle(3, 0xff0000, 3);
        for (let i = 0; i < path.length - 1; i++) {
            this.graphics.lineBetween(c(path[i].position.x), c(path[i].position.y), c(path[i + 1].position.x), c(path[i + 1].position.y));
        }
        this.drawGrid(map);
    }

    drawGrid(map: GameMap) {
        const dc = 20;
        const c = (i: number) => dc + i * dc;
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xff00ff, 1);
        this.graphics.lineStyle(1, 0xff0000, 1);
        for (let i = 0; i < map.size; i++) {
            for (let j = 0; j < map.size; j++) {
                if (map.sectorNodeMap[i][j]) {
                    this.graphics.strokeRect(c(i) - dc / 2, c(j) - dc / 2, dc, dc);
                }
            }
        }
    }
}
