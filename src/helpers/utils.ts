import Vector2 = Phaser.Math.Vector2;

/** Return (0..num-1) values */
export const range = (num: number): number[] => [...Array(num).keys()];

/** Converts Vector2 to [x, y] */
export function vector2ToArray(p: Vector2): [number, number] {
    return [p.x, p.y];
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

