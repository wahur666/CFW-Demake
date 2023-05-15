import { Images } from "../scenes/PreloadScene";
import { GameNode } from "../model/GameMap/GameMap";
import Vector2 = Phaser.Math.Vector2;
import { Signal, computed, signal } from "@preact/signals";
import { GAME_SCALE, nodeToPos } from "../helpers/utils";
import GameScene from "../scenes/GameScene";

export enum TravelState {
    NOT_TRAVELING,
    PREPARE_FOR_TRAVELING,
    TRAVELING,
    END_TRAVELING,
}

export default abstract class Unit extends Phaser.Physics.Arcade.Sprite {
    traveling: TravelState = TravelState.NOT_TRAVELING;
    private selected = false;
    travelTime = 1000;
    currentTravelTime = 0;
    selectedGraphics: Phaser.GameObjects.Graphics;
    // navPoints: Vector2[] = [];
    private navNodes: Signal<GameNode[]> = signal<GameNode[]>([]);
    targetPos: Vector2 | null = null;
    navPoints = computed(() => this.navNodes.value.map(nodeToPos));
    gameScene: GameScene;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: Images) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.2 * GAME_SCALE);
        this.selectedGraphics = this.scene.add.graphics();
        this.gameScene = scene as GameScene;
    }

    get pos(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    get isSelected(): boolean {
        return this.selected;
    }

    get isMoving(): boolean {
        return this.body!.velocity.length() > 0;
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
        this.selectedGraphics.clear();
    }

    setNav(navNodes: GameNode[]) {
        this.navNodes.value = navNodes;
        if (this.navNodes.value.length > 0 && this.navNodes.value[0]) {
            this.targetPos = this.navNodes.value[0].position.clone().multiply({ x: 20, y: 20 }).add({ x: 10, y: 10 });
        }
    }

    stopNav() {
        if (this.gameScene.checkIfNavEnd(this)) {
            this.navNodes.value = [];
            this.body?.stop();
        }
    }

    drawPath() {
        this.selectedGraphics.clear();
        this.selectedGraphics.lineStyle(2, 0x00ff00, 1);
        this.selectedGraphics.strokeCircle(this.x, this.y, (this.width * 1.2 * this.scale) / 2);
        if (this.navPoints.value.length > 0) {
            this.selectedGraphics.lineBetween(this.x, this.y, this.navPoints.value[0].x, this.navPoints.value[0].y);
            for (let i = 0; i < this.navPoints.value.length - 1; i++) {
                this.selectedGraphics.lineBetween(
                    this.navPoints.value[i].x,
                    this.navPoints.value[i].y,
                    this.navPoints.value[i + 1].x,
                    this.navPoints.value[i + 1].y
                );
            }
            const point = this.navPoints.value[this.navPoints.value.length - 1];
            if (point) {
                this.selectedGraphics.fillStyle(0x0fff22, 1);
                this.selectedGraphics.fillRect(point.x - 10, point.y - 10, 20, 20);
            }
        }
    }

    moveToTarget(target: Vector2, speed: number) {
        this.setRotation(Math.atan2(-this.y + target.y, -this.x + target.x) + Math.PI / 2);
        this.scene.physics.moveTo(this, target.x, target.y, speed);
    }

    updateNotTraveling(delta: number) {
        if (this.selected) {
            this.drawPath();
        }
        if (this.navNodes.value.length > 0) {
            const target = this.navPoints.value[0];
            if (this.pos.distance(target) < 5) {
                this.navNodes.value = this.navNodes.value.slice(1);
                if (this.navNodes.value.length === 0) {
                    this.stopNav();
                } else if (this.navNodes.value.length > 1 && this.navNodes.value[0].hasWormhole && this.navNodes.value[1].hasWormhole) {
                    this.traveling = TravelState.PREPARE_FOR_TRAVELING;
                }
            } else {
                this.moveToTarget(target, 50);
            }
        }
    }

    updatePrepareForTraveling(delta: number) {
        // Wait until everybody is read for jump
        this.selectedGraphics.clear();
        this.selectedGraphics.lineStyle(2, 0x00ff00, 1);
        this.selectedGraphics.lineBetween(this.x, this.y, this.navPoints.value[0].x, this.navPoints.value[0].y);
        this.body?.stop();
        const target = this.navPoints.value[0];
        this.setRotation(Math.atan2(-this.y + target.y, -this.x + target.x) + Math.PI / 2);
        if (this.currentTravelTime < this.travelTime) {
            this.currentTravelTime += delta;
            return;
        }
        if (this.pos.distance(target) < 5) {
            this.navNodes.value = this.navNodes.value.slice(1);
        } else {
            this.moveToTarget(target, 200);
            return;
        }
        this.currentTravelTime = 0;
        this.traveling = TravelState.TRAVELING;
    }

    updateTraveling(delta: number) {
        this.visible = false;
        if (this.currentTravelTime < this.travelTime) {
            this.currentTravelTime += delta;
            return;
        }
        const target = this.navPoints.value[0];
        this.x = target.x;
        this.y = target.y;
        this.currentTravelTime = 0;
        this.navNodes.value = this.navNodes.value.slice(1);
        this.traveling = TravelState.END_TRAVELING;
    }

    updateEndTraveling(delta: number) {
        this.visible = true;
        // speed up ship until its reached the next position
        const target = this.navPoints.value[0];
        if (this.pos.distance(target) < 5) {
            this.navNodes.value = this.navNodes.value.slice(1);
        } else {
            this.moveToTarget(target, 200);
            return;
        }
        if (this.navNodes.value.length === 0) {
            this.stopNav();
        }
        this.traveling = TravelState.NOT_TRAVELING;
    }

    update(delta: number) {
        switch (this.traveling) {
            case TravelState.PREPARE_FOR_TRAVELING:
                this.updatePrepareForTraveling(delta);
                break;
            case TravelState.TRAVELING:
                this.updateTraveling(delta);
                break;
            case TravelState.END_TRAVELING:
                this.updateEndTraveling(delta);
                break;
            case TravelState.NOT_TRAVELING:
            default:
                this.updateNotTraveling(delta);
        }
    }
}
