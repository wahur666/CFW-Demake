import WormholeObject from "./WormholeObject";
import {nullMatrix} from "../../helpers/utils";
import Vector2 = Phaser.Math.Vector2;

export const NOT_A_NEIGHBOUR = 1;

export class Node {
    position: Vector2;
    neighbours: Map<string, number>;

    constructor(pos: Vector2) {
        this.position = pos;
        this.neighbours = new Map();
    }

    equals(node: Node): boolean {
        return this.position.equals(node.position);
    }

    addNeighbour(node: Node, weight): void {
        this.neighbours.set(node.repr, weight);
    }

    get repr(): string {
        return `${this.position.x},${this.position.y}`
    }

    distance(otherNode: Node): number {
        return this.position.distance(otherNode.position);
    }

    weight(otherNode: Node): number {
        return this.neighbours.get(otherNode.repr) ?? NOT_A_NEIGHBOUR;
    }
}


export default class GameMap {
    size: number;
    sectorNodeMap: (Node | null)[][] = [];

    wormholes: WormholeObject[] = [];

    constructor(size: number) {
        this.size = size;
        this.sectorNodeMap = nullMatrix(this.size);
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
        this.generateNeighbours();
    }

    private setupNeighbours(node: Node) {
        const toVec2 = (arr: number[]): Vector2 => new Vector2(arr[0], arr[1]);
        const directions: Vector2[] = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ].map(toVec2)
        for (const direction of directions) {
            const newPos = node.position.clone().add(direction);
            if (newPos.x < 0 || newPos.y < 0 || newPos.x > this.size-1 || newPos.y > this.size-1) {
                continue;
            }
            const newNeighbour = this.sectorNodeMap[newPos.x][newPos.y];
            if (newNeighbour) {
                node.addNeighbour(newNeighbour, 1);
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
                this.sectorNodeMap[i][j] = new Node(new Vector2(i, j));
            }
        }
    }
    getNode = (x: number, y: number): Node => this.sectorNodeMap[x][y] as Node;

    private generateWormholes() {
        this.wormholes.push(new WormholeObject(this.getNode(4, 4), this.getNode(10, 10), 5));
        this.wormholes.push(new WormholeObject(this.getNode(12, 4), this.getNode(12, 10), 5));
        this.wormholes.push(new WormholeObject(this.getNode(20, 4), this.getNode(14, 10), 5));
        this.wormholes.push(new WormholeObject(this.getNode(4, 12), this.getNode(10, 12), 5));
        this.wormholes.push(new WormholeObject(this.getNode(14, 12), this.getNode(20, 12), 5));
        this.wormholes.push(new WormholeObject(this.getNode(4, 20), this.getNode(10, 14), 5));
        this.wormholes.push(new WormholeObject(this.getNode(12, 20), this.getNode(12, 14), 5));
        this.wormholes.push(new WormholeObject(this.getNode(12, 20), this.getNode(12, 14), 5));
        this.wormholes.push(new WormholeObject(this.getNode(20, 20), this.getNode(14, 14), 5));
    }

    nodeNeighbours(node: Node): Node[] {
        const neighbours: Node[] = [];
        for (const neighboursKey of node.neighbours.keys()) {
            const [x, y] = neighboursKey.split(",").map((e) => Number.parseInt(e, 10));
            neighbours.push(this.sectorNodeMap[x][y] as Node);
        }
        return neighbours;
    }


}
