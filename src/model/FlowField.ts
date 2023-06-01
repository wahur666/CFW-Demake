import { nullMatrix, toVec2 } from "../helpers/utils.ts";
import Unit from "../entity/Unit.ts";
import Phaser from "phaser";
import { Corvette } from "../entity/units/Corvette.ts";
import Vector2 = Phaser.Math.Vector2;

enum Direction {
    NW = "NW",
    N = "N",
    NE = "NE",
    W = "W",
    NONE = "NONE",
    E = "E",
    SW = "SW",
    S = "S",
    SE = "SE",
}

const dd = [Direction.NW, Direction.W, Direction.SW, Direction.N, Direction.NONE, Direction.S, Direction.NE, Direction.E, Direction.SE];
const dd1 = [Direction.NW, Direction.N, Direction.NE, Direction.W, Direction.NONE, Direction.E, Direction.SW, Direction.S, Direction.SE];

const directions: Vector2[] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
].map(toVec2);
const directions4: Vector2[] = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
].map(toVec2);
const directions8: Vector2[] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
].map(toVec2);
const directionMap = new Map<string, Direction>();
for (let i = 0; i < directions.length; i++) {
    directionMap.set(hashVec2(directions[i]), dd1[i]);
}

export function dir2int(dir: Direction): number {
    switch (dir) {
        case Direction.NW:
            return 0;
        case Direction.N:
            return 1;
        case Direction.NE:
            return 2;
        case Direction.W:
            return 3;
        case Direction.NONE:
            return 4;
        case Direction.E:
            return 5;
        case Direction.SW:
            return 6;
        case Direction.S:
            return 7;
        case Direction.SE:
            return 8;
    }
}

export function dir2int2(dir: Direction): number {
    switch (dir) {
        case Direction.NW:
            return 0;
        case Direction.N:
            return 3;
        case Direction.NE:
            return 6;
        case Direction.W:
            return 1;
        case Direction.NONE:
            return 4;
        case Direction.E:
            return 7;
        case Direction.SW:
            return 2;
        case Direction.S:
            return 5;
        case Direction.SE:
            return 8;
    }
}

function vec2toDirection(pos: Vector2): Direction | undefined {
    return directionMap.get(hashVec2(pos));
}

function hashVec2(vec: Vector2): string {
    return `${vec.x},${vec.y}`;
}

export class Cell {
    public worldPos: Vector2;
    public gridIndex: Vector2;
    private cost: number;
    public bestCost: number;
    public adjustedCost: number;
    public bestDirection: Direction;

    constructor(worldPos: Vector2, gridIndex: Vector2) {
        this.worldPos = worldPos;
        this.gridIndex = gridIndex;
        this.cost = 1;
        this.reset();
    }

    reset() {
        this.adjustedCost = this.cost;
        this.bestCost = 500;
        this.bestDirection = Direction.NONE;
    }

    increaseConst(amount: number) {
        this.cost = Math.min(255, this.cost + amount);
    }
}

export class FlowField {
    public grid: (Cell | null)[][];
    public gridSize: Vector2;
    public cellRadius: number;
    public destinationCell: Cell;

    private readonly cellDiameter: number;

    constructor(cellRadius: number, gridSize: Phaser.Math.Vector2) {
        this.cellRadius = cellRadius;
        this.cellDiameter = cellRadius * 2;
        this.gridSize = gridSize;
    }

    public createGrid() {
        this.grid = nullMatrix<Cell>(this.gridSize.x, this.gridSize.y);
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const worldPos = new Vector2(this.cellDiameter * x + this.cellRadius, this.cellDiameter * y + this.cellRadius);
                this.grid[x][y] = new Cell(worldPos, new Vector2(x, y));
            }
        }
    }

    public createCostField(layers: Layer[]) {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                for (const layer of layers) {
                    if (layer.grid[x][y]) {
                        this.grid[x][y]!.increaseConst(layer.cost);
                    }
                }
            }
        }
    }

    private resetCellsBestValue() {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const el = this.grid[x][y];
                el!.reset();
            }
        }
    }

    public createIntegrationField(destinationCell: Cell) {
        this.resetCellsBestValue();
        this.destinationCell = destinationCell;

        this.destinationCell.adjustedCost = 0;
        this.destinationCell.bestCost = 0;

        const cellsToCheck: Cell[] = [destinationCell];
        while (cellsToCheck.length > 0) {
            const currCell = cellsToCheck.shift();
            if (!currCell) continue;
            const neighbours = this.getNeighbourCells(currCell.gridIndex, directions4);
            for (const currNeighbour of neighbours) {
                if (currNeighbour.adjustedCost === 255) continue;
                if (currNeighbour.adjustedCost + currCell.bestCost < currNeighbour.bestCost) {
                    currNeighbour.bestCost = currNeighbour.adjustedCost + currCell.bestCost;
                    cellsToCheck.push(currNeighbour);
                }
            }
        }
    }

    createFlowField() {
        for (const curCell of this.grid.flat()) {
            if (!curCell) return;
            console.log("y");
            const curNeighbours = this.getNeighbourCells(curCell.gridIndex, directions);
            let bestCost = curCell.bestCost;

            for (const curNeighbour of curNeighbours) {
                if (curNeighbour.bestCost < bestCost) {
                    bestCost = curNeighbour.bestCost;
                    const newDir = vec2toDirection(
                        new Vector2(curNeighbour.gridIndex.x - curCell.gridIndex.x, curNeighbour.gridIndex.y - curCell.gridIndex.y)
                    );
                    if (newDir) {
                        curCell.bestDirection = newDir;
                    }
                }
            }
        }
    }

    private getNeighbourCells(gridIndex: Vector2, directions: Vector2[]): Cell[] {
        const neighbourCells: Cell[] = [];
        for (const direction of directions) {
            const newNeighbour = this.getCellAtRelativePos(gridIndex, direction);
            if (newNeighbour) {
                neighbourCells.push(newNeighbour);
            }
        }
        return neighbourCells;
    }

    private getCellAtRelativePos(originPos: Vector2, relativePos: Vector2): Cell | null {
        const newPos = new Vector2(originPos.x + relativePos.x, originPos.y + relativePos.y);
        if (newPos.x < 0 || newPos.x >= this.gridSize.x || newPos.y < 0 || newPos.y >= this.gridSize.y) {
            return null;
        } else {
            return this.grid[newPos.x][newPos.y];
        }
    }

    public getCellFromWorldPos(worldPos: Vector2): Cell | null {
        const x = Math.floor((worldPos.x + this.cellRadius - this.cellDiameter) / this.cellDiameter);
        const y = Math.floor((worldPos.y + this.cellRadius - this.cellDiameter) / this.cellDiameter);
        if (x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y) {
            return null;
        } else {
            return this.grid[x][y];
        }
    }
}

export class Layer {
    public grid: (Cell | null)[][];
    public gridSize: Vector2;
    public cellRadius: number;
    public cost: number;
    private readonly cellDiameter: number;

    constructor(cellRadius: number, gridSize: Phaser.Math.Vector2, cost: number) {
        this.cellRadius = cellRadius;
        this.cellDiameter = cellRadius * 2;
        this.gridSize = gridSize;
        this.cost = cost;
        this.grid = nullMatrix<Cell>(this.gridSize.x, this.gridSize.y);
    }

    addCell(pos: Vector2) {
        const worldPos = new Vector2(this.cellDiameter * pos.x + this.cellRadius, this.cellDiameter * pos.y + this.cellRadius);
        this.grid[pos.x][pos.y] = new Cell(worldPos, pos);
    }
}

export class GridController {
    public gridSize: Vector2;
    public cellRadius: number = 10;
    public curFlowField: FlowField;
    public roughLayer: Layer;
    public unpassableLayer: Layer;

    private initializeFlowField() {
        this.curFlowField = new FlowField(this.cellRadius, this.gridSize);
        this.curFlowField.createGrid();
    }

    constructor(gridSize: Phaser.Math.Vector2, cellRadius: number) {
        this.gridSize = gridSize;
        this.cellRadius = cellRadius;
        this.initializeFlowField();
        this.roughLayer = new Layer(this.cellRadius, this.gridSize, 4);
        this.unpassableLayer = new Layer(this.cellRadius, this.gridSize, 255);
    }

    createCostField() {
        this.curFlowField.createCostField([this.roughLayer, this.unpassableLayer]);
        console.log("grid", this.curFlowField.grid);
    }
}

export class UnitController {
    public gridController: GridController;
    public unit: Unit;

    private unitsInGame: Unit[] = [];

    constructor(scene: Phaser.Scene, gridController: GridController) {
        this.gridController = gridController;
        this.unit = new Corvette(scene, new Vector2(50, 50));
    }

    update(delta: number) {
        const dest = this.gridController.curFlowField.destinationCell;
        const currCell = this.gridController.curFlowField.getCellFromWorldPos(this.unit.pos);
        if (currCell && dest && currCell !== dest) {
            const vel = 5 * delta;
            const dir = dir2int(currCell.bestDirection);
            const vec2 = directions[dir];
            const targetVector = vec2.clone().normalize().scale(vel);
            this.unit.setVelocity(targetVector.x, targetVector.y);
        } else {
            this.unit.body?.stop();
        }
    }
}
