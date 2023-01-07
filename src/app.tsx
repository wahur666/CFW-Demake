import { ArwesThemeProvider, Button, StylesBaseline, Text } from "@arwes/core";
import "./app.scss";
import { route } from "preact-router";
const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

export function App({ path: string }) {
    const gotoGame = (event) => {
        console.log(event);
        route("/game", true);
    };

    const gotoLobby = (event) => {
        route("/lobby", true);
    }


    return (
        <div className="grid place-content-center h-100 scale-2">
            <ArwesThemeProvider>
                <StylesBaseline
                    styles={{
                        body: { fontFamily: FONT_FAMILY_ROOT },
                    }}
                />
                <div className="mb-4">
                    <Text as={"h1"} className="mb-0">
                        Conquest: Frontier Wars
                    </Text>
                    <div className={"flex justify-center"}>
                        <Text as={"h6"}>- Demake - </Text>
                    </div>
                </div>

                <div className={"flex flex-col items-center"}>
                    <Button className="w-40" animator={{ animate: true }} onClick={gotoGame}>
                        <Text>Host Game</Text>
                    </Button>
                    <Button animator={{ animate: true }} className="w-40">
                        <Text>Join Game</Text>
                    </Button>
                    <Button animator={{ animate: true }} className="w-40" onClick={gotoLobby}>
                        <Text>Lobby</Text>
                    </Button>

                </div>
            </ArwesThemeProvider>
        </div>
    );
}
