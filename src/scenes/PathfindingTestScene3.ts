import Phaser from "phaser";
import { SHARED_CONFIG } from "../model/config";
import { SceneRegistry } from "./SceneRegistry";
import { dir2int, dir2int2, GridController, Layer, UnitController } from "../model/FlowField.ts";
import { nullMatrix } from "../helpers/utils.ts";
import flow_icons from "../assets/Sprite-0002.png";
import corvette from "../assets/playerShip1_blue.png";
import Vector2 = Phaser.Math.Vector2;
import Pointer = Phaser.Input.Pointer;
import { Images } from "./PreloadScene.ts";

export default class PathfindingTestScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;
    graphics: Phaser.GameObjects.Graphics;

    radius = 3;

    sectorSize = 64;
    unitController: UnitController;
    labels: (Phaser.GameObjects.Text | null)[][];
    flowicons: (Phaser.GameObjects.Image | null)[][];

    constructor() {
        super(SceneRegistry.PATHFINDIG_TEST);
        this.config = SHARED_CONFIG;
    }

    preload() {
        this.load.spritesheet("flow_icons", flow_icons, {
            frameHeight: 16,
            frameWidth: 16,
            startFrame: 0,
            endFrame: 8,
        });
        this.load.image(Images.CORVETTE, corvette);
    }

    create() {
        const map = new GridController(new Vector2(40, 22), 20);
        this.unitController = new UnitController(this, map);
        this.drawGrid(map);
        this.labels = nullMatrix(40, 22);
        this.flowicons = nullMatrix(40, 22);

        for (let i = 4; i < 6; i++) {
            for (let j = 0; j < 15; j++) {
                map.roughLayer.addCell(new Vector2(i, j));
            }
        }

        for (let i = 9; i < 15; i++) {
            for (let j = 7; j < 17; j++) {
                map.unpassableLayer.addCell(new Vector2(i, j));
            }
        }

        for (let i = 12; i < 17; i++) {
            for (let j = 2; j < 3; j++) {
                map.unpassableLayer.addCell(new Vector2(i, j));
            }
        }

        this.drawLayer(map.roughLayer, 0xf6c391);
        this.drawLayer(map.unpassableLayer, 0x0000ff);
        map.createCostField();
        // this.drawValues(map)

        this.input.on("pointerdown", (pointer: Pointer) => {
            const a = map.curFlowField.getCellFromWorldPos(this.getWorldPos(pointer));
            if (a) {
                map.curFlowField.createIntegrationField(a);
                map.curFlowField.createFlowField();
                this.redrawIcons(map);

                // this.redrawLabels(map);
            }
        });
        this.createIcons(map);
        // this.createLabels(map);
    }

    update(time: number, delta: number) {
        this.unitController.update(delta);
    }

    getWorldPos(pointer: Pointer): Vector2 {
        return this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    drawGrid(map: GridController) {
        const cellDiameter = map.cellRadius * 2;
        const c = (i: number) => cellDiameter + i * cellDiameter;
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xff00ff, 1);
        this.graphics.lineStyle(1, 0xff0000, 1);
        for (let i = 0; i < map.gridSize.x; i++) {
            for (let j = 0; j < map.gridSize.y; j++) {
                if (map.curFlowField.grid[i][j]) {
                    this.graphics.strokeRect(c(i) - map.cellRadius, c(j) - map.cellRadius, cellDiameter, cellDiameter);
                }
            }
        }
    }

    drawLayer(map: Layer, color: number) {
        const cellDiameter = map.cellRadius * 2;
        const c = (i: number) => cellDiameter + i * cellDiameter;
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(color, 0.2);
        for (let i = 0; i < map.gridSize.x; i++) {
            for (let j = 0; j < map.gridSize.y; j++) {
                if (map.grid[i][j]) {
                    this.graphics.fillRect(c(i) - map.cellRadius, c(j) - map.cellRadius, cellDiameter, cellDiameter);
                }
            }
        }
    }

    createLabels(map: GridController) {
        const cellDiameter = map.cellRadius * 2;
        const c = (i: number) => cellDiameter + i * cellDiameter;

        for (let i = 0; i < map.gridSize.x; i++) {
            for (let j = 0; j < map.gridSize.y; j++) {
                this.labels[i][j] = this.add.text(
                    c(i) - map.cellRadius,
                    c(j) - map.cellRadius,
                    `${map.curFlowField.grid[i][j]!.adjustedCost}` ?? "",
                    {
                        fontSize: "24px",
                        color: "#fff",
                    }
                );
            }
        }
    }

    createIcons(map: GridController) {
        const cellDiameter = map.cellRadius * 2;
        const c = (i: number) => cellDiameter + i * cellDiameter;
        for (let i = 0; i < map.gridSize.x; i++) {
            for (let j = 0; j < map.gridSize.y; j++) {
                this.flowicons[i][j] = this.add.image(c(i), c(j), "flow_icons", dir2int2(map.curFlowField.grid[i][j]!.bestDirection));
            }
        }
    }

    redrawIcons(map: GridController) {
        for (let i = 0; i < map.gridSize.x; i++) {
            for (let j = 0; j < map.gridSize.y; j++) {
                this.flowicons[i][j]!.setFrame(dir2int2(map.curFlowField.grid[i][j]!.bestDirection));
            }
        }
    }
}
