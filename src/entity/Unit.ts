import {Images} from "../scenes/PreloadScene";
import Vector2 = Phaser.Math.Vector2;

export default class Unit extends Phaser.Physics.Arcade.Sprite {
    travelling = false;
    selected = false;
    graphics: Phaser.GameObjects.Graphics;
    navPoints: Vector2[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Images.SHIP);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.2);
        this.graphics = this.scene.add.graphics()
    }
    get pos(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    setNav(points: Vector2[]) {
        this.navPoints = points;
    }

    stopNav() {
        this.navPoints = [];
        this.body.stop();
    }
    c = (a: number) => a * 20;

    update(delta: number) {
        this.graphics.clear();
        if (this.travelling) {
            this.visible = false;
            return;
        } else {
            this.visible = true;
        }
        if (this.selected) {
            this.graphics.lineStyle(2, 0x00ff00, 1);
            this.graphics.strokeCircle(this.x, this.y, this.width * 1.2 * this.scale / 2);
        }
        if (this.navPoints.length > 0) {
            const target = this.navPoints[0];
            if(this.selected) {
                this.graphics.lineBetween(this.x, this.y, this.navPoints[0].x, this.navPoints[0].y)
                for (let i = 0; i < this.navPoints.length - 1; i++) {
                    this.graphics.lineBetween(this.navPoints[i].x, this.navPoints[i].y, this.navPoints[i+1].x, this.navPoints[i+1].y)
                }
            }
            if (this.pos.distance(target) < 5) {
                this.navPoints.shift();
                if(this.navPoints.length === 0) {
                    this.stopNav();
                }
            } else {
                this.setRotation(Math.atan2(-this.y + target.y, -this.x + target.x) + Math.PI / 2);
                this.scene.physics.moveTo(this, target.x, target.y, 50);
            }
            if (this.navPoints.length > 0 && this.selected) {
                const point = this.navPoints[this.navPoints.length - 1];
                if (point) {
                    this.graphics.fillStyle(0x0fff22, 1);
                    this.graphics.fillRect(point.x - 10, point.y - 10, 20, 20);
                }
            }
        }
    }

}
