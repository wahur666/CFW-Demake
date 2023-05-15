import "preact/debug";
import { render } from "preact";
import Router from "preact-router";
import { createHashHistory } from "history";

import Editor from "./pages/Editor";
import Game from "./pages/Game";
import Root from "./pages/Root";

import Lobby from "./pages/Lobby";
import { PageRoutes } from "./pages/routes";

import "./style.scss";
import PathFindingTest from "./pages/PathFindingTest";
import PathFindingTest2 from "./pages/PathFindingTest2";
render(
    // @ts-ignore
    <Router history={createHashHistory()}>
        <Root path={PageRoutes.ROOT} />
        <Editor path={PageRoutes.EDITOR} />
        <Game path={PageRoutes.GAME} />
        <Lobby path={PageRoutes.LOBBY} />
        <PathFindingTest path={PageRoutes.PATHFINDING_TEST} />
        <PathFindingTest2 path={PageRoutes.PATHFINDING2_TEST} />
    </Router>,
    document.getElementById("app") as HTMLElement
);
