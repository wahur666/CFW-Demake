import WormholeObject from "./WormholeObject";
import {zeroMatrix} from "../helpers/utils";

export default class GameMap {
    size: number;
    sectorMap: number[][] = []

    wormholes: WormholeObject[] = [];

    constructor(size: number) {
        this.size = size;
        this.sectorMap = zeroMatrix(this.size);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (((i / 5) | 0) % 2 == 0 && ((j / 5) | 0) % 2 == 0) {
                    this.sectorMap[i][j] = 1;
                }
            }
        }
        this.generateWormholes();
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