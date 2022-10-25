import GameScene from "./scenes/GameScene";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import "./style.scss";
import { SHARED_CONFIG } from "./model/config";
import { Component, ComponentChild, createRef, RenderableProps } from "preact";
import ScaleModes = Phaser.Scale.ScaleModes;
import TestScene from "./scenes/TestScene";
import EditorButton from "./components/EditorButton";
import EditorArea from "./components/EditorArea";
import {signal} from "@preact/signals";

interface IProps {}

interface IState {}

const guiVisible = signal<boolean>(false);

export {guiVisible}

export default class Game extends Component<IProps, IState> {
    game: Phaser.Game;

    canvas = createRef<HTMLCanvasElement>();

    config: Phaser.Types.Core.GameConfig & typeof SHARED_CONFIG = {
        ...SHARED_CONFIG,
        type: Phaser.WEBGL,
        scene: [PreloadScene, TestScene, GameScene],
        scale: {
            mode: ScaleModes.RESIZE,
        },
        backgroundColor: "#021114",
        render: {
            pixelArt: true,
        },
        disableContextMenu: true,
        physics: {
            default: "arcade",
            arcade: {
                debug: SHARED_CONFIG.debug.arcade,
            },
        },
    };

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    componentDidMount() {
        this.game = new Phaser.Game({ ...this.config, canvas: this.canvas.current! });
    }

    componentWillUnmount() {
        this.game.destroy(true, false);
    }

    render(
        props: RenderableProps<IProps> | undefined,
        state: Readonly<IState> | undefined,
        context: any
    ): ComponentChild {
        return (
            <>
                {guiVisible.value && <div className="absolute-zero disable-pointer-event flex flex-row-reverse">
                    <div className="flex flex-col items-center justify-center">
                        <EditorButton cb={() => console.log("yeet")} name={"Habitable Planet"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Rocky Planet"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Gas Planet"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Swamp Planet"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Wormhole"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Gas"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Ore"}/>
                        <EditorButton cb={() => console.log("yeet")} name={"Generate string"}/>
                        <EditorArea/>
                    </div>
                </div>}
                <canvas id={"cv1"} ref={this.canvas} />
            </>
        );
    }
}
