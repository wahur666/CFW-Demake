import {useState} from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import {invoke} from "@tauri-apps/api/tauri";
import {Event, listen} from "@tauri-apps/api/event";
import {ArwesThemeProvider, Button, StylesBaseline, Text} from "@arwes/core"
import "./app.scss";
import {route} from "preact-router";

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

function sendOutput() {
    console.log("js: js2rs: " + "yeet")
    invoke('js2rs', { message: "yeet" })
}

const unlisten = await listen('rs2js', (event: Event<string>) => {
    let a = JSON.parse(event.payload);
    console.log("js: rs2js: " + a)
})

export function App<FC>({path: string}) {

    const onClick = (event) => {
        console.log(event)
        route("/game", true);
    }

    const sendMessage = () => {
        sendOutput();
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
                <Button
                    animator={{animate: true}}
                    onClick={sendMessage}
                >
                    <Text>Invoke js2rs</Text>
                </Button>
            </ArwesThemeProvider>
        </div>
    );
}
