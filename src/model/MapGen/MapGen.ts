import { BT_MAP_GEN, GT_PATH, MAP_GEN_ENUM, TerrainInfo, TerrainTheme } from "./DMapGen";
import { IMapGen } from "./IMapGen";
import { FullCQGame } from "../Base/CQGame";
import { IPAnim } from "../Base/InProgressAnim";
import { CQGAMETYPES } from "../Base/DCQGame";
import Vector3 = Phaser.Math.Vector3;
import MAPSIZE = CQGAMETYPES.MAPSIZE;
import TERRAIN = CQGAMETYPES.TERRAIN;
import STATE = CQGAMETYPES.STATE;
import RANDOM_TEMPLATE = CQGAMETYPES.RANDOM_TEMPLATE;

export {};

const MAX_PLAYERS = 8;
const MAX_SYSTEMS = 16;
const GRID_SIZE = 4096;
const PLANET_SIZE = GRID_SIZE * 2.0;
const MAX_MAP_GRID = 64;
const MAX_MAP_SIZE = MAX_MAP_GRID * GRID_SIZE;

const RND_MAX_PLAYER_SYSTEMS = 8; // length constraint
const rndPlayerX: number[] = [0, 2, 5, 8, 9, 7, 4, 1];
const rndPlayerY: number[] = [4, 1, 0, 2, 5, 8, 9, 7];

const RND_MAX_REMOTE_SYSTEMS = 20;
const rndRemoteX: number[] = [4, 6, 1, 3, 5, 7, 2, 4, 6, 8, 1, 3, 5, 7, 2, 4, 6, 8, 3, 5];
const rndRemoteY: number[] = [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7];

const RING_MAX_SYSTEMS = 16;
const ringSystemX: number[] = [5, 6, 8, 7, 9, 7, 7, 5, 4, 3, 1, 2, 0, 2, 2, 4];
const ringSystemY: number[] = [0, 2, 2, 4, 5, 6, 8, 7, 9, 7, 7, 5, 4, 3, 1, 2];

const STAR_MAX_TREE = 8;
const starCenterX = 4;
const starCenterY = 4;
const starTreeX: number[][] = [
    [4, 3, 5],
    [6, 7, 8],
    [6, 8, 8],
    [6, 8, 7],
    [4, 5, 3],
    [2, 1, 0],
    [2, 0, 0],
    [2, 0, 1],
];
const starTreeY: number[][] = [
    [2, 0, 0],
    [2, 0, 1],
    [4, 3, 5],
    [6, 7, 8],
    [6, 8, 8],
    [6, 8, 7],
    [4, 5, 3],
    [2, 1, 0],
];

const FIX15 = 15;

const INT_MAX = Math.pow(2, 32) - 1;

const MAX_TERRAIN = 20;
const MAX_THEMES = 30;
const MAX_TYPES = 6;
const MAX_MACROS = 15;

function linerFunc(): number {
    return Math.round(Math.random() * INT_MAX);
}

function lessIsLikelyFunc(): number {
    let v = linerFunc();
    v = (v * v) >> FIX15;
    v = (v * v) >> FIX15;
    return v;
}

function moreIsLikelyFunc(): number {
    let v = linerFunc();
    v = (v * v) >> FIX15;
    v = (v * v) >> FIX15;
    return 0x00007fff - v;
}

const randFunc: (() => number)[] = [linerFunc, lessIsLikelyFunc, moreIsLikelyFunc];

const GENMAP_TAKEN = 1;
const GENMAP_LEVEL1 = 2;
const GENMAP_LEVEL2 = 3;
const GENMAP_PATH = 4;

const FLAG_PLANET = 0x01;
const FLAG_PATHON = 0x02;

const MAX_FLAGS = 20;

class FlagPost {
    type: number = 0; //u8
    xPos: number = 0; //u8
    yPos: number = 0; //u8
}

class GenSystem {
    flags: FlagPost[] = Array(MAX_FLAGS)
        .fill(0)
        .map(() => new FlagPost());
    numFlags: number = 0;

    sectorGridX: number = 0;
    sectorGridY: number = 0;
    index: number = 0;

    planetNameCount: number = 0;

    x: number = 0;
    y: number = 0;
    size: number = 0;
    jumpgateCount: number = 0;
    distToSystem: number[] = Array(MAX_SYSTEMS).fill(0);
    jumpgates: GenJumpgate[] = Array(MAX_SYSTEMS)
        .fill(0)
        .map(() => new GenJumpgate());
    systemId: number = 0;
    playerId: number = 0;
    connectionOrder: number = 0;
    playerDistToSystem: number[][] = Array(MAX_PLAYERS)
        .fill(0)
        .map(() => Array(MAX_SYSTEMS).fill(0));
    theme: TerrainTheme = new TerrainTheme();

    omStartEmpty: number = 0;
    omUsed: number = 0;
    objectMap: number[][] = Array(MAX_MAP_GRID)
        .fill(0)
        .map(() => Array(MAX_MAP_GRID).fill(0));

    constructor() {}

    initObjectMap() {
        this.omUsed = 0;
        this.omStartEmpty = 0;
        const centerDist = this.size / 2;
        const centerBoarder = centerDist - 1;
        const centerBoarder2 = centerBoarder * centerBoarder;
        const centerDist2 = centerDist * centerDist;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const dist = (i - centerDist) * (i - centerDist) + (j - centerDist) * (j - centerDist);
                if (dist > centerDist2) {
                    this.objectMap[i][j] = GENMAP_TAKEN;
                } else if (dist >= centerBoarder2) {
                    this.objectMap[i][j] = GENMAP_LEVEL1;
                } else {
                    this.omStartEmpty += 1;
                    this.objectMap[i][j] = 0;
                }
            }
        }
    }
}

class GenJumpgate {
    system1: GenSystem | null = null;
    system2: GenSystem | null = null;
    x1: number = 0;
    y1: number = 0;
    x2: number = 0;
    y2: number = 0;
    dist: number = 0;
    created: boolean = true;
}

class GenStruct {
    data: BT_MAP_GEN | null = null;

    numPlayers: number = 0;

    sectorSize: number = 0;
    sectorGrid: number[] = Array<number>(17).fill(0);

    gameSize: number = 0;
    sectorLayout: MAP_GEN_ENUM.SECTOR_FORMATION = MAP_GEN_ENUM.SECTOR_FORMATION.SF_RANDOM;

    systemsToMake: number = 0;

    terrainSize: number = 0;

    objectBoarder: number = 0;
    systems: GenSystem[] = Array(MAX_SYSTEMS)
        .fill(0)
        .map(() => new GenSystem());
    systemCount: number = 0;

    jumpgate: GenJumpgate[] = Array(MAX_SYSTEMS * MAX_SYSTEMS)
        .fill(0)
        .map(() => new GenJumpgate());
    numJumpGates: number = 0;
}

export class MapGen implements IMapGen {
    /* IMapGen methods */
    GenerateMap(game: FullCQGame): GenStruct {
        const map: GenStruct = new GenStruct();
        this.initMap(map, game);
        this.GenerateSystems(map);
        this.SelectThemes(map);
        this.CreateSystems(map);
        this.RunHomeMacros(map);
        this.CreateJumpgates(map);
        this.PopulateSystems(map);
        return map;
    }

    GetBestSystemNumber(game: FullCQGame, approxNumber: number): number {
        let numPlayers = 0;
        const assignments = Array(MAX_PLAYERS + 1).fill(0);
        let i;
        for (i = 0; i < game.activeSlots; ++i) {
            if (game.slot[i].state === STATE.READY || game.slot[i].state === STATE.ACTIVE) {
                assignments[game.slot[i].color] = 1;
            }
        }

        for (i = 1; i <= MAX_PLAYERS; i++) {
            numPlayers += assignments[i];
        }

        if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_RANDOM || game.templateType === RANDOM_TEMPLATE.TEMPLATE_NEW_RANDOM) {
            return Math.max(numPlayers, approxNumber);
        } else if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_RING) {
            return Math.max(Math.floor(numPlayers * (approxNumber / numPlayers)), numPlayers);
        } else if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_STAR) {
            if (numPlayers < 6) {
                for (i = 3; i > 0; --i) {
                    const number = 1 + i * numPlayers;
                    if (number <= approxNumber) {
                        return number;
                    }
                }
                return 1 + numPlayers;
            } else if (numPlayers < 8) {
                for (i = 2; i > 0; --i) {
                    const number = 1 + i * numPlayers;
                    if (number <= approxNumber) {
                        return number;
                    }
                }
                return 1 + numPlayers;
            } else {
                return 9;
            }
        }

        return approxNumber;
    }

    GetPossibleSystemNumbers(game: FullCQGame, list: number[]): number {
        return 0;
    }

    //map gen stuff
    initMap(map: GenStruct, game: FullCQGame) {
        const data = new BT_MAP_GEN();
        let i;
        for (i = 0; i < 17; ++i) {
            map.sectorGrid[i] = 0;
        }

        if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_RANDOM) {
            map.sectorLayout = MAP_GEN_ENUM.SECTOR_FORMATION.SF_RANDOM;
        } else if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_NEW_RANDOM) {
            map.sectorLayout = MAP_GEN_ENUM.SECTOR_FORMATION.SF_MULTI_RANDOM;
        } else if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_RING) {
            map.sectorLayout = MAP_GEN_ENUM.SECTOR_FORMATION.SF_RING;
        } else if (game.templateType === RANDOM_TEMPLATE.TEMPLATE_STAR) {
            map.sectorLayout = MAP_GEN_ENUM.SECTOR_FORMATION.SF_STAR;
        }

        map.data = data;

        map.systemCount = 0;
        map.numJumpGates = 0;

        map.numPlayers = 0;

        const assignments: number[] = Array(MAX_PLAYERS + 1).fill(0);
        for (i = 0; i < game.activeSlots; ++i) {
            if (game.slot[i].state === STATE.READY) {
                assignments[game.slot[i].color] = 1;
            }
        }

        for (i = 1; i <= MAX_PLAYERS; i++) {
            map.numPlayers += assignments[i];
        }

        if (game.mapSize == MAPSIZE.SMALL_MAP) {
            map.gameSize = 0;
        } else if (game.mapSize == MAPSIZE.MEDIUM_MAP) {
            map.gameSize = 1;
        } else {
            map.gameSize = 2;
        }

        if (game.terrain === TERRAIN.LIGHT_TERRAIN) {
            map.terrainSize = 0;
        } else if (game.terrain === TERRAIN.MEDIUM_TERRAIN) {
            map.terrainSize = 1;
        } else {
            map.terrainSize = 2;
        }

        map.systemsToMake = this.GetBestSystemNumber(game, game.numSystems);
        map.sectorSize = 8;
    }

    insertObject(object: string, position: Vector3, playerID: number, systemID: number, system: GenSystem) {}

    //Util funcs

    GetRand(min: number, max: number, mapFunc: MAP_GEN_ENUM.DMAP_FUNC): number {
        let val = randFunc[mapFunc]() % (max + 1);
        val = val + min;
        return val;
    }

    GenerateSystems(map: GenStruct) {
        if (
            map.sectorLayout === MAP_GEN_ENUM.SECTOR_FORMATION.SF_RANDOM ||
            map.sectorLayout === MAP_GEN_ENUM.SECTOR_FORMATION.SF_MULTI_RANDOM
        ) {
            this.generateSystemsRandom(map);
        } else if (map.sectorLayout === MAP_GEN_ENUM.SECTOR_FORMATION.SF_RING) {
            this.generateSystemsRing(map);
        } else if (map.sectorLayout === MAP_GEN_ENUM.SECTOR_FORMATION.SF_STAR) {
            this.generateSystemsStar(map);
        }
    }

    generateSystemsRandom(map: GenStruct) {
        let s1: number;
        for (s1 = 0; s1 < map.numPlayers; s1++) {
            let system1: GenSystem = map.systems[s1];
            do {
                const val = this.GetRand(0, RND_MAX_PLAYER_SYSTEMS - 1, MAP_GEN_ENUM.DMAP_FUNC.LINEAR);
                system1.sectorGridX = rndPlayerX[val];
                system1.sectorGridY = rndPlayerY[val];
                system1.connectionOrder = val;
            } while (this.SystemsOverlap(map, system1));

            map.sectorGrid[system1.sectorGridX] |= 0x00000001 << system1.sectorGridY;

            system1.index = s1;
            system1.playerId = s1 + 1;

            map.systemCount++;
        }
        for (s1 = map.numPlayers; s1 < map.systemsToMake; s1++) {
            const system1: GenSystem = map.systems[s1];

            do {
                const val = this.GetRand(0, RND_MAX_REMOTE_SYSTEMS - 1, MAP_GEN_ENUM.DMAP_FUNC.LINEAR);
                system1.sectorGridX = rndRemoteX[val];
                system1.sectorGridY = rndRemoteY[val];
            } while (this.SystemsOverlap(map, system1));

            map.sectorGrid[system1.sectorGridX] |= 0x00000001 << system1.sectorGridY;

            system1.index = s1;

            map.systemCount++;
        }
    }

    generateSystemsRing(map: GenStruct) {
        throw Error("Ring system not implemented");
    }

    generateSystemsStar(map: GenStruct) {
        throw Error("Star system not implemented");
    }

    SystemsOverlap(map: GenStruct, system: GenSystem): boolean {
        for (let count = 0; count < map.systemCount; count++) {
            if ((map.sectorGrid[system.sectorGridX] >> system.sectorGridY) & 0x01) {
                return true;
            }
        }
        return false;
    }

    GetJumpgatePositions(map: GenStruct, sys1: GenSystem, sys2: GenSystem): { jx1: number; jy1: number; jx2: number; jy2: number } {
        return { jx1: 0, jy1: 0, jx2: 0, jy2: 0 };
    }

    CrossesAnotherSystem(map: GenStruct, sys1: GenSystem, sys2: GenSystem, jx1: number, jy1: number, jx2: number, jy2: number): boolean {
        return false;
    }

    CrossesAnotherLink(map: GenStruct, gate: GenJumpgate): boolean {
        return false;
    }

    LinesCross(
        line1x1: number,
        line1y1: number,
        line1x2: number,
        line1y2: number,
        line2x1: number,
        line2y1: number,
        line2x2: number,
        line2y2: number
    ): boolean {
        return false;
    }

    SelectThemes(map: GenStruct) {
        let playerThemeCount = 0;
        let i;
        for (i = 0; i < MAX_THEMES; ++i) {
            // if(map.data?.themes[i].okForPlayerStart)
            console.log(map.data?.themes[i].okForPlayerStart && map.data?.themes[i].sizeOk & (0x01 << map.gameSize));
        }
    }

    CreateSystems(map: GenStruct) {}

    RunHomeMacros(map: GenStruct) {}

    findMacroPosition(
        system: GenSystem,
        centerX: number,
        centerY: number,
        range: number,
        size: number,
        overlap: MAP_GEN_ENUM.OVERLAP
    ): { result: boolean; posX?: number; posY?: number } {
        return { result: false, posX: 0, posY: 0 };
    }

    getMacroCenterPos(system: GenSystem): { x: number; y: number } {
        return { x: 0, y: 0 };
    }

    createPlanetFromList(xPos: number, yPos: number, system: GenSystem, range: number, planetList: string[] = Array(GT_PATH).fill("")) {}

    placeMacroTerrain(centerX: number, centerY: number, system: GenSystem, range: number, terrainInfo: TerrainInfo) {}

    CreateJumpgates(map: GenStruct) {}

    createRandomGates3(map: GenStruct) {}

    createGateLevel2(
        map: GenStruct,
        totalLevel: number,
        levelSystems: number,
        targetSystems: number,
        gateNum: number,
        currentGates: number[],
        score: number,
        bestGates: number[],
        bestScore: number,
        bestGateNum: number,
        moreAllowed: boolean
    ): { bestScore: number; bestGateNum: number } {
        return { bestScore: 0, bestGateNum: 0 };
    }

    createRandomGates2(map: GenStruct) {}

    createGateLevel(
        map: GenStruct,
        totalLevel: number,
        levelSystems: number,
        targetSystems: number,
        gateNum: number,
        currentGates: number[],
        score: number,
        bestGates: number[],
        bestScore: number,
        bestGateNum: number,
        moreAllowed: boolean
    ): { bestScore: number; bestGateNum: number } {
        return { bestScore: 0, bestGateNum: 0 };
    }

    scoreGate(map: GenStruct, gateIndex: number): number {
        return 0;
    }

    markSystems(
        systemUnconnected: number,
        system: GenSystem,
        systemsVisited: number
    ): { systemUnconnected: number; systemsVisited: number } {
        return { systemsVisited: 0, systemUnconnected: 0 };
    }

    createRandomGates(map: GenStruct) {}

    createRingGates(map: GenStruct) {}

    createStarGates(map: GenStruct) {}

    createJumpgatesForIndexs(map: GenStruct, index1: number, index2: number) {}

    PopulateSystems(map: GenStruct, ipAnim?: IPAnim) {}

    PopulateSystem(map: GenStruct, system: GenSystem) {}

    placePlanetsMoons(map: GenStruct, system: GenSystem, planetPosX: number, planetPosY: number) {}

    SpaceEmpty(system: GenSystem, xPos: number, yPos: number, overlap: MAP_GEN_ENUM.OVERLAP, size: number): boolean {
        return false;
    }

    FillPosition(system: GenSystem, xPos: number, yPos: number, size: number, overlap: MAP_GEN_ENUM.OVERLAP) {}

    FindPosition(system: GenSystem, width: number, overlap: MAP_GEN_ENUM.OVERLAP): { xPos: number; yPos: number; res: boolean } {
        return { res: true, xPos: 0, yPos: 0 };
    }

    //	bool ColisionWithObject(GenObj * obj,Vector vect,U32 rad,MAP_GEN_ENUM::OVERLAP overlap);

    GenerateTerain(map: GenStruct, system: GenSystem) {}

    PlaceTerrain(map: GenStruct, terrain: TerrainInfo, system: GenSystem) {}

    PlaceRandomField(terrain: TerrainInfo, numToPlace: number, startX: number, startY: number, system: GenSystem) {}

    PlaceSpottyField(terrain: TERRAIN, numToPlace: number, startX: number, startY: number, system: GenSystem) {}

    PlaceRingField(terrain: TerrainInfo, system: GenSystem) {}

    PlaceRandomRibbon(terrain: TerrainInfo, length: number, startX: number, startY: number, system: GenSystem) {}

    BuildPaths(system: GenSystem) {}

    //other
    init() {}

    removeFromArray(nx: number, ny: number, tempX: number[], tempY: number[], tempIndex: number): number {
        return tempIndex;
    }

    isInArray(arrX: number[], arrY: number[], index: number, nx: number, ny: number): boolean {
        return false;
    }

    // isOverlapping(arrX: number[], arrY: number[], index: number, nx: number, ny: number): boolean {
    //     return false;
    // }

    checkNewXY(
        tempX: number[],
        tempY: number[],
        tempIndex: number,
        finalX: number,
        finalY: number,
        finalIndex: number,
        terrain: TerrainInfo,
        system: GenSystem,
        newX: number,
        newY: number
    ): number {
        return tempIndex;
    }

    connectPosts(post1: FlagPost, post2: FlagPost, system: GenSystem) {}
}
