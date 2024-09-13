import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(0.25);
  }

  update() {
    if (this.x >= this.scene.game.config.width) {
      this.die();
    }
  }

  fire(x, y, speed) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(speed);
  }

  die() {
    this.destroy();
  }
}
