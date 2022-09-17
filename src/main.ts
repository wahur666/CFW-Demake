import "./style.css";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";
import {SHARED_CONFIG} from "./model/config";
import ScaleModes = Phaser.Scale.ScaleModes;


const config: Phaser.Types.Core.GameConfig = {
    ...SHARED_CONFIG,
    type: Phaser.WEBGL,
    scene: [PreloadScene, GameScene],
    scale: {
        mode: ScaleModes.RESIZE
    },
    render: {
        pixelArt: false,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: SHARED_CONFIG.debug.arcade
        }
    },
    canvas: document.getElementById("cv1") as HTMLCanvasElement,
};

let game: Phaser.Game;
window.addEventListener("load", ev => {
    game = new Phaser.Game(config);
});

window.addEventListener("beforeunload", ev => {
    game.destroy(true, false);
});
