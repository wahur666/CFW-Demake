import Heap from "heap-js";
import Vector2 = Phaser.Math.Vector2;
import GameMap from "../GameMap/GameMap";
import { GameNode } from "../GameMap/GameMap";

interface PriorityNode {
    node: GameNode;
    priority: number;
}

export class Navigation {
    constructor(private map: GameMap) {}

    public findPath(start: GameNode, end: GameNode): GameNode[] {
        if (!this.map.sectorNodeMap[start.position.x][start.position.y] || !this.map.sectorNodeMap[end.position.x][end.position.y]) {
            return [];
        }
        const frontier: Heap<PriorityNode> = new Heap<PriorityNode>((a, b) => a.priority - b.priority);
        frontier.push({ node: start, priority: 0 });
        const cameFrom = new Map<GameNode, GameNode | null>();
        const costSoFar = new Map<GameNode, number>();
        cameFrom.set(start, null);
        costSoFar.set(start, 0);

        while (frontier.length !== 0) {
            const current = frontier.pop() as PriorityNode;

            if (current.node === end) {
                break;
            }

            for (const next of this.map.nodeNeighbours(current.node)) {
                const newCost = (costSoFar.get(current.node) || 0) + current.node.weight(next);
                if (!cameFrom.has(next) || newCost < (costSoFar.get(next) as number)) {
                    costSoFar.set(next, newCost);
                    const priority = newCost + end.distance(next);
                    frontier.push({ node: next, priority });
                    cameFrom.set(next, current.node);
                }
            }
        }
        return this.retracePath(start, end, cameFrom);
    }

    private retracePath(start: GameNode, end: GameNode, cameFrom: Map<GameNode, GameNode | null>): GameNode[] {
        let current = end;
        const path: GameNode[] = [];
        while (current !== start) {
            path.push(current);
            current = cameFrom.get(current) as GameNode;
        }
        path.push(start);
        path.reverse();
        return path;
    }

    private getPixelsOnLine(p1: Vector2, p2: Vector2): Vector2[] {
        const pixels: Vector2[] = [];

        // Calculate differences and directions
        const dx = Math.abs(p2.x - p1.x);
        const dy = Math.abs(p2.y - p1.y);
        const sx = p1.x < p2.x ? 1 : -1;
        const sy = p1.y < p2.y ? 1 : -1;
        let err = dx - dy;

        // Initial pixel
        let x = p1.x;
        let y = p1.y;

        while (true) {
            // Add current pixel
            pixels.push(new Vector2(x, y));

            // Check if end point is reached
            if (x === p2.x && y === p2.y) {
                break;
            }

            // Calculate next pixel
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return pixels;
    }

    private findAfterIndex<T>(arr: T[], callback: (item: T) => boolean, startIndex: number): T | undefined {
        // Ensure startIndex is within the bounds of the array
        if (startIndex < 0 || startIndex >= arr.length) {
            return undefined;
        }

        // Iterate through the array starting from the given index
        for (let i = startIndex; i < arr.length; i++) {
            // If the callback condition is met, return the item
            if (callback(arr[i])) {
                return arr[i];
            }
        }

        // If no item meets the condition, return undefined
        return undefined;
    }

    public optimizePath(path: GameNode[], cellSize: number): GameNode[] {
        if (path.length < 2) {
            return path;
        }
        function reduceAdjacentDuplicates(lst: Vector2[]): Vector2[] {
            if (!lst.length) {
                return [];
            }

            const result: any[] = [lst[0]];
            for (let i = 1; i < lst.length; i++) {
                if (!lst[i].equals(result[result.length - 1])) {
                    result.push(lst[i]);
                }
            }

            return result;
        }
        const dc = cellSize;
        const c = (i: number) => dc + i * dc;
        const rc = (i: number) => Math.round((i - dc) / dc) | 0;
        let start = 0;
        let current = start + 2;
        const nPath: GameNode[] = [path[start]];
        let i = 0;
        const maxIterations = 1000;
        for (; i < maxIterations && current < path.length; i++) {
            const p1 = new Vector2(c(path[start].position.x), c(path[start].position.y));
            const p2 = new Vector2(c(path[current].position.x), c(path[current].position.y));
            const pixiz = this.getPixelsOnLine(p1, p2);
            const rpixiz = pixiz.map((p) => new Vector2(rc(p.x), rc(p.y)));
            if (reduceAdjacentDuplicates(rpixiz).map(p => this.map.getNode(p.x, p.y)).every(gn => gn !== null)) {
                current += 1;
            } else {
                nPath.push(path[current - 1]);
                start = current - 1;
                current = start + 2;
            }
        }
        if (i == maxIterations) {
            console.warn(`Path optimization failed ${JSON.stringify(path.map((node) => node.position))}`);
            return path;
        }
        nPath.push(path.at(-1)!);
        console.log(`Path optimized ${path.length} -> ${nPath.length}`);
        return nPath;
    }

    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    private intersects(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number): boolean {
        const det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
        }
    }

    private intersects2(start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2) {
        return this.intersects(start1.x, start1.y, end1.x, end1.y, start2.x, start2.y, end2.x, end2.y);
    }
}
