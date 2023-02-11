import Heap from "heap-js";
import Vector2 = Phaser.Math.Vector2;
import GameMap from "../GameMap/GameMap";


class NavigationNode {
    public parent: NavigationNode | undefined = undefined;
    public gCost: number;
    public hCost: number;
    constructor(public node: Node,
                start: Node,
                end: Node) {
        this.gCost = this.cost(start);
        this.hCost = this.cost(end);
    }

    get fCost(): number {
        return this.gCost + this.hCost;
    }

    cost(otherNode: Node) {
        return this.node.distance(otherNode);
    }


    neighbour(pos: Vector2): Vector2[] {
        const neighbours: Vector2[] = [];
        const toVec2 = (arr: number[]): Vector2 => new Vector2(arr[0], arr[1]);
        const directions: Vector2[] = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ].map(toVec2)
        for (const direction of directions) {
            const newPos = pos.clone().add(direction);
            if (newPos.x < 0 || newPos.y < 0 || newPos.x > this.map.size || newPos.y > this.map.size) {
                continue;
            }
            if (this.map.sectorMap[newPos.x][newPos.y] === 1) {
                neighbours.push(newPos);
            }
        }
        for (const wormhole of this.map.wormholes) {
            if (wormhole.isConnected(pos)) {
                neighbours.push(wormhole.getOtherPos(pos));
            }
        }
        return neighbours;
    }


    nodeNeighbours(node: NavigationNode, start: Vector2, end: Vector2): NavigationNode[] {
        const neighbours: NavigationNode[] = [];
        for (const pos of this.neighbour(node.node)) {
            neighbours.push(this.createNode(pos, start, end));
        }
        return neighbours;
    }

}


export class Navigation {

    constructor(private map: GameMap) {}

    private createNode(pos: Vector2, start: Vector2, end: Vector2): NavigationNode {
        return new NavigationNode(pos, start, end);
    }


    public findPath(start: Vector2, end: Vector2): Vector2[] {
        if (this.map.sectorMap[start.x][start.y] === 0 ||
            this.map.sectorMap[end.x][end.y] === 0)  {
            return [];
        }
        const open = new Heap<NavigationNode>((a, b) => {
            return a.fCost - b.fCost || a.hCost - b.hCost;
        });
        open.push(this.createNode(start, start, end));
        const closed: NavigationNode[] = [];
        while (open.size() !== 0) {
            const current = open.pop();
            if (!current) {
                continue;
            }
            closed.push(current);
            if (current.node.equals(end)) {
                return this.retracePath(start, current);
            }

            for (const node of this.nodeNeighbours(current, start, end)) {
                const newMovementCostToNeighbour = current.cost(start) + current.cost(node.node);
                if (newMovementCostToNeighbour < node.cost(start) || !open.contains(node)) {
                    node.gCost = newMovementCostToNeighbour;
                    node.hCost = node.cost(end);
                    node.parent = current;
                    if (!open.contains(node, (a, b) => a.node.equals(b.node))) {
                        open.add(node);
                    }
                }
            }
        }
        return [];
    }

    private retracePath(start: Vector2, current: NavigationNode): Vector2[] {
        let path: Vector2[] = [];
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
