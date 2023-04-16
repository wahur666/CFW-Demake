import { GameNode } from "./GameMap";

export default class WormholeObject {
    node1: GameNode;
    node2: GameNode;
    distance: number;

    constructor(node1: GameNode, node2: GameNode, distance: number) {
        this.node1 = node1;
        this.node2 = node2;
        this.node1.hasWormhole = true;
        this.node2.hasWormhole = true;
        this.distance = distance;
    }

    isConnected(node: GameNode): boolean {
        return this.node1.equals(node) || this.node2.equals(node);
    }

    getOtherNode(node: GameNode): GameNode {
        return this.node1.equals(node) ? this.node2 : this.node1;
    }
}
