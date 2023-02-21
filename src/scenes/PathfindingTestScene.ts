import Phaser from "phaser";
import {SHARED_CONFIG} from "../model/config";
import {SceneRegistry} from "./SceneRegistry";
import {Navigation} from "../model/Navigation";
import GameMap from "../model/GameMap/GameMap";

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
        const dc = 20;
        const c = (i: number) => dc + (i * dc);
        const map = new GameMap(this.sectorSize);
        this.graphics = this.add.graphics()
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
            this.graphics.lineBetween(c(gate.node1.position.x), c(gate.node1.position.y), c(gate.node2.position.x), c(gate.node2.position.y));
        }
        const navi = new Navigation(map);
        const path = navi.findPath(map.getNode(1, 1), map.getNode(13, 23));

        this.graphics.lineStyle(3, 0xff0000, 3);
        for (let i = 0; i < path.length - 1; i++) {
            this.graphics.lineBetween(c(path[i].position.x), c(path[i].position.y), c(path[i+1].position.x), c(path[i+1].position.y));
        }

    }

}
