import "preact/debug";
import { render } from "preact";
import Router, {Route} from "preact-router";
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
        <Route component={Root} path={PageRoutes.ROOT} />
        <Route component={Editor} path={PageRoutes.EDITOR} />
        <Route component={Game} path={PageRoutes.GAME} />
        <Route component={Lobby} path={PageRoutes.LOBBY} />
        <Route component={PathFindingTest} path={PageRoutes.PATHFINDING_TEST} />
        <Route component={PathFindingTest2} path={PageRoutes.PATHFINDING2_TEST} />
    </Router>,
    document.getElementById("app") as HTMLElement
);
