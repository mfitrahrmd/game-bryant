import Phaser from "phaser";
import Zombie from "./Zombie";

export default class MainScene extends Phaser.Scene {
  init() {
    this.cursor = undefined;
    this.soldier = undefined;
    this.zombies = undefined;
  }
  preload() {
    this.load.spritesheet("idle", "images/soldier/Idle.png", {
      frameWidth: 896 / 7,
      frameHeight: 128,
    });
    this.load.spritesheet("run", "images/soldier/Run.png", {
      frameWidth: 1024 / 8,
      frameHeight: 128,
    });
    this.load.spritesheet("shoot", "images/soldier/Shot_2.png", {
      frameWidth: 512 / 4,
      frameHeight: 128,
    });
    this.load.spritesheet("zombie-idle", "images/zombie/man/Idle.png", {
      frameWidth: 768 / 8,
      frameHeight: 96,
    });
    this.load.spritesheet("zombie-walk", "images/zombie/man/Walk.png", {
      frameWidth: 768 / 8,
      frameHeight: 96,
    });
  }
  create() {
    this.cursor = this.input.keyboard.createCursorKeys();

    this.soldier = this.physics.add.sprite(100, 100, "idle");
    this.soldier.setCollideWorldBounds(true);

    this.soldierAnimation();

    this.zombieAnimation();

    this.zombies = this.physics.add.group({
      classType: Zombie,
      maxSize: 10,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true,
    });
  }
  update(time) {
    this.soldierAction();
  }

  spawnZombie() {
    console.log("spawn");
    // const zombie = new Zombie(this, this.game.config.width, 0, "zombie-idle");
    const zombie = this.zombies.get(
      this.game.config.width,
      this.game.config.height,
      "zombie-idle"
    );
    // zombie.setCollideWorldBounds(true);
    // this.physics.add.existing(zombie);
    // zombie.setVelocityX(50);
    // zombie.spawn(0, 0);
  }

  zombieAnimation() {
    this.anims.create({
      key: "zombie-walk", //--->nama animasi
      frames: this.anims.generateFrameNumbers("zombie-walk", {
        start: 0,
        end: 7,
      }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
  }

  soldierAnimation() {
    this.anims.create({
      key: "run", //--->nama animasi
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    this.anims.create({
      key: "idle", //--->nama animasi
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 6 }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    this.anims.create({
      key: "shoot", //--->nama animasi
      frames: this.anims.generateFrameNumbers("shoot", { start: 0, end: 3 }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
  }

  soldierAction() {
    if (this.cursor.space.isDown) {
      this.soldier.setVelocityX(0);
      this.soldier.anims.play("shoot", true);
    } else if (this.cursor.left.isDown) {
      this.soldier.setVelocityX(-100);
      this.soldier.setFlipX(true).anims.play("run", true);
    } else if (this.cursor.right.isDown) {
      this.soldier.setVelocityX(100);
      this.soldier.setFlipX(false).anims.play("run", true);
    } else {
      this.soldier.setVelocityX(0);
      this.soldier.anims.play("idle", true);
    }
  }
}
