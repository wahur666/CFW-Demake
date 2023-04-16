import Phaser from "phaser";
import { SHARED_CONFIG } from "../model/config";
import { SceneRegistry } from "./SceneRegistry";
import { guiVisible, objectMode } from "../pages/Editor";
import { SectorObjectMasks } from "../entity/SectorObject";
import { zeroMatrix } from "../helpers/utils";
import Vector2 = Phaser.Math.Vector2;
import Pointer = Phaser.Input.Pointer;

export default class EditorScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;

    squareSize = 20;
    sectorSize = 32;
    graphics: Phaser.GameObjects.Graphics;
    sectorMap: SectorObjectMasks[][];
    sectorObjectGraphics: Phaser.GameObjects.Graphics;
    s2: Phaser.GameObjects.Graphics;
    currentMask: SectorObjectMasks;
    drawSize = 2;

    constructor() {
        super(SceneRegistry.EDITOR);
        this.config = SHARED_CONFIG;
        this.sectorMap = zeroMatrix(this.sectorSize);
        this.currentMask = SectorObjectMasks.OrePatch;
    }

    create() {
        this.graphics = this.add.graphics();
        this.sectorObjectGraphics = this.add.graphics();
        this.s2 = this.add.graphics();
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                this.graphics.fillRect(40 + i * this.squareSize, 40 + j * this.squareSize, this.squareSize, this.squareSize);
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.strokeRect(40 + i * this.squareSize, 40 + j * this.squareSize, this.squareSize, this.squareSize);
                this.graphics.lineStyle(1, 0xff0000, 1);
            }
        }
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                if (!this.coordinatesInCircle(40 + i * this.squareSize, 40 + j * this.squareSize)) {
                    this.sectorMap[i][j] = SectorObjectMasks.OutOfBoundSpace;
                }
            }
        }
        guiVisible.value = true;
        this.input.on("pointermove", (ev: Pointer) => {
            let i;
            let j;
            if (this.drawSize == 1) {
                i = Math.floor((ev.position.x - 40) / this.squareSize);
                j = Math.floor((ev.position.y - 40) / this.squareSize);
            } else if (this.drawSize == 2) {
                i = Math.round((ev.position.x - 40) / this.squareSize);
                j = Math.round((ev.position.y - 40) / this.squareSize);
            }
            console.log("mouse ij", i, j);
            this.s2.clear();
            if (!(0 < i && i < this.sectorSize && 0 < j && j < this.sectorSize)) {
                return;
            }
            this.s2.fillStyle(0x654321, 1);
            if (this.drawSize == 1) {
                this.s2.fillRect(40 + i * this.squareSize, 40 + j * this.squareSize, this.squareSize, this.squareSize);
            } else if (this.drawSize == 2) {
                this.s2.fillRect(40 + (i - 1) * this.squareSize, 40 + (j - 1) * this.squareSize, this.squareSize, this.squareSize);
                this.s2.fillRect(40 + (i - 1) * this.squareSize, 40 + j * this.squareSize, this.squareSize, this.squareSize);
                this.s2.fillRect(40 + i * this.squareSize, 40 + (j - 1) * this.squareSize, this.squareSize, this.squareSize);
                this.s2.fillRect(40 + i * this.squareSize, 40 + j * this.squareSize, this.squareSize, this.squareSize);
            }
            if (this.sectorMap[i][j] !== SectorObjectMasks.OutOfBoundSpace) {
                if (ev.leftButtonDown()) {
                    this.sectorMap[i][j] = this.currentMask ?? SectorObjectMasks.FreeSpace;
                } else if (ev.rightButtonDown()) {
                    this.sectorMap[i][j] = SectorObjectMasks.FreeSpace;
                }
            }
        });
    }

    update(time: number, delta: number) {
        this.sectorObjectGraphics.clear();
        for (let i = 0; i < this.sectorSize; i++) {
            for (let j = 0; j < this.sectorSize; j++) {
                switch (this.sectorMap[i][j]) {
                    case SectorObjectMasks.OutOfBoundSpace:
                        this.sectorObjectGraphics.fillStyle(0x123456, 1);
                        this.sectorObjectGraphics.fillRect(
                            40 + i * this.squareSize,
                            40 + j * this.squareSize,
                            this.squareSize,
                            this.squareSize
                        );
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
                        this.sectorObjectGraphics.fillStyle(0xcc9966, 1);
                        this.sectorObjectGraphics.fillRect(
                            40 + i * this.squareSize,
                            40 + j * this.squareSize,
                            this.squareSize,
                            this.squareSize
                        );
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
        const cx = 40 + (this.squareSize * this.sectorSize) / 2;
        const cy = 40 + (this.squareSize * this.sectorSize) / 2;
        const radius = this.squareSize * (this.sectorSize / 2 + 1);
        const cp = new Vector2(cx, cy);
        const p1 = new Vector2(x, y);
        const p2 = new Vector2(x + this.squareSize, y);
        const p3 = new Vector2(x, y + this.squareSize);
        const p4 = new Vector2(x + this.squareSize, y + this.squareSize);
        return cp.distance(p1) <= radius && cp.distance(p2) <= radius && cp.distance(p3) <= radius && cp.distance(p4) <= radius;
    }
}
