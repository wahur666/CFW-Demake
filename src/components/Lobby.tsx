import {Component, ComponentChild, h, RenderableProps} from "preact";
import {ArwesThemeProvider, Button, FrameHexagon, StylesBaseline, Table, Text} from "@arwes/core";
import PlayerControl from "./PlayerControl";
import LobbyFooter from "./LobbyFooter";
import LobbySettings from "./LobbySettings";

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
                <FrameHexagon
                    animator={{
                        animate: true
                    }}
                    // lineWidth={2}
                    // squareSize={35}
                    hideShapes
                    hover
                >
                    <div className={"lobby-grid"}>

                        <div className="mb-4 header flex justify-center">
                            <Text as={"h1"} className="mb-0">
                                Quick battle
                            </Text>
                        </div>

                        <div className={"flex flex-col items-center chat"}>
                            <FrameHexagon className={"m-1 p-1"}>
                                <div style={{
                                    width: 600,
                                    height: 20,
                                }} >
                                    Aa
                                </div>
                            </FrameHexagon>
                            <FrameHexagon className={"m-1 p-1"}>
                                <div style={{
                                    width: 600,
                                    height: 120,
                                }} >
                                    Bb
                                </div>
                            </FrameHexagon>
                        </div>


                        <div className="control-points" >
                            <div className="flex flex-col h-100 items-center justify-center m-1">
                                <input type="range" id="test5" min="100" max="300" step="50"/>
                                <p>{100}</p>
                            </div>
                        </div>

                        <div className={"player-selection"}>
                            {Array(8).fill(1).map(_ => <PlayerControl/>)}
                        </div>
                        <LobbySettings/>
                        <LobbyFooter />
                    </div>
                </FrameHexagon>

            </ArwesThemeProvider>
        </div>;
    }

}
