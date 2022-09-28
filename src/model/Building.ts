import GameScene from "../scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import Planet from "./Planet";

const d2r = Phaser.Math.DegToRad;

export default class Building extends Phaser.GameObjects.Sprite {

    radiusVisible = false;
    graphics: Phaser.GameObjects.Graphics;
    currentRadiusRotation = 0
    radius = 130;
    unBound = false;
    imageScale = 0.3;
    place = 1;
    wide = 2;
    baseAngle = d2r(30)

    constructor(scene: GameScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.graphics = this.scene.add.graphics();
        this.scene.add.existing(this);
        this.setScale(this.imageScale);
    }

    update(delta: number) {
        this.graphics.clear();
        this.graphics.lineStyle(7, 0xFF0000, 1);
        this.currentRadiusRotation = (this.currentRadiusRotation + d2r(50) * delta / 1000) % Phaser.Math.PI2;
        if (this.radiusVisible) {
            this.graphics.strokeCircle(this.x, this.y, this.radius);
            const start = new Vector2(this.x + Math.cos(this.currentRadiusRotation) * this.radius,
                this.y + Math.sin(this.currentRadiusRotation) * this.radius)
            const end = new Vector2(this.x - Math.cos(this.currentRadiusRotation) * this.radius,
                this.y - Math.sin(this.currentRadiusRotation) * this.radius);
            this.graphics.lineBetween(start.x, start.y, end.x, end.y)
        }
        this.graphics.fillRect(this.x - this.width / 2 * this.imageScale, this.y - this.height / 2 * this.imageScale,
            this.width * this.imageScale, this.height * this.imageScale);

        if (this.unBound) {
            const startAngle = Math.PI / 2
            const halfRot = this.wide / 2 * this.baseAngle;
            this.graphics.beginPath()
            this.graphics.arc(this.x - Math.cos(startAngle) * this.radius, this.y - Math.sin(startAngle) * this.radius, this.radius, startAngle - halfRot, startAngle + halfRot)
            this.graphics.stroke()
        } else {
            const wideAngle = this.baseAngle;
            const startAngle = this.place * wideAngle + Math.PI / 12 - (this.wide % 2 === 0 ? wideAngle / 2 : 0);
            const halfRot = wideAngle * this.wide / 2 ;
            this.graphics.beginPath()
            this.graphics.arc(this.x - Math.cos(startAngle) * this.radius, this.y - Math.sin(startAngle) * this.radius, this.radius, startAngle - halfRot, startAngle + halfRot);
            this.graphics.stroke()

        }

    }

    destroy(fromScene?: boolean) {
        this.graphics.clear();
        this.graphics.destroy(fromScene);
        super.destroy(fromScene);
    }

    calculatePlace(planet: Planet, x: number, y: number) {
        const angle = Math.atan2(y - planet.y, x - planet.x);
        const a = Phaser.Math.RadToDeg(angle);
        const b = a > 0 ? a : 360 + a;
        this.place = (b + (this.wide % 2 === 0 ? 15 : 0) ) / 30 | 0;
        const diff = this.wide % 2 === 0 ? 0 : this.baseAngle / 2;
        this.setPosition(planet.x + Math.cos(this.place * this.baseAngle + diff) * planet.radius, planet.y + Math.sin(this.place * this.baseAngle + diff) * planet.radius)
    }
}