import GameScene from "../scenes/GameScene";
import { d2r, GAME_SCALE, halfDrawWidth } from "../helpers/utils";
import Building from "./Building";
import Vector2 = Phaser.Math.Vector2;

const enum SlotStatus {
    FREE,
    OCCUPIED,
}

export default class Planet extends Phaser.GameObjects.Sprite {
    radius = Math.round((this.width * this.scale) / 2);
    graphics: Phaser.GameObjects.Graphics;
    showBuildRings = true;

    buildings: Building[] = [];

    slots: SlotStatus[] = Array(12).fill(SlotStatus.FREE);

    constructor(scene: GameScene, position: Vector2, texture: string) {
        super(scene, position.x - halfDrawWidth, position.y - halfDrawWidth, texture);
        this.scene.add.existing(this);
        this.graphics = this.scene.add.graphics();
        this.setScale(0.3 * GAME_SCALE);
        this.radius = Math.round((this.width * this.scale) / 2);

        console.log("planet radius", this.radius);
    }

    update(delta: number) {
        if (this.showBuildRings) {
            this.graphics.clear();
            this.graphics.lineStyle(5, 0x23a343, 1);
            for (let i = 0; i < 12; i++) {
                this.graphics.beginPath();
                this.graphics.arc(this.x, this.y, this.radius, d2r(i * 30 + 3), d2r(i * 30 + 27));
                this.graphics.stroke();
            }
        }
        for (const building of this.buildings) {
            building.update(delta);
        }
    }

    buildBuilding(shiftModifier: boolean, building: Building, ...slots: number[]): boolean {
        for (const slot of slots) {
            if (this.slots[slot] === SlotStatus.OCCUPIED) {
                return false;
            }
        }
        for (const slot of slots) {
            this.slots[slot] = SlotStatus.OCCUPIED;
        }
        if (shiftModifier) {
            this.buildings.push(building.clone());
        } else {
            this.buildings.push(building);
        }
        return true;
    }
}
