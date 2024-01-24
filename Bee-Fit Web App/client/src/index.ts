import Phaser from "phaser";
import "./styles/index.css";
import MainScene from "./scenes/MainScene";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";

const config: Phaser.Types.Core.GameConfig = {
   mode: Phaser.AUTO,
   // width: 600,
   // height: 800,
   // pixelArt: false,
   autoFocus: true,
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
   },
   scene: [LoadingScene, MainScene, GameScene],
   parent: "game-root",
};

const game = new Phaser.Game(config);
(window as any).game = game;

window.addEventListener("resize", () => {
   location.reload();
});
