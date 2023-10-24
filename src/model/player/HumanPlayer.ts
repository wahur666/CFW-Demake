import Phaser from "phaser";
import System from "../System";
import Player from "./Player.ts";
import Building from "../../entity/Building.ts";
import GameScene from "../../scenes/GameScene.ts";
import Pointer = Phaser.Input.Pointer;
import { UIScene } from "../../scenes/UiScene.ts";

export default class HumanPlayer extends Player {
    buildingShade: Building | null = null;

    shiftKey: Phaser.Input.Keyboard.Key;

    constructor(index: number, system: System) {
        super(index, system);
    }

    get scene(): GameScene {
        return this.system.gameScene;
    }

    get uiScene(): UIScene {
        return this.system.uiScene;
    }

    get input(): Phaser.Input.InputPlugin {
        return this.scene.input;
    }

    setupHandlers() {
        this.shiftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.scene.input.on("pointerup", (pointer: Pointer) => {
            if (pointer.button === 2) {
                this.buildingShade?.destroy();
                this.buildingShade = null;
            }
            if (pointer.button === 0) {
                if (this.buildingShade) {
                    this.buildingShade.buildBuilding();
                    if (!this.shiftKey.isDown) {
                        this.buildingShade = null;
                    }
                }
            }
        });

        this.uiScene.registerInOutEventHandlers(
            () => {
                if (this.buildingShade) {
                    console.log("triggereed");
                    this.buildingShade.setDisabled(true);
                }
            },
            () => {
                if (this.buildingShade) {
                    console.log("tegritidi varm");
                    this.buildingShade.setDisabled(false);
                }
            }
        );

        this.input.on("pointermove", (ev: Pointer) => {
            if (this.buildingShade) {
                const npos = this.scene.getWorldPos(ev);
                const distance = Phaser.Math.Distance.Between(npos.x, npos.y, this.scene.planet.x, this.scene.planet.y);
                if (Math.abs(distance - this.scene.planet.radius) < 20) {
                    this.buildingShade.unBound = false;
                    this.buildingShade.nearPlanet = this.scene.planet;
                    const loc = this.buildingShade.calculatePlace(this.scene.planet, npos.x, npos.y);
                    console.log("loc", loc);
                } else {
                    this.buildingShade.unBound = true;
                    this.buildingShade.nearPlanet = null;
                    this.buildingShade.setPosition(npos.x, npos.y);
                }
            }
        });

        this.input.keyboard!.on("keyup-Q", (ev) => {
            if (this.buildingShade) {
                this.buildingShade.wide = 1;
            }
        });

        this.input.keyboard!.on("keyup-W", (ev) => {
            if (this.buildingShade) {
                this.buildingShade.wide = 2;
            }
        });

        this.input.keyboard!.on("keyup-E", (ev) => {
            if (this.buildingShade) {
                this.buildingShade.wide = 3;
            }
        });

    }

    create() {
        // const pointerWorldLoc = this.scene.getWorldPos(this.scene.input.activePointer);
        // this.buildingShade = new Building(this.scene, pointerWorldLoc, Images.HQ_ICON);
        this.setupHandlers();
    }

    update(delta: number) {
        super.update(delta);
        this.buildingShade?.update(delta);
    }
}
