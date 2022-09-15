import { render } from "preact";
import Game from "./game";
import "./style.css";

render(<Game />, document.getElementById("app") as HTMLElement);
