import { ArwesThemeProvider, Button, StylesBaseline, Text } from "@arwes/core";
import "../app.scss";
import { route } from "preact-router";
import { PageRoutes } from "./routes";
import { isElectron } from "../utils/helper";
import { useRef } from "preact/hooks";
import { useRescale } from "../utils/custom.hooks";

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

export default function Root({ path: string }) {
    const gotoGame = (event) => route(PageRoutes.GAME, true);
    const gotoLobby = (event) => route(PageRoutes.LOBBY, true);
    const goToEditor = (event) => route(PageRoutes.EDITOR, true);
    const gotoPathfinding = (event) => route(PageRoutes.PATHFINDING_TEST, true);
    const gotoPathfinding2 = (event) => route(PageRoutes.PATHFINDING2_TEST, true);

    const aRef = useRef<HTMLDivElement>(null);
    useRescale(aRef, 0.85);

    return (
        <div className="grid place-content-center h-100">
            <ArwesThemeProvider>
                <StylesBaseline
                    styles={{
                        body: { fontFamily: FONT_FAMILY_ROOT },
                    }}
                />
                <div ref={aRef}>
                    <div className="mb-4">
                        <Text as={"h1"} className="mb-0 unselectable">
                            Conquest: Frontier Wars
                        </Text>
                        <div className={"flex justify-center unselectable"}>
                            <Text as={"h6"}>- Demake - </Text>
                        </div>
                        {isElectron() && (
                            <div className={"flex justify-center"}>
                                <Text as={"small"}>Electron</Text>
                            </div>
                        )}
                    </div>

                    <div className={"flex flex-col items-center"}>
                        <Button className="w-40" animator={{ animate: true }} onClick={gotoGame}>
                            <Text>Game</Text>
                        </Button>
                        <Button animator={{ animate: true }} className="w-40" onClick={goToEditor}>
                            <Text>Editor</Text>
                        </Button>
                        <Button animator={{ animate: true }} className="w-40" onClick={gotoLobby}>
                            <Text>Lobby</Text>
                        </Button>
                        <Button animator={{ animate: true }} className="w-40" onClick={gotoPathfinding}>
                            <Text>Pathfinding</Text>
                        </Button>
                        <Button animator={{ animate: true }} className="w-40" onClick={gotoPathfinding2}>
                            <Text>Pathfinding2</Text>
                        </Button>
                    </div>
                </div>
            </ArwesThemeProvider>
        </div>
    );
}
