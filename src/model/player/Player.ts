import System from "../System";
import Building from "../../entity/Building";
import Unit from "../../entity/Unit.ts";

export default abstract class Player {
    protected currentOre: number = 0;
    protected maxOre: number = 2000;

    protected currentGas: number = 0;
    protected maxGas: number = 0;

    protected currentCrew: number = 0;
    protected maxCrew: number = 0;

    protected index: number;
    protected system: System;

    protected buildings: Building[];

    public units: Unit[] = [];

    protected constructor(index: number, system: System) {
        this.index = index;
        this.system = system;
    }

    public update(delta: number) {
        this.units.forEach((unit) => unit.update(delta));
    }
}
