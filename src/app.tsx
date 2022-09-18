import {useState} from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import {invoke} from "@tauri-apps/api/tauri";
import {ArwesThemeProvider, Button, StylesBaseline, Text} from "@arwes/core"
import "./app.scss";
import {route} from "preact-router";

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

export function App<FC>({path: string}) {

    const onClick = (event) => {
        console.log(event)
        route("/game", true);
    }

    return (
        <div class="grid grid-content-center h-100 scale-2">
            <ArwesThemeProvider>
                <StylesBaseline styles={{
                    body: {fontFamily: FONT_FAMILY_ROOT}
                }}/>
                <Button
                    animator={{animate: true}}
                    onClick={onClick}
                >
                    <Text>Start Game</Text>
                </Button>
            </ArwesThemeProvider>
        </div>
    );
}
