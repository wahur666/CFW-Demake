import Phaser from "phaser";
import { signal } from "@preact/signals";

import { SHARED_CONFIG } from "../model/config";
import EditorScene from "../scenes/EditorScene";
import PreloadScene2 from "../scenes/PreloadScene2";
import EditorButton from "../components/Editor/EditorButton";
import { SectorObjectMasks } from "../entity/SectorObject";

import ScaleModes = Phaser.Scale.ScaleModes;

import "../style.scss";
import { route } from "preact-router";
import { PageRoutes } from "./routes";
import { useEffect, useRef } from "preact/hooks";

export const guiVisible = signal<boolean>(false);
export const objectMode = signal<SectorObjectMasks>(SectorObjectMasks.OrePatch);

const config: Phaser.Types.Core.GameConfig & typeof SHARED_CONFIG = {
    ...SHARED_CONFIG,
    type: Phaser.WEBGL,
    scene: [PreloadScene2, EditorScene],
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

export default function Editor() {
    let game: Phaser.Game;
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        game = new Phaser.Game({ ...config, canvas: canvas.current! });
        return () => game.destroy(true, false);
    }, []);

    return (
        <>
            {guiVisible.value && (
                <div className="absolute-zero disable-pointer-event flex flex-row-reverse ">
                    <div className="flex flex-col items-center justify-center">
                        <EditorButton cb={() => console.log("yeet")} name={"Habitable Planet"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Rocky Planet"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Gas Planet"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Swamp Planet"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Wormhole"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Gas"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Ore"} />
                        <EditorButton cb={() => console.log("yeet")} name={"Generate string"} />
                        <EditorButton cb={() => route(PageRoutes.ROOT)} name={"Back!"} />
                        {/*<EditorArea/>*/}
                    </div>
                </div>
            )}
            <canvas id={"cv1"} ref={canvas} />
        </>
    );
}
