import WormholeObject from "./WormholeObject";
import { nullMatrix, vec2ToArray } from "../../helpers/utils";
import Vector2 = Phaser.Math.Vector2;

export const NOT_A_NEIGHBOUR = 1;

export class GameNode {
    position: Vector2;
    neighbours: Map<GameNode, number>;
    hasWormhole = false;

    constructor(pos: Vector2) {
        this.position = pos;
        this.neighbours = new Map();
    }

    equals(node: GameNode): boolean {
        return this.position.equals(node.position);
    }

    addNeighbour(node: GameNode, weight: number): void {
        this.neighbours.set(node, weight);
    }

    distance(otherNode: GameNode): number {
        return this.position.distance(otherNode.position);
    }

    weight(otherNode: GameNode): number {
        return this.neighbours.get(otherNode) ?? NOT_A_NEIGHBOUR;
    }
}

export default class GameMap {
    size: number;
    sectorNodeMap: (GameNode | null)[][] = [];

    wormholes: WormholeObject[] = [];

    constructor(size: number) {
        this.size = size;
        this.sectorNodeMap = nullMatrix(this.size);
        this.createSector(1, 1, 10);
        this.createSector(20, 5, 10);
        this.createSector(35, 9, 10);
        this.createSector(8, 20, 10);
        this.createSector(25, 29, 10);
        this.createSector(44, 30, 32);
        this.sectorNodeMap[4][4] = null;
        this.sectorNodeMap[3][4] = null;
        this.sectorNodeMap[4][5] = null;
        this.sectorNodeMap[3][5] = null;
        this.generateWormholes();
        this.generateNeighbours();
    }

    private setupNeighbours(node: GameNode) {
        const toVec2 = (arr: number[]): Vector2 => new Vector2(arr[0], arr[1]);
        const directions: Vector2[] = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ].map(toVec2);
        for (const direction of directions) {
            const newPos = node.position.clone().add(direction);
            if (newPos.x < 0 || newPos.y < 0 || newPos.x > this.size - 1 || newPos.y > this.size - 1) {
                continue;
            }
            const newNeighbour = this.sectorNodeMap[newPos.x][newPos.y];
            if (newNeighbour) {
                node.addNeighbour(newNeighbour, direction.length());
            }
        }
        for (const wormhole of this.wormholes) {
            if (wormhole.isConnected(node)) {
                node.addNeighbour(wormhole.getOtherNode(node), wormhole.distance);
            }
        }
    }

    private generateNeighbours() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const item = this.sectorNodeMap[i][j];
                if (item) {
                    this.setupNeighbours(item);
                }
            }
        }
    }

    private createSector(x: number, y: number, size: number): void {
        for (let i = x; i < Math.min(this.size, x + size); i++) {
            for (let j = y; j < Math.min(this.size, y + size); j++) {
                this.sectorNodeMap[i][j] = new GameNode(new Vector2(i, j));
            }
        }
    }
    getNode = (x: number, y: number): GameNode => this.sectorNodeMap[x][y] as GameNode;

    private generateWormholes() {
        this.wormholes.push(new WormholeObject(this.getNode(8, 6), this.getNode(22, 10), 1));
        this.wormholes.push(new WormholeObject(this.getNode(26, 9), this.getNode(37, 14), 1));
        this.wormholes.push(new WormholeObject(this.getNode(25, 13), this.getNode(10, 25), 1));
        this.wormholes.push(new WormholeObject(this.getNode(40, 18), this.getNode(30, 30), 1));
        this.wormholes.push(new WormholeObject(this.getNode(16, 28), this.getNode(27, 31), 1));
        this.wormholes.push(new WormholeObject(this.getNode(32, 37), this.getNode(46, 32), 1));
        // this.wormholes.push(new WormholeObject(this.getNode(12, 20), this.getNode(12, 14), 1));
        // this.wormholes.push(new WormholeObject(this.getNode(20, 20), this.getNode(14, 14), 1));
    }

    nodeNeighbours(node: GameNode): GameNode[] {
        const neighbours: GameNode[] = [];
        for (const neighboursKey of node.neighbours.keys()) {
            const [x, y] = vec2ToArray(neighboursKey.position);
            neighbours.push(this.sectorNodeMap[x][y] as GameNode);
        }
        return neighbours;
    }
}
