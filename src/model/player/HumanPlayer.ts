import System from "../System";
import Player from "./Player.ts";


export default class HumanPlayer extends Player {

    constructor(index: number, system: System) {
        super(index, system);
        this.setupHandlers();
    }

    setupHandlers() {}
}
