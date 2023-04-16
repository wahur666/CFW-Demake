import Phaser from "phaser";
import { SHARED_CONFIG } from "../model/config";
import { SceneRegistry } from "./SceneRegistry";
import { Navigation } from "../model/Navigation";
import earcut from "earcut";
import Vector2 = Phaser.Math.Vector2;
import { astar } from "../astar";

const mapBounds = {
    left: 10,
    top: 10,
    right: 450,
    bottom: 450,
};

const objectBounds = [
    {
        left: 50,
        top: 50,
        right: 220,
        bottom: 120,
    },
    {
        left: 300,
        top: 90,
        right: 380,
        bottom: 390,
    },
];

function rectPoly({ left, top, right, bottom }) {
    return [left, top, right, top, right, bottom, left, bottom];
}

// Return rectangle with added margin
function withMargin({ left, top, right, bottom }, amount) {
    return {
        left: left - amount,
        top: top - amount,
        right: right + amount,
        bottom: bottom + amount,
    };
}

const boundariesVerts = rectPoly(withMargin(mapBounds, -20));
const objectVerts = objectBounds.flatMap((b) => rectPoly(withMargin(b, 10)));
const mapVerts = [...boundariesVerts, ...objectVerts];

// Generate indices for object vertices (ie. the polygons that will be cut as holes)
const holeIndices = new Array(objectBounds.length).fill(0).map((_, i) => (i + 1) * 4);

// Triangulate the polygon
const indices = earcut(mapVerts, holeIndices);

// End result is triangle indices pointing to our vertex data array
// Convert the indices (ie. [i]) back to vertices (ie. [x, y])
const vertices = indices.flatMap((index) => [mapVerts[index * 2], mapVerts[index * 2 + 1]]);
const c = (e) => [e.left, e.top, e.right - e.left, e.bottom - e.top];

function findTriangleContaining(indices: number[], vertices: number[], point: Point) {
    let i = 0;
    for (const triangle of triangles(indices, vertices)) {
        if (triangleContainsPoint(triangle, point)) {
            return i;
        }
        i++;
    }
    return i;
}

const startPos: Point = [150, 200];
const endPos: Point = [400, 400];

const startTriangle = findTriangleContaining(indices, mapVerts, startPos);
const endTriangle = findTriangleContaining(indices, mapVerts, endPos);

type Node = { id: number; neighbours: Node[] };
const graph: Node[] = [];

const tIndices = [...triangleIndices(indices)];

// First step: add all triangles
for (let i = 0; i < tIndices.length; ++i) {
    graph.push({ id: i, neighbours: [] });
}

// Second step: find neighbours
for (const [triangle, indices0] of tIndices.entries()) {
    const neighbours = [...tIndices.entries()]
        .filter(([nTriangle, indices1]) => {
            return nTriangle !== triangle && doTrianglesShareEdge(indices0, indices1);
        })
        .map(([nTriangle]) => graph[nTriangle]);

    graph[triangle].neighbours = neighbours;
}

type Point = [number, number];
type Triangle = [Point, Point, Point];

function* triangleIndices(indices: number[]) {
    for (let i = 0; i < indices.length; i += 3) {
        yield [indices[i], indices[i + 1], indices[i + 2]] as [number, number, number];
    }
}

const startAndEndNeighbourIndices = [...graph[startTriangle].neighbours, ...graph[endTriangle].neighbours].flatMap(({ id }) => {
    return [indices[id * 3 + 0], indices[id * 3 + 1], indices[id * 3 + 2]];
});

function doTrianglesShareEdge(indices0: [number, number, number], indices1: [number, number, number]) {
    // If triangles A and B share two indices, they share an edge
    let shared = 0;
    for (const i of indices0) {
        if (indices1.includes(i) && ++shared === 2) {
            return true;
        }
    }
    return false;
}

function* triangles(indices: number[], vertices: number[]) {
    for (const [i0, i1, i2] of triangleIndices(indices)) {
        const p0: Point = [vertices[i0 * 2], vertices[i0 * 2 + 1]];
        const p1: Point = [vertices[i1 * 2], vertices[i1 * 2 + 1]];
        const p2: Point = [vertices[i2 * 2], vertices[i2 * 2 + 1]];

        yield [p0, p1, p2] as Triangle;
    }
}

// https://blackpawn.com/texts/pointinpoly/default.html
// https://github.com/mattdesl/point-in-triangle
function triangleContainsPoint(triangle: Triangle, testing: Point) {
    //compute vectors & dot products
    const cx = testing[0],
        cy = testing[1],
        t0 = triangle[0],
        t1 = triangle[1],
        t2 = triangle[2],
        v0x = t2[0] - t0[0],
        v0y = t2[1] - t0[1],
        v1x = t1[0] - t0[0],
        v1y = t1[1] - t0[1],
        v2x = cx - t0[0],
        v2y = cy - t0[1],
        dot00 = v0x * v0x + v0y * v0y,
        dot01 = v0x * v1x + v0y * v1y,
        dot02 = v0x * v2x + v0y * v2y,
        dot11 = v1x * v1x + v1y * v1y,
        dot12 = v1x * v2x + v1y * v2y;

    // Compute barycentric coordinates
    const b = dot00 * dot11 - dot01 * dot01,
        inv = b === 0 ? 0 : 1 / b,
        u = (dot11 * dot02 - dot01 * dot12) * inv,
        v = (dot00 * dot12 - dot01 * dot02) * inv;
    return u >= 0 && v >= 0 && u + v < 1;
}

function pathWithWeights(pathVertices, weights) {
    return pathVertices.map(([v0, v1], i) => {
        const w = weights[i];
        return [v0[0] + (v1[0] - v0[0]) * w, v0[1] + (v1[1] - v0[1]) * w];
    });
}
function dist(a, b) {
    const [dx, dy] = [a[0] - b[0], a[1] - b[1]];
    return Math.sqrt(dx * dx + dy * dy);
}
function lengthWithWeights(pathVertices, weights) {
    const withWeights = pathWithWeights(pathVertices, weights);

    const startToFirstDistance = dist(startPos, withWeights[0]);
    const lastToEndDistance = dist(withWeights[withWeights.length - 1], endPos);
    return withWeights.reduce(
        ([prev, pathDist], cur) => {
            if (prev) {
                pathDist += dist(cur, prev);
            }
            return [cur, pathDist];
        },
        [null, startToFirstDistance + lastToEndDistance]
    )[1];
}

function triangleMidPoint(triangleIndex) {
    const tIndices = [indices[triangleIndex * 3 + 0], indices[triangleIndex * 3 + 1], indices[triangleIndex * 3 + 2]];
    const x = tIndices.reduce((prev, cur) => prev + mapVerts[cur * 2 + 0], 0) / 3;
    const y = tIndices.reduce((prev, cur) => prev + mapVerts[cur * 2 + 1], 0) / 3;
    return [x, y];
}

const { path } = astar({
    start: startTriangle,
    isEnd: (n) => n === endTriangle,
    neighbor: (n) => graph[n].neighbours.map((n) => n.id),
    distance: (a, b) => {
        const [ax, ay] = triangleMidPoint(graph[a].id);
        const [bx, by] = triangleMidPoint(graph[b].id);
        const [dx, dy] = [ax - bx, ay - by];
        return Math.sqrt(dx * dx + dy * dy);
    },
    heuristic: (n) => {
        // Euclidean distance
        const [nx, ny] = triangleMidPoint(graph[n].id);
        const dx = nx - endPos[0];
        const dy = ny - endPos[1];
        return Math.sqrt(dx * dx + dy * dy);
    },
});

console.log(path);

function* pathToEdges(path, graph) {
    for (let i = 1; i < path.length; ++i) {
        const fromTriangle = graph[path[i - 1]].id;
        const toTriangle = graph[path[i]].id;

        const tri0 = [indices[fromTriangle * 3 + 0], indices[fromTriangle * 3 + 1], indices[fromTriangle * 3 + 2]];
        const tri1 = [indices[toTriangle * 3 + 0], indices[toTriangle * 3 + 1], indices[toTriangle * 3 + 2]];

        // Find vertices in both triangles. MUST have length of 2
        const sharedVertices = tri0.filter((i) => tri1.includes(i));
        const vert0 = [mapVerts[sharedVertices[0] * 2 + 0], mapVerts[sharedVertices[0] * 2 + 1]];
        const vert1 = [mapVerts[sharedVertices[1] * 2 + 0], mapVerts[sharedVertices[1] * 2 + 1]];

        yield [vert0, vert1];
    }
}
const pathVertices = [...pathToEdges(path, graph)];

console.log(pathVertices);

export default class PathfindingTestScene2 extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    graphics: Phaser.GameObjects.Graphics;

    constructor() {
        super(SceneRegistry.PATHFINDIG2_TEST);
        this.config = SHARED_CONFIG;
    }

    create() {
        let graphics = this.add.graphics();
        graphics.lineStyle(1, 0xff00ff, 1);
        let [x, y, w, h] = c(mapBounds);
        graphics.strokeRect(x, y, w, h);
        for (let item of objectBounds) {
            [x, y, w, h] = c(item);
            graphics.lineStyle(1, 0xff0000, 1);
            graphics.strokeRect(x, y, w, h);
        }
        graphics.lineStyle(1, 0xffeebb, 1);

        for (let i = 0; i < vertices.length; i += 6) {
            graphics.lineBetween(vertices[i], vertices[i + 1], vertices[i + 2], vertices[i + 3]);
            graphics.lineBetween(vertices[i + 2], vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            graphics.lineBetween(vertices[i], vertices[i + 1], vertices[i + 4], vertices[i + 5]);
        }
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(startPos[0], startPos[1], 5, 5);
        graphics.fillRect(endPos[0], endPos[1], 5, 5);

        graphics.lineStyle(1, 0x00ff00, 1);
        for (const pathVertex of pathVertices) {
            graphics.lineBetween(pathVertex[0][0], pathVertex[0][1], pathVertex[1][0], pathVertex[1][1]);
        }
    }
}
