import {Node} from "./GameMap";

export default class WormholeObject {

    node1: Node;
    node2: Node;
    distance: number;

    constructor(node1: Node, node2: Node, distance: number) {
        this.node1 = node1;
        this.node2 = node2;
        this.distance = distance;
    }

    isConnected(node: Node): boolean {
        return this.node1.equals(node) || this.node2.equals(node);
    }

    getOtherNode(node: Node): Node {
        return this.node1.equals(node) ? this.node2 : this.node1;
    }
}
