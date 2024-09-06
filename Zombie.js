import Phaser from "phaser";

export default class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(true);
    this.setVisible(true);
    this.setFlipX(true);

    // Play the animation (assuming it's already created)
    this.play("zombie-walk");
  }

  die() {
    this.destroy();
  }

  update(time) {
    this.setVelocityX(-25);
    if (this.getBounds().x <= 0) {
      this.die();
    }
  }
}
