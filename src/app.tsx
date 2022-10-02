import {useState} from "preact/hooks";
import {invoke} from "@tauri-apps/api/tauri";
import {Event, listen} from "@tauri-apps/api/event";
import {ArwesThemeProvider, Button, StylesBaseline, Text} from "@arwes/core"
import "./app.scss";
import {route} from "preact-router";
import {exit} from "@tauri-apps/api/process";

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
        <div className="grid place-content-center h-100 scale-2">
            <ArwesThemeProvider>
                <StylesBaseline styles={{
                    body: {fontFamily: FONT_FAMILY_ROOT}
                }}/>
                <div class="mb-4">
                    <Text as={"h1"} className="mb-0">Conquest: Frontier Wars</Text>
                    <div class={"flex justify-center"}>
                        <Text as={"h6"}>- Demake - </Text>
                    </div>
                </div>

                <div class={"flex flex-col items-center"}>
                        <Button
                            className="w-40"
                            animator={{animate: true}}
                            onClick={onClick}
                        >
                            <Text>Host Game</Text>
                        </Button>
                        <Button
                            animator={{animate: true}}
                            onClick={sendMessage}
                            className="w-40"
                        >
                            <Text>Join Game</Text>
                        </Button>
                        <Button
                            animator={{animate: true}}
                            onClick={() => exit(0)}
                            className="w-40"
                        >
                            <Text>Exit</Text>
                        </Button>

                </div>

            </ArwesThemeProvider>
        </div>
    );
}
