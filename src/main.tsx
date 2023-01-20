import "preact/debug"
import {render} from "preact";
import Router from "preact-router";

import Editor from "./pages/Editor";
import Game from "./pages/Game";
import Root from "./pages/Root";

import Lobby from "./pages/Lobby";
import {PageRoutes} from "./pages/routes";

import "./style.scss";
render(
    <Router>
        <Root path={PageRoutes.ROOT} />
        <Editor path={PageRoutes.EDITOR} />
        <Game path={PageRoutes.GAME} />
        <Lobby path={PageRoutes.LOBBY} />
    </Router>,
    document.getElementById("app") as HTMLElement
);
