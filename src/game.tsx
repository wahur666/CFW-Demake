import GameScene from "./scenes/GameScene";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import "./style.css";
import {SHARED_CONFIG} from "./model/config";
import {Component, ComponentChild, createRef, RenderableProps} from "preact";
import ScaleModes = Phaser.Scale.ScaleModes;

interface IProps {
}

interface IState {
}

export default class Game extends Component<IProps, IState> {

    game: Phaser.Game;

    canvas = createRef<HTMLCanvasElement>()

    config: Phaser.Types.Core.GameConfig = {
        ...SHARED_CONFIG,
        type: Phaser.WEBGL,
        scene: [PreloadScene, GameScene],
        scale: {
            mode: ScaleModes.RESIZE
        },
        render: {
            pixelArt: true,
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: SHARED_CONFIG.debug.arcade
            }
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

    render(props: RenderableProps<IProps> | undefined, state: Readonly<IState> | undefined, context: any): ComponentChild {
        return <canvas id={"cv1"} ref={this.canvas}/>;
    }

}