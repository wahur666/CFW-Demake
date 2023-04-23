import { GameNode } from "../model/GameMap/GameMap";
import Vector2 = Phaser.Math.Vector2;

/** Return (0..num-1) values */
export const range = (num: number): number[] => [...Array(num).keys()];

/** Converts Vector2 to [x, y] */
export const vec2ToArray = (p: Vector2): [number, number] => [p.x, p.y];

export const GAME_SCALE: number = 2;
export const drawWidth = 20 * GAME_SCALE;
export const halfDrawWidth = drawWidth / 2;
export const calculateRect = (width: number) => width * drawWidth;
export const nodeToPos = (node: GameNode) =>
    node.position.clone().multiply({ x: drawWidth, y: drawWidth }).add({ x: halfDrawWidth, y: halfDrawWidth });
export const posToNodeCoords = (pos: Vector2) => [Math.floor(pos.x / drawWidth), Math.floor(pos.y / drawWidth)];
export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);
export const toVec2 = (arr: number[]): Vector2 => new Vector2(arr[0], arr[1]);

export const inRect = (p: Vector2, p1: Vector2, p2: Vector2): boolean => {
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const w = Math.abs(p1.x - p2.x);
    const h = Math.abs(p1.y - p2.y);
    return x <= p.x && p.x <= x + w && y <= p.y && p.y <= y + h;
};

export const defaultFont = '"Titillium Web", sans-serif';

export const formatTime = (s: number) => (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;

export const d2r = Phaser.Math.DegToRad;

export const zeroMatrix = (width: number, height = width): number[][] => {
    const mat: number[][] = Array(width);
    for (let i = 0; i < width; i++) {
        mat[i] = Array(height).fill(0);
    }
    return mat;
};

export const nullMatrix = <T>(width: number, height = width): (T | null)[][] => {
    const mat: (T | null)[][] = Array(width);
    for (let i = 0; i < width; i++) {
        mat[i] = Array(height).fill(null);
    }
    return mat;
};
