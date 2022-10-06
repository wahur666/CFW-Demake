import { render } from "preact";
import Game from "./game";
import "./style.scss";
import Router from "preact-router";
import { App } from "./app";

render(
    <Router>
        <App path={"/"} />
        <Game path={"/game"} />
    </Router>,
    document.getElementById("app") as HTMLElement
);
