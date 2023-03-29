import Phaser from "phaser";
import {SHARED_CONFIG} from "../model/config";
import {SceneRegistry} from "./SceneRegistry";
import {Navigation} from "../model/Navigation";
import earcut from "earcut";

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
    return [
        left,
        top,
        right,
        top,
        right,
        bottom,
        left,
        bottom,
    ];
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

const boundariesVerts = rectPoly(mapBounds);
const objectVerts = objectBounds.flatMap((b) =>
    rectPoly(b)
);
const mapVerts = [...boundariesVerts, ...objectVerts];

// Generate indices for object vertices (ie. the polygons that will be cut as holes)
const holeIndices = new Array(objectBounds.length)
    .fill(0)
    .map((_, i) => (i + 1) * 4);

// Triangulate the polygon
const indices = earcut(mapVerts, holeIndices);

// End result is triangle indices pointing to our vertex data array
// Convert the indices (ie. [i]) back to vertices (ie. [x, y])
const vertices = indices.flatMap((index) => [
    mapVerts[index * 2],
    mapVerts[index * 2 + 1],
]);
const c = (e) => [e.left, e.top, e.right - e.left, e.bottom - e.top];


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
            graphics.lineStyle(4, 0xff0000, 1);
            graphics.strokeRect(x, y, w, h);
        }
        for (let i = 0; i < vertices.length; i += 6) {
            graphics.lineBetween(
                vertices[i],
                vertices[i + 1],
                vertices[i + 2],
                vertices[i + 3]
            );
            graphics.lineBetween(
                vertices[i + 2],
                vertices[i + 3],
                vertices[i + 4],
                vertices[i + 5]
            );
            graphics.lineBetween(
                vertices[i],
                vertices[i + 1],
                vertices[i + 4],
                vertices[i + 5]
            );
        }
    }

}
