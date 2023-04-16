import { CQGame, CQGAMETYPES } from "./DCQGame";
import RANDOM_TEMPLATE = CQGAMETYPES.RANDOM_TEMPLATE;
import MAPSIZE = CQGAMETYPES.MAPSIZE;
import TERRAIN = CQGAMETYPES.TERRAIN;

export class FullCQGame extends CQGame {
    constructor(templateType: RANDOM_TEMPLATE, activeSlots: number, mapSize: MAPSIZE, terrain: TERRAIN) {
        super();
        this.templateType = templateType;
        this.activeSlots = activeSlots;
        this.mapSize = mapSize;
        this.terrain = terrain;
    }
}
