import {Component, ComponentChild, RenderableProps} from "preact";
import {ArwesThemeProvider, StylesBaseline, Text, FrameLines} from "@arwes/core";
import LobbyFooter from "./LobbyFooter";
import LobbySettings from "./LobbySettings";
import LobbyControl from "./LobbyControl";
import LobbyChat from "./LobbyChat";
import LobbyPlayers from "./LobbyPlayers";

interface LobbyState {

}

interface LobbyProps {

}

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';

export default class Lobby extends Component<LobbyProps, LobbyState> {
    render(props: RenderableProps<LobbyProps> | undefined, state: Readonly<LobbyState> | undefined, context: any): ComponentChild {
        return <div className={"grid place-content-center h-100"}>
            <ArwesThemeProvider>
                <StylesBaseline
                    styles={{
                        body: {fontFamily: FONT_FAMILY_ROOT},
                    }}
                />
                <FrameLines
                    animator={{
                        animate: true
                    }}
                    hideShapes
                >
                    <div className={"lobby-grid"}>
                        <div className="mb-4 header flex justify-center">
                            <Text as={"h1"} className="mb-0">
                                Quick battle
                            </Text>
                        </div>
                        <LobbyChat/>
                        <LobbyControl/>
                        <LobbyPlayers />
                        <LobbySettings/>
                        <LobbyFooter/>
                    </div>
                </FrameLines>

            </ArwesThemeProvider>
        </div>;
    }

}
