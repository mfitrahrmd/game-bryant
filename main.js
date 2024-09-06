import Phaser from "phaser";
import MainScene from "./MainScene";

export default new Phaser.Game({
  mode: "debug",
  type: Phaser.AUTO,
  parent: "app",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 200,
      },
    },
  },
  width: 800,
  height: 400,
  scene: [MainScene],
});
