import "preact/debug"
import {h, render} from "preact";
import Game from "./game";
import "./style.scss";
import Router from "preact-router";
import {App} from "./app";
import {FullCQGame} from "./model/Base/CQGame";
import {CQGAMETYPES} from "./model/Base/DCQGame";
import RANDOM_TEMPLATE = CQGAMETYPES.RANDOM_TEMPLATE;
import MAPSIZE = CQGAMETYPES.MAPSIZE;
import TERRAIN = CQGAMETYPES.TERRAIN;
import {MapGen} from "./model/MapGen/MapGen";
import Lobby from "./components/Lobby";
// const fullGame = new FullCQGame(RANDOM_TEMPLATE.TEMPLATE_RANDOM, 4, MAPSIZE.SMALL_MAP, TERRAIN.LIGHT_TERRAIN);
// fullGame.numSystems = 16;
// const mapGen = new MapGen()
// const map = mapGen.GenerateMap(fullGame);


render(
    <Router>
        <App path={"/"} />
        <Game path={"/game"} />
        <Lobby path={"/lobby"} />
    </Router>,
    document.getElementById("app") as HTMLElement
);
