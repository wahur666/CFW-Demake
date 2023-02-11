import Vector2 = Phaser.Math.Vector2;

export default class WormholeObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    distance: number = 2;


    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get pos1(): Vector2 {
        return new Vector2(this.x1, this.y1);
    }

    get pos2(): Vector2 {
        return new Vector2(this.x2, this.y2);
    }

    isConnected(pos: Vector2): boolean {
        return this.pos1.equals(pos) || this.pos2.equals(pos);
    }

    getOtherPos(pos: Vector2): Vector2 {
        return this.pos1.equals(pos) ? this.pos2 : this.pos1;
    }
}