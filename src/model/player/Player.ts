import System from "../System";
import Building from "../../entity/Building";

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

    protected constructor(index: number, system: System) {
        this.index = index;
        this.system = system;
    }
}
