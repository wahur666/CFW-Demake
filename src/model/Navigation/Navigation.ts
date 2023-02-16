import Heap from "heap-js";
import Vector2 = Phaser.Math.Vector2;
import GameMap from "../GameMap/GameMap";
import {Node} from "../GameMap/GameMap";


class NavigationNode {
    public parent: NavigationNode | undefined = undefined;
    public gCost: number;
    public hCost: number;
    constructor(public node: Node,
                startNode: Node,
                endNode: Node) {
        this.gCost = this.node.distance(startNode);
        this.hCost = this.node.distance(endNode);
    }

    get fCost(): number {
        return this.gCost + this.hCost;
    }

    weight(otherNode: Node): number {
        return this.node.weight(otherNode);
    }

}


export class Navigation {

    constructor(private map: GameMap) {}

    private createNode(currentNode: Node, startNode: Node, endNode: Node): NavigationNode {
        return new NavigationNode(currentNode, startNode, endNode);
    }
    nodeNeighbours(currentNode: NavigationNode, startNode: Node, endNode: Node): NavigationNode[] {
        return this.map.nodeNeighbours(currentNode.node).map(e => this.createNode(e, startNode, endNode));
    }

    public findPath(start: Node, end: Node): Node[] {
        if (!this.map.sectorNodeMap[start.position.x][start.position.y] ||
            !this.map.sectorNodeMap[end.position.x][end.position.y] )  {
            return [];
        }
        const open = new Heap<NavigationNode>((a, b) => {
            return a.fCost - b.fCost || a.hCost - b.hCost;
        });
        open.push(this.createNode(start, start, end));
        const closed: NavigationNode[] = [];
        let counter = 0;
        while (open.size() !== 0) {
            counter += 1;
            if (counter > 10000) {
                break;
            }
            const current = open.pop();
            if (!current) {
                continue;
            }
            closed.push(current);
            if (current.node.equals(end)) {
                return this.retracePath(start, current);
            }

            for (const node of this.nodeNeighbours(current, start, end)) {
                const newMovementCostToNeighbour = current.gCost + current.weight(node.node);
                if (newMovementCostToNeighbour < node.node.distance(start) || !open.contains(node)) {
                    node.gCost = newMovementCostToNeighbour;
                    node.hCost = node.weight(end);
                    node.parent = current;
                    if (!open.contains(node, (a, b) => a.node.equals(b.node))) {
                        open.add(node);
                    }
                }
            }
        }
        return [];
    }

    private retracePath(start: Node, current: NavigationNode): Node[] {
        let path: Node[] = [];
        while (current.parent) {
            path.unshift(current.node);
            current = current.parent;
        }
        path.unshift(start);
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
