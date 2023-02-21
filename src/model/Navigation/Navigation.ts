import Heap from "heap-js";
import Vector2 = Phaser.Math.Vector2;
import GameMap from "../GameMap/GameMap";
import {Node} from "../GameMap/GameMap";

interface PriorityNode {
    node: Node,
    priority: number,
}

export class Navigation {

    constructor(private map: GameMap) {}

    public findPath(start: Node, end: Node): Node[] {
        if (!this.map.sectorNodeMap[start.position.x][start.position.y] ||
            !this.map.sectorNodeMap[end.position.x][end.position.y] )  {
            return [];
        }
        const frontier: Heap<PriorityNode> = new Heap<PriorityNode>((a, b) => a.priority - b.priority);
        frontier.push({node: start, priority: 0});
        const cameFrom = new Map<Node, Node | null>;
        const costSoFar = new Map<Node, number>;
        cameFrom.set(start, null);
        costSoFar.set(start, 0);

        while (frontier.length !== 0) {
            const current = frontier.pop() as PriorityNode;

            if (current.node === end) {
                break
            }

            for (const next of this.map.nodeNeighbours(current.node)) {
                const newCost = (costSoFar.get(current.node) || 0) + current.node.weight(next)
                if (!cameFrom.has(next) || newCost < (costSoFar.get(next) as number) ) {
                    costSoFar.set(next, newCost);
                    const priority = newCost + end.distance(next);
                    frontier.push({node: next, priority})
                    cameFrom.set(next, current.node)
                }
            }
        }
        return this.retracePath(start, end, cameFrom);
    }

    private retracePath(start: Node, end: Node, cameFrom: Map<Node, Node | null>): Node[] {
        let current = end;
        const path: Node[] = [];
        while (current !== start) {
            path.push(current);
            current = cameFrom.get(current) as Node;
        }
        path.push(start)
        path.reverse();
        return path;
    }

    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    private intersects(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number): boolean {
        const det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }

    private intersects2(start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2) {
        return this.intersects(start1.x, start1.y, end1.x, end1.y, start2.x, start2.y, end2.x, end2.y);
    }

}
