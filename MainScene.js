import Phaser from "phaser";
import Zombie from "./Zombie";
import Bullet from "./Bullet";

export default class MainScene extends Phaser.Scene {
  init() {
    this.cursor = undefined;
    this.healthText = undefined;
    this.scoreText = undefined;
    this.deadText = undefined;

    this.soldier = undefined;
    this.health = 100;
    this.score = 0;
    this.isDead = false;

    this.bullets = undefined;

    this.direction = "right";
    this.lastFired = 0;

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
    this.load.spritesheet("dead", "images/soldier/Dead.png", {
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
    this.load.spritesheet("zombie-bite", "images/zombie/man/Bite.png", {
      frameWidth: 1056 / 11,
      frameHeight: 96,
    });
    this.load.spritesheet("zombie-dead", "images/zombie/man/Dead.png", {
      frameWidth: 480 / 5,
      frameHeight: 96,
    });
    this.load.image("bullet", "images/bullet.png");
    this.load.image("bg", "images/city/city.png");
    this.load.audio("you-died", "sfx/you_died.mp3");
  }
  create() {
    this.cursor = this.input.keyboard.createCursorKeys();

    this.add
      .image(this.game.config.width / 2, this.game.config.height / 2 + 55, "bg")
      .setScale(0.45);
    this.soldier = this.physics.add
      .sprite(0, this.game.config.height, "idle")
      .setBodySize(25, 70)
      .setOffset(47, 60);
    this.soldier.setCollideWorldBounds(true);

    this.soldierAnimation();

    this.zombieAnimation();

    this.zombies = this.physics.add.group({
      classType: Zombie,
      maxSize: 100,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      immovable: true,
      allowGravity: false,
    });

    // soldier and zombies overlap
    this.physics.add.overlap(
      this.soldier,
      this.zombies,
      this.touchZombie,
      null,
      this
    );

    // bullets and zombies overlap
    this.physics.add.overlap(
      this.bullets,
      this.zombies,
      this.zombieShot,
      null,
      this
    );

    this.time.addEvent({
      delay: 3000,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true,
    });

    // text & UI
    this.healthText = this.add.text(0, 0, "Health : 0", {
      color: "#000000",
      backgroundColor: "#FF0000",
    });
    this.scoreText = this.add.text(0, 20, "Score : 0", {
      color: "#000000",
      backgroundColor: "#0000FF",
    });
  }
  update(time) {
    this.soldierAction(time);

    // Check if the zombies should return to walking after overlapping with the soldier
    this.zombies.getChildren().forEach((zombie) => {
      if (zombie.isBiting && this.isDead) {
        zombie.walk(); // Go back to walking if no longer overlapping
      }
    });

    this.updateText();
  }

  spawnZombie() {
    // const zombie = new Zombie(this, this.game.config.width, 0, "zombie-idle");
    const zombie = this.zombies.get(
      this.game.config.width,
      this.game.config.height,
      "zombie-idle"
    );
    if (zombie) {
      zombie.setBodySize(25, 70).setOffset(30, 27);
      zombie.walk();
    }
  }

  zombieAnimation() {
    this.anims.create({
      key: "zombie-idle", //--->nama animasi
      frames: this.anims.generateFrameNumbers("zombie-idle", {
        start: 0,
        end: 7,
      }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    this.anims.create({
      key: "zombie-walk", //--->nama animasi
      frames: this.anims.generateFrameNumbers("zombie-walk", {
        start: 0,
        end: 7,
      }), //--->frame yang digunakan
      frameRate: 12, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    this.anims.create({
      key: "zombie-bite", //--->nama animasi
      frames: this.anims.generateFrameNumbers("zombie-bite", {
        start: 0,
        end: 10,
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
    this.anims.create({
      key: "dead", //--->nama animasi
      frames: this.anims.generateFrameNumbers("dead", { start: 0, end: 3 }), //--->frame yang digunakan
      frameRate: 8, //--->kecepatan berpindah antar frame
    });
  }

  soldierAction(time) {
    if (this.isDead) {
      this.soldier.setVelocityX(0);
      if (!this.deadText) {
        this.sound.play("you-died");
        this.deadText = this.add
          .text(0, this.game.config.height / 2, "YOU DIED", {
            color: "#7C0000",
            fontSize: 32,
            fixedWidth: this.game.config.width,
            padding: {
              y: 2,
            },
            align: "center",
          })
          .setAlpha(0);
        const grd = this.deadText.context.createLinearGradient(
          0,
          0,
          0,
          this.deadText.height
        );
        grd.addColorStop(0, "rgba(0, 0, 0, 0.70)");
        grd.addColorStop(0.25, "rgba(0, 0, 0, 0.80)");
        grd.addColorStop(0.5, "rgba(0, 0, 0, 0.90)");
        grd.addColorStop(0.75, "rgba(0, 0, 0, 0.80)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0.70)");
        this.deadText.setBackgroundColor(grd);
        this.tweens.add({
          targets: this.deadText,
          duration: 500,
          ease: "Linear",
          alpha: {
            from: 0,
            to: 1,
          },
        });
        this.time.delayedCall(5000, () => {
          // Get the dimensions of the game
          const width = this.cameras.main.width;
          const height = this.cameras.main.height;

          // Create a black rectangle that covers the entire scene
          this.blackScreen = this.add.graphics();
          this.blackScreen.fillStyle(0x000000, 1); // Solid black color
          this.blackScreen.fillRect(0, 0, width, height);

          // Set its alpha to 0 to make it invisible at first
          this.blackScreen.setAlpha(0);

          // Add a tween to fade the scene to black
          this.tweens.add({
            targets: this.blackScreen, // The black screen to fade in
            alpha: { from: 0, to: 1 }, // Fade alpha from 0 to 1 (fully black)
            duration: 2000, // Duration of the fade-in (2 seconds)
            ease: "Linear", // Easing function for smooth transition
            onComplete: () => {
              console.log("Scene faded to black");
              // You can transition to another scene here if needed
              // this.scene.start('NextScene');
            },
          });
          this.time.delayedCall(2000, () => {
            this.scene.restart();
          });
        });
      }
      return;
    }

    if (this.cursor.space.isDown) {
      if (time > this.lastFired) {
        this.soldier.setVelocityX(0);
        this.soldier.anims.play("shoot", true);
        const bullet = this.bullets.get(0, 0, "bullet");
        if (bullet) {
          bullet.setBodySize(50, 50);
          if (this.direction === "right") {
            bullet.fire(this.soldier.x + 40, this.soldier.y + 16, 1000);
          }
          if (this.direction === "left") {
            bullet.fire(this.soldier.x - 40, this.soldier.y + 16, -1000);
          }
          this.lastFired = time + 300;
        }
      }
    } else if (this.cursor.left.isDown) {
      this.direction = "left";
      this.soldier.setVelocityX(-100);
      this.soldier.setFlipX(true).anims.play("run", true);
    } else if (this.cursor.right.isDown) {
      this.direction = "right";
      this.soldier.setVelocityX(100);
      this.soldier.setFlipX(false).anims.play("run", true);
    } else {
      this.soldier.setVelocityX(0);
      this.soldier.anims.play("idle", true);
    }
  }

  soldierDead() {
    this.soldier.anims.setRepeat(0).play("dead");
    this.isDead = true;
  }

  updateText() {
    this.healthText.setText(`Health : ${this.health}`);
    this.scoreText.setText(`Score : ${this.score}`);
    if (this.health > 80) {
      this.healthText.setBackgroundColor("#00FF00");
    } else if (this.health > 30) {
      this.healthText.setBackgroundColor("#FFFF00");
    } else {
      this.healthText.setBackgroundColor("#FF0000");
    }
  }

  touchZombie(soldier, zombie) {
    if (this.isDead) {
      return;
    }
    if (this.health > 0) {
      zombie.bite();
      this.health -= 1;
    } else if (this.health <= 0) {
      this.soldierDead();
    }
  }

  zombieShot(bullet, zombie) {
    this.score += 1;
    bullet.die();
    zombie.die();
  }
}
