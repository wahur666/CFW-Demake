import Phaser from "phaser";
import { SHARED_CONFIG } from "../model/config";
import ScaleModes = Phaser.Scale.ScaleModes;
import PathfindingTestScene from "../scenes/PathfindingTestScene";
import { useEffect, useRef } from "preact/hooks";

const config: Phaser.Types.Core.GameConfig & typeof SHARED_CONFIG = {
    ...SHARED_CONFIG,
    type: Phaser.WEBGL,
    scene: [PathfindingTestScene],
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

export default function PathFindingTest() {
    let game: Phaser.Game;
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        game = new Phaser.Game({ ...config, canvas: canvas.current! });
        return () => game.destroy(true, false);
    }, []);

    return <canvas id={"cv1"} ref={canvas} />;
}
