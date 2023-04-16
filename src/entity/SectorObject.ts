export enum SectorObjectMasks {
    OutOfBoundSpace = -1,
    FreeSpace,
    HabitablePlanet,
    MoonPlanet,
    GasPlanet,
    SwampPlanet,
    Wormhole,
    OrePatch,
    GasPatch,
    Debris,
}

export class SectorObject {
    mask: SectorObjectMasks;
    size: number;
    color: number;

    constructor(mask: number, size: number, color: number) {
        this.mask = mask;
        this.size = size;
        this.color = color;
    }
}

export class HabitablePlanetObject extends SectorObject {
    constructor() {
        super(SectorObjectMasks.HabitablePlanet, 2, 0x0000ff);
    }
}

export class GasPatchObject extends SectorObject {
    constructor() {
        super(SectorObjectMasks.GasPatch, 1, 0x00ff00);
    }
}
