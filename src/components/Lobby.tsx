import {Component, ComponentChild, h, RenderableProps} from "preact";
import {ArwesThemeProvider, Button, FrameHexagon, StylesBaseline, Table, Text} from "@arwes/core";
import PlayerControl from "./PlayerControl";

interface LobbyState {

}

interface LobbyProps {

}

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';
const headers = [
    { id: 'a', data: 'Header 1' },
    { id: 'b', data: 'Header 2' },
    { id: 'c', data: 'Header 3' },
    { id: 'd', data: 'Header 4' },
    { id: 'e', data: 'Header 5' }
];
const dataset = Array(8).fill(0).map((_, index) => ({
    id: index,
    columns: [
        { id: 'p', data: 1 },
        { id: 'q', data: 2 },
        { id: 'r', data: 2 },
        { id: 's', data: 2 },
        { id: 't', data: 2 }
    ]
}));
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

                        <div className="mb-4 control-points">
                            <Text as={"h1"} className="mb-0">
                                Quick battle
                            </Text>
                            <div className={"flex justify-center"}>
                                <Text as={"h6"}>- Demake - </Text>
                            </div>
                        </div>

                        <div className={"flex flex-col items-center chat"}>
                            <Button className="w-40" animator={{animate: true}}>
                                <Text>Host Game</Text>
                            </Button>
                            <Button animator={{animate: true}} className="w-40">
                                <Text>Join Game</Text>
                            </Button>
                            <Button animator={{animate: true}} className="w-40">
                                <Text>Lobby</Text>
                            </Button>

                            <div>
                                <input type="range" id="test5" min="100" max="300" step="50"/>
                            </div>

                        </div>

                        {/*<div className={"player-selection"}>*/}
                        {/*    <Table*/}
                        {/*        animator={{ animate: false }}*/}
                        {/*        headers={headers}*/}
                        {/*        dataset={dataset}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className={"player-selection"}>
                            {Array(8).fill(1).map(_ => <PlayerControl/>)}
                        </div>
                    </div>
                </FrameHexagon>

            </ArwesThemeProvider>
        </div>;
    }

}