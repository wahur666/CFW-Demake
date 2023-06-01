import { ArwesThemeProvider, FrameLines, StylesBaseline, Text } from "@arwes/core";
import LobbyFooter from "../components/Lobby/LobbyFooter";
import LobbySettings from "../components/Lobby/LobbySettings";
import LobbyControl from "../components/Lobby/LobbyControl";
import LobbyChat from "../components/Lobby/LobbyChat";
import LobbyPlayers from "../components/Lobby/LobbyPlayers";
import { useRef } from "preact/hooks";
import { useRescale } from "../utils/custom.hooks";

/* eslint-disable-next-line */
const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

export default function Lobby() {
    const aRef = useRef<HTMLDivElement>(null);
    useRescale(aRef, 0.95);

    return (
        <div className={"grid place-content-center h-100"}>
            <ArwesThemeProvider>
                <StylesBaseline
                    styles={{
                        body: { fontFamily: FONT_FAMILY_ROOT },
                    }}
                />
                <div ref={aRef}>
                    <FrameLines
                        animator={{
                            animate: true,
                        }}
                        hideShapes
                    >
                        <div className={"lobby-grid"}>
                            <div className="mb-4 header flex justify-center">
                                <Text as={"h1"} className="mb-0">
                                    Quick battle
                                </Text>
                            </div>
                            <LobbyChat />
                            <LobbyControl />
                            <LobbyPlayers />
                            <LobbySettings />
                            <LobbyFooter />
                        </div>
                    </FrameLines>
                </div>
            </ArwesThemeProvider>
        </div>
    );
}
