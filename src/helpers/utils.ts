import Vector2 = Phaser.Math.Vector2;

/** Return (0..num-1) values */
export const range = (num: number): number[] => [...Array(num).keys()];

/** Converts Vector2 to [x, y] */
export function vec2ToArray(p: Vector2): [number, number] {
    return [p.x, p.y];
}

export const inRect = (p: Vector2, p1: Vector2, p2: Vector2): boolean => {
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const w = Math.abs(p1.x - p2.x);
    const h = Math.abs(p1.y - p2.y);
    return x <= p.x && p.x <= x + w && y <= p.y && p.y <= y + h;
}

export const defaultFont = '"Titillium Web", sans-serif';

export const formatTime = (s: number) => (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;

export const d2r = Phaser.Math.DegToRad;

export const zeroMatrix = (width: number, height = width): number[][] => {
    const mat: number[][] = [];
    for (let i = 0; i < width; i++) {
        const s: number[] = [];
        for (let j = 0; j < height; j++) {
            s.push(0);
        }
        mat.push(s);
    }
    return mat;
}

export const nullMatrix = <T>(width: number, height = width): (T | null)[][] => {
    const mat: (T | null)[][] = [];
    for (let i = 0; i < width; i++) {
        const s: (T | null)[] = [];
        for (let j = 0; j < height; j++) {
            s.push(null);
        }
        mat.push(s);
    }
    return mat;
}

