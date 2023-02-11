import WormholeObject from "./WormholeObject";
import {zeroMatrix} from "../../helpers/utils";
import Vector2 = Phaser.Math.Vector2;

export class Node {
    position: Vector2;
    neighbours: Node[];
    constructor(pos: Vector2) {
        this.position = pos;
        this.neighbours = [];
    }

    distance(otherNode: Node): number {
        return 0;
    }
}


export default class GameMap {
    size: number;
    sectorMap: number[][] = []

    wormholes: WormholeObject[] = [];

    constructor(size: number) {
        this.size = size;
        this.sectorMap = zeroMatrix(this.size);
        this.createSector(0, 0, 5);
        this.createSector(10, 0, 5);
        this.createSector(20, 0, 5);
        this.createSector(0, 10, 5);
        this.createSector(10, 10, 5);
        this.createSector(20, 10, 5);
        this.createSector(0, 20, 5);
        this.createSector(10, 20, 5);
        this.createSector(20, 20, 5);
        this.generateWormholes();
    }

    createSector(x: number, y: number, size: number): void {
        for (let i = x; i < Math.min(this.size, x+size); i++) {
            for (let j = y; j < Math.min(this.size, y+size); j++) {
                this.sectorMap[i][j] = 1;
            }
        }
    }

    private generateWormholes() {
        this.wormholes.push(new WormholeObject(4, 4, 10, 10));
        this.wormholes.push(new WormholeObject(12, 4, 12, 10));
        this.wormholes.push(new WormholeObject(20, 4, 14, 10));
        this.wormholes.push(new WormholeObject(4, 12, 10, 12));
        this.wormholes.push(new WormholeObject(14, 12, 20, 12));
        this.wormholes.push(new WormholeObject(4, 20, 10, 14));
        this.wormholes.push(new WormholeObject(12, 20, 12, 14));
        this.wormholes.push(new WormholeObject(12, 20, 12, 14));
        this.wormholes.push(new WormholeObject(20, 20, 14, 14));
    }
}