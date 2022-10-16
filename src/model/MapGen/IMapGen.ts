import {FullCQGame} from "../Base/CQGame";
import {IPAnim} from "../Base/InProgressAnim";


export interface IMapGen {

    GenerateMap(game: FullCQGame, seed: number, ipAnim: IPAnim);
    GetBestSystemNumber(game: FullCQGame, approxNumber: number): number;
    GetPossibleSystemNumbers(game: FullCQGame, list: number[]): number;

}
