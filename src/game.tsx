import { useEffect } from "preact/hooks"
import GameScene from "./scenes/GameScene";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import "./style.css";
import {SHARED_CONFIG} from "./model/config";

const config: Phaser.Types.Core.GameConfig = {
    ...SHARED_CONFIG,
    type: Phaser.WEBGL,
    scene: [PreloadScene, GameScene],

    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: SHARED_CONFIG.debug.arcade
        }
    },
    canvas: document.getElementById("cv1") as HTMLCanvasElement,
};

export default function Game<FN>() {
    useEffect(() => {
        let game: Phaser.Game;
        game = new Phaser.Game(config);
        return () => {
            game.destroy(true, false);
        }

    }, []);
    return <></>
}