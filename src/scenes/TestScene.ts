import Phaser from "phaser";
import {SHARED_CONFIG} from "../model/config";
import {SceneRegistry} from "./SceneRegistry";
import {guiVisible} from "../game";
import Vector2 = Phaser.Math.Vector2;
import {SectorObject, SectorObjectMasks} from "../entity/SectorObject";
import {zeroMatrix} from "../helpers/utils";


export default class TestScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;

    squareSize = 20
    sectorSize = 32
    graphics: Phaser.GameObjects.Graphics;
    sectorMap: SectorObjectMasks[][];

    constructor() {
        super(SceneRegistry.TEST);
        this.config = SHARED_CONFIG;
        this.sectorMap = zeroMatrix(this.sectorSize);
    }

    create() {
        this.graphics = this.add.graphics()
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                this.graphics.fillRect(40 + (i * this.squareSize), 40 + (j * this.squareSize),
                    this.squareSize, this.squareSize)
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.strokeRect(40 + (i * this.squareSize), 40 + (j * this.squareSize),
                    this.squareSize, this.squareSize)
                this.graphics.lineStyle(1, 0xff0000, 1);
            }
        }
        guiVisible.value = true;
    }

    update(time: number, delta: number) {
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                switch (this.sectorMap[i][j]) {
                    case SectorObjectMasks.OutOfBoundSpace:
                        break;
                    case SectorObjectMasks.FreeSpace:
                        break;
                    case SectorObjectMasks.HabitablePlanet:
                        break;
                    case SectorObjectMasks.MoonPlanet:
                        break;
                    case SectorObjectMasks.GasPlanet:
                        break;
                    case SectorObjectMasks.SwampPlanet:
                        break;
                    case SectorObjectMasks.Wormhole:
                        break;
                    case SectorObjectMasks.OrePatch:
                        break;
                    case SectorObjectMasks.GasPatch:
                        break;
                    case SectorObjectMasks.Debris:
                        break;

                }
            }
        }
    }


    private coordinatesInCircle(x: number, y: number): boolean {
        const cx = 40 + this.squareSize * this.sectorSize / 2;
        const cy = 40 + this.squareSize * this.sectorSize / 2;
        const radius = this.squareSize * (this.sectorSize / 2 + 1);
        const cp = new Vector2(cx, cy);
        const p1 = new Vector2(x, y);
        const p2 = new Vector2(x + this.squareSize, y);
        const p3 = new Vector2(x, y + this.squareSize);
        const p4 = new Vector2(x + this.squareSize, y + this.squareSize);
        return cp.distance(p1) < radius
            && cp.distance(p2) < radius
            && cp.distance(p3) < radius
            && cp.distance(p4) < radius;
    }
}
