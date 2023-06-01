import GameScene from "../scenes/GameScene";
import { UIScene } from "../scenes/UiScene.ts";

export default class System {
    public gameScene: GameScene;
    public uiScene: UIScene;

    constructor(gameScene: GameScene, uiScene: UIScene) {
        this.gameScene = gameScene;
        this.uiScene = uiScene;
    }
}
