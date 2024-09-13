import Phaser from "phaser";

export default class Zombie extends Phaser.Physics.Arcade.Sprite {
  speed = 0;
  isBiting = false;

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setActive(true);
    this.setVisible(true);
    this.setFlipX(true);

    // Play the animation (assuming it's already created)
    this.play("zombie-idle");
  }

  update(time) {
    this.setVelocityX(this.speed);
    if (this.getBounds().x <= 0) {
      this.die();
    }
  }

  stop() {
    this.isBiting = false;
    this.speed = 0;
    this.play("zombie-idle", true);
  }

  walk() {
    this.isBiting = false;
    this.speed = -25;
    this.play("zombie-walk", true);
  }

  bite() {
    this.isBiting = true;
    this.speed = 0;
    this.play("zombie-bite", true);
  }

  die() {
    this.stop();
    this.destroy();
  }
}
