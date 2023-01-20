import {CQGAMETYPES} from "./Base/DCQGame";
import RANDOM_TEMPLATE = CQGAMETYPES.RANDOM_TEMPLATE;
import {FullCQGame} from "./Base/CQGame";
import {MapGen} from "./MapGen/MapGen";
import MAPSIZE = CQGAMETYPES.MAPSIZE;
import TERRAIN = CQGAMETYPES.TERRAIN;


function generateMap() {
    const fullGame = new FullCQGame(RANDOM_TEMPLATE.TEMPLATE_RANDOM, 4, MAPSIZE.SMALL_MAP, TERRAIN.LIGHT_TERRAIN);
    fullGame.numSystems = 16;
    const mapGen = new MapGen()
    const map = mapGen.GenerateMap(fullGame);
}
