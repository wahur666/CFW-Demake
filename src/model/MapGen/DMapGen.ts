import SECTOR_SIZE = MAP_GEN_ENUM.SECTOR_SIZE;

export {};

export const GT_PATH = 32;

export namespace MAP_GEN_ENUM {
    export enum DMAP_FUNC {
        LINEAR = 0,
        LESS_IS_LIKLY,
        MORE_IS_LIKLY,
    }

    export enum PLACEMENT {
        RANDOM = 0,
        CLUSTER,
        PLANET_RING,
        STREEKS,
        SPOTS,
    }

    export enum OVERLAP {
        NO_OVERLAP = 0,
        LEVEL1, //can overlap another LEVEL1 or LEVEL2
        LEVEL2, //may be overlaped by a level1
    }

    export enum SECTOR_SIZE {
        SMALL_SIZE = 0x01,
        MEDIUM_SIZE = 0x02,
        LARGE_SIZE = 0x04,
        S_M_SIZE = 0x03,
        S_L_SIZE = 0x05,
        M_L_SIZE = 0x06,
        ALL_SIZE = 0x07,
    }

    export enum SECTOR_FORMATION {
        SF_RANDOM,
        SF_RING,
        SF_DOUBLERING,
        SF_STAR,
        SF_INRING,
        SF_MULTI_RANDOM,
    }

    export enum MACRO_OPERATION {
        MC_PLACE_HABITABLE_PLANET,
        MC_PLACE_GAS_PLANET,
        MC_PLACE_METAL_PLANET,
        MC_PLACE_OTHER_PLANET,
        MC_PLACE_TERRAIN,
        MC_PLACE_PLAYER_BOMB,
        MC_MARK_RING,
    }
}

const MAX_TERRAIN = 20;
const MAX_THEMES = 30;
const MAX_TYPES = 6;
const MAX_MACROS = 15;

export class TerrainInfo {
    probability: number = 0;
    minToPlace: number = 0;
    maxToPlace: number = 0;
    numberFunc: MAP_GEN_ENUM.DMAP_FUNC = MAP_GEN_ENUM.DMAP_FUNC.LINEAR;
    size: number = 0;
    requiredToPlace: number = 0;
    overlap: MAP_GEN_ENUM.OVERLAP = MAP_GEN_ENUM.OVERLAP.NO_OVERLAP;
    placement: MAP_GEN_ENUM.PLACEMENT = MAP_GEN_ENUM.PLACEMENT.RANDOM;
    terrainArchType: number[] = Array(GT_PATH).fill(0);
}

export class Macros {
    operation: MAP_GEN_ENUM.MACRO_OPERATION = MAP_GEN_ENUM.MACRO_OPERATION.MC_PLACE_HABITABLE_PLANET;
    range: number = 0;
    active: boolean = false;
    info: TerrainInfo = new TerrainInfo();
    infoOverlap: MAP_GEN_ENUM.OVERLAP = MAP_GEN_ENUM.OVERLAP.NO_OVERLAP;
}

export class TerrainTheme {
    systemKit: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));
    metalPlanets: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));
    gasPlanets: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));
    habitablePlanets: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));
    otherPlanets: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));

    moonTypes: string[][] = Array(MAX_TYPES).fill(Array(GT_PATH).fill(""));

    sizeOk: MAP_GEN_ENUM.SECTOR_SIZE = SECTOR_SIZE.ALL_SIZE;
    minSize: number = 0;
    maxSize: number = 0;
    sizeFunc: MAP_GEN_ENUM.DMAP_FUNC = MAP_GEN_ENUM.DMAP_FUNC.LINEAR;

    numHabitablePlanets: number[] = Array(3).fill(0);
    numMetalPlanets: number[] = Array(3).fill(0);
    numGasPlanets: number[] = Array(3).fill(0);
    numOtherPlanets: number[] = Array(3).fill(0);

    minMoonsPerPlanet: number = 0;
    maxMoonsPerPlanet: number = 0;
    moonNumberFunc: MAP_GEN_ENUM.DMAP_FUNC = MAP_GEN_ENUM.DMAP_FUNC.LINEAR;

    numNuggetPatchesMetal: number[] = Array(3).fill(0);
    numNuggetPatchesGas: number[] = Array(3).fill(0);

    terrain: TerrainInfo[] = Array(MAX_TERRAIN)
        .fill(0)
        .map(() => new TerrainInfo());
    nuggetsMetalTypes: TerrainInfo[] = Array(MAX_TYPES)
        .fill(0)
        .map(() => new TerrainInfo());
    nuggetsGasTypes: TerrainInfo[] = Array(MAX_TYPES)
        .fill(0)
        .map(() => new TerrainInfo());

    okForPlayerStart: boolean = true;
    okForRemoteSystem: boolean = true;

    density: number[] = Array(3).fill(0);

    macos: number[] = Array(MAX_MACROS).fill(0);
}

function createTheme() {
    const theme = new TerrainTheme();

    theme.minSize = 32;
    theme.maxSize = 36;
    theme.sizeOk = MAP_GEN_ENUM.SECTOR_SIZE.ALL_SIZE;

    return theme;
}

const themes: TerrainTheme[] = [createTheme()];

export class BT_MAP_GEN {
    themes: TerrainTheme[] = Array(MAX_THEMES)
        .fill(0)
        .map(() => new TerrainTheme());
}
