import Phaser from "phaser";
import {SHARED_CONFIG} from "../model/config";
import {SceneRegistry} from "./SceneRegistry";
import {guiVisible} from "../game";

export default class TestScene extends Phaser.Scene {
    private config: typeof SHARED_CONFIG;

    constructor() {
        super(SceneRegistry.TEST);
        this.config = SHARED_CONFIG;
    }

    create() {
        const graphics = this.add.graphics()
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 32; j++) {
                this.add.rectangle(40 + (i * 20), 40 + (j * 20), 20, 20, 0xa1a1a1).setOrigin(0, 0);
                const r1 = this.add.rectangle(40 + (i * 20), 40 + (j * 20), 20, 20, 0xa1a1a1).setOrigin(0, 0);
                r1.setStrokeStyle(1, 0xff0000);
            }
        }
        guiVisible.value = true;
    }

    update(time: number, delta: number) {

    }


}
