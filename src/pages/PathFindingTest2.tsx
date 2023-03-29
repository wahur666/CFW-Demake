import Phaser from "phaser";
import {Component, ComponentChild, createRef, RenderableProps} from "preact";

import {SHARED_CONFIG} from "../model/config";
import ScaleModes = Phaser.Scale.ScaleModes;
import PathfindingTestScene2 from "../scenes/PathfindingTestScene2";

interface IProps {}
interface IState {}
export default class PathFindingTest2 extends Component<IProps, IState>{

    game: Phaser.Game;

    canvas = createRef<HTMLCanvasElement>();

    config: Phaser.Types.Core.GameConfig & typeof SHARED_CONFIG = {
        ...SHARED_CONFIG,
        type: Phaser.WEBGL,
        scene: [PathfindingTestScene2],
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

    render(props?: RenderableProps<IProps>, state?: Readonly<IState>): ComponentChild {
        return <canvas id={"cv1"} ref={this.canvas} />;
    }

}
