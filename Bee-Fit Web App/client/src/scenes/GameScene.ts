import axios from "axios";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
   keyA!: Phaser.Input.Keyboard.Key;
   keyD!: Phaser.Input.Keyboard.Key;
   cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
   playBtn!: Phaser.GameObjects.Image;
   menuBtn!: Phaser.GameObjects.Image;
   player!: Phaser.Physics.Arcade.Sprite;
   shadow!: Phaser.Physics.Arcade.Sprite;
   background!: Phaser.Physics.Arcade.StaticGroup;
   shadows!: Phaser.Physics.Arcade.StaticGroup;
   potions!: Phaser.Physics.Arcade.StaticGroup;
   platforms: Phaser.Physics.Arcade.StaticGroup;
   scoreText!: Phaser.GameObjects.Text;
   energyText!: Phaser.GameObjects.Text;
   gameOverUi!: Phaser.GameObjects.Image;
   bgPosY = 0;
   score = 0;
   energy = 100;
   cellsGap = 200;
   isGameOver = false;
   isGameStarted = false;
   dificultyLevel = "normal";
   gameSpeed = 1;
   scoreLimit = 10;
   limitEnergy = 12;
   potionChance = 3;
   canvasW = 600;
   canvasX = 0;
   constructor() {
      super({
         key: "game-scene",
         physics: {
            default: "arcade",
            arcade: {
               debug: false,
            },
         },
      });
   }

   create(data: { level: string }) {
      this.dificultyLevel = data.level;
      switch (this.dificultyLevel) {
         case "easy":
            this.gameSpeed = 2;
            this.cellsGap = 200;
            this.potionChance = 2;
            break;
         case "medium":
            this.gameSpeed = 4;
            this.cellsGap = 160;
            this.potionChance = 3;
            break;
         case "hard":
            this.gameSpeed = 6;
            this.cellsGap = 130;
            this.potionChance = 4;
            break;
         case "expert":
            this.gameSpeed = 8;
            this.cellsGap = 100;
            this.potionChance = 5;
            break;
      }
      this.bgPosY = this.scale.height;
      this.canvasW = this.scale.width < 600 ? this.scale.width : 600;
      this.canvasX = this.scale.width / 2 - this.canvasW / 2;
      this.add.image(0, 0, "menu-bg").setOrigin(0, 0).setSize(600, 800);

      this.background = this.physics.add.staticGroup();
      this.background.create(this.scale.width / 2, this.bgPosY, "game-bg").setOrigin(0.5, 1);

      this.shadow = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 150, "shadow").setDepth(99);
      this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 180, "bee").setDepth(99);
      this.physics.add.existing(this.player).body.setSize(64, 32, false).setOffset(0, 16);
      this.player.setCollideWorldBounds(true);

      const frames = [
         { name: "move", from: 0, to: 4, direction: "forward", repeat: -1 },
         { name: "roll", from: 5, to: 14, direction: "forward", repeat: 0 },
         { name: "death", from: 15, to: 18, direction: "forward", repeat: 0 },
      ];

      frames.forEach((frame) => {
         if (this.anims.exists(frame.name)) return;
         this.anims.create({
            key: frame.name,
            frames: this.anims.generateFrameNumbers("bee", { start: frame.from, end: frame.to }),
            repeat: frame.repeat,
            frameRate: 16,
         });
      });

      this.player.anims.play("move", true);

      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.cursors = this.input.keyboard.createCursorKeys();

      this.gameOverUi = this.add
         .image(this.scale.width / 2, this.scale.height / 2 - 100, "game-over")
         .setDepth(1000)
         .setVisible(false);

      this.playBtn = this.add
         .image(this.scale.width / 2, this.scale.height / 2, "play-btn")
         .setScale(0.8)
         .setDepth(1000)
         .setInteractive({ cursor: "pointer" });

      this.playBtn.on("pointerup", () => {
         if (!this.isGameStarted) {
            this.startGame();
         } else {
            this.restartGame();
         }
      });

      this.menuBtn = this.add
         .image(this.canvasX + 10, 10, "menu-btn")
         .setScale(0.3)
         .setOrigin(0, 0)
         .setDepth(1000)
         .setInteractive({ cursor: "pointer" });

      this.menuBtn.on("pointerup", () => {
         this.backToMianMenu();
      });

      this.shadows = this.physics.add.staticGroup();
      this.potions = this.physics.add.staticGroup();
      this.platforms = this.physics.add.staticGroup();

      this.physics.add.overlap(this.player, this.potions, this.collectfruit, null, this);
      this.physics.add.overlap(this.player, this.platforms, this.gameIsOver, null, this);
      this.physics.add.overlap(
         this.platforms,
         this.potions,
         (platform: Phaser.Physics.Arcade.Sprite, fruit: Phaser.Physics.Arcade.Sprite) => {
            fruit.disableBody(true, true);
            this.shadows.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
               if (entry.name === fruit.name) {
                  entry.destroy();
                  this.shadows.remove(entry);
               }
               return true;
            });
         },
         null,
         this
      );

      this.physics.add.overlap(
         this.platforms,
         this.platforms,
         (platform: Phaser.Physics.Arcade.Sprite, platform1: Phaser.Physics.Arcade.Sprite) => {
            platform1.disableBody(true, true);
         },
         null,
         this
      );

      this.scoreText = this.add
         .text(this.canvasX + this.canvasW - 150, 20, `SCORE: ${this.score}`, { fontSize: 20, fontFamily: "Courier New", fontStyle: "bold", color: "#32a9e5" })
         .setDepth(1000)
         .setStroke("#f29c35", 3);
      this.energyText = this.add
         .text(this.canvasX + this.canvasW - 300, 20, `ENERGY: ${this.energy}`, { fontSize: 20, fontFamily: "Courier New", fontStyle: "bold", color: "#32a9e5" })
         .setDepth(1000)
         .setStroke("#f29c35", 3);
   }

   backToMianMenu() {
      this.score = 0;
      this.energy = 100;
      this.isGameOver = false;
      this.isGameStarted = false;

      this.potions.children.each((child) => {
         child.destroy();
         return true;
      });

      this.platforms.children.each((child) => {
         child.destroy();
         return true;
      });

      this.scene.stop("game-scene");
      this.scene.start("main-scene");
   }

   startGame() {
      this.player.anims.play("move", true);
      this.score = 0;
      this.energy = 100;
      this.isGameOver = false;
      this.isGameStarted = true;
      this.playBtn.setVisible(false);
      this.player.setX(this.scale.width / 2);
      this.gameOverUi.setVisible(false);
      this.addNewPlatform();
   }

   restartGame() {
      this.shadows.children.each((child) => {
         child.destroy();
         return true;
      });
      this.potions.children.each((child) => {
         child.destroy();
         return true;
      });
      this.platforms.children.each((child) => {
         child.destroy();
         return true;
      });

      this.startGame();
   }

   addNewPlatform(y: number = 0) {
      let type = Math.floor(Math.random() * 2);
      let x = Math.floor(Math.random() * (this.canvasX + this.canvasW - 35 - (this.canvasX + 35)) + this.canvasX + 35);
      if (type === 0) {
         this.platforms.create(x, y, "swinging_blade").refreshBody();
         this.shadows
            .create(x, y + 34, "shadow")
            .setScale(2, 2)
            .refreshBody();
      } else {
         this.platforms.create(x, y, "swinging_spike_stick").refreshBody();
         this.shadows
            .create(x, y + 24, "shadow")
            .setScale(3, 1)
            .refreshBody();
      }

      this.addNewPotion();
   }

   addNewPotion(y: number = 0) {
      let chance = Math.floor(Math.random() * this.potionChance);
      if (chance === 0) {
         let cx = Math.floor(Math.random() * (this.canvasX + this.canvasW - 20 - (this.canvasX + 20)) + this.canvasX + 20);
         let cy = y - this.cellsGap / 2;
         let rnd = Math.random()
            .toString(36)
            .substring(2, 8 + 2);

         let fruitType = Math.floor(Math.random() * 10 + 1);

         this.potions
            .create(cx, cy, "fruit_" + fruitType)
            .setScale(0.5)
            .setName(rnd)
            .refreshBody();

         this.shadows
            .create(cx, cy + 30, "shadow")
            .setScale(1.5, 1.5)
            .setName(rnd)
            .refreshBody();
      }
   }

   collectfruit(player: Phaser.Physics.Arcade.Sprite, fruit: Phaser.Physics.Arcade.Sprite) {
      fruit.disableBody(true, true);
      this.energy += 10;
      this.energyText.setText(`ENERGY: ${Math.floor(this.energy)}`);
      this.shadows.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
         if (entry.name === fruit.name) {
            entry.destroy();
            this.shadows.remove(entry);
         }
         return true;
      });
   }

   gameIsOver() {
      if (!this.isGameOver) {
         this.player.anims.play("death", true);
         this.isGameOver = true;
         this.updateScore(this.score, this.dificultyLevel);
         this.gameOverUi.setVisible(true);
         this.playBtn.setTexture("restart-btn").setVisible(true);
      }
   }

   update() {
      let boostSpeed = this.gameSpeed;

      if (this.energy <= 0) {
         this.gameIsOver();
      }

      if (!this.isGameStarted || this.isGameOver) {
         this.player.setVelocityX(0);
         return;
      }

      if (this.cursors.left.isDown || this.keyA.isDown) {
         this.player.setVelocityX(-160 * (boostSpeed / 2));
      } else if (this.cursors.right.isDown || this.keyD.isDown) {
         this.player.setVelocityX(160 * (boostSpeed / 2));
      } else {
         this.player.setVelocityX(0);
      }

      if (this.player.x < this.canvasX + 35) {
         this.player.setX(this.canvasX + 35);
      } else if (this.player.x > this.canvasX + this.canvasW - 35) {
         this.player.setX(this.canvasX + this.canvasW - 35);
      }

      if (this.cursors.space.isDown) {
         boostSpeed = this.gameSpeed * 3;
      }

      this.shadow.setPosition(this.player.x, this.player.y + 30);

      if (this.scoreLimit > 0) {
         this.scoreLimit -= 1;
      } else {
         this.scoreLimit = 10;
         this.score += 1 * boostSpeed;
         this.scoreText.setText(`SCORE: ${Math.floor(this.score)}`);
      }

      if (this.limitEnergy > 0) {
         this.limitEnergy -= 1;
      } else {
         this.limitEnergy = 12;
         this.energy -= 1;
         this.energyText.setText(`ENERGY: ${Math.floor(this.energy)}`);
      }

      let lastY = 0;
      this.platforms.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
         entry.setY(entry.y + boostSpeed).refreshBody();
         if (entry.y > this.scale.height) {
            entry.destroy();
            this.platforms.remove(entry);
         }
         lastY = entry.y;
         return true;
      });

      if (lastY > this.cellsGap) {
         this.addNewPlatform();
      }

      this.potions.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
         entry.setY(entry.y + boostSpeed).refreshBody();
         if (entry.y > this.scale.height) {
            entry.destroy();
            this.platforms.remove(entry);
         }
         return true;
      });

      this.shadows.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
         entry.setY(entry.y + boostSpeed).refreshBody();
         if (entry.y > this.scale.height) {
            entry.destroy();
            this.platforms.remove(entry);
         }
         return true;
      });

      this.background.children.each((entry: Phaser.Physics.Arcade.Image, index: number) => {
         entry.setY(entry.y + boostSpeed / 2).refreshBody();
         if (index === this.background.children.size - 1) {
            if (entry.y > this.scale.height) {
               this.background.create(this.scale.width / 2, this.scale.height - (entry.height - 10), "game-bg").setOrigin(0.5, 1);
            }
         }

         if (entry.y - entry.height > this.scale.height) {
            entry.destroy();
            this.background.remove(entry);
         }
         return true;
      });
   }

   updateScore(score: number, level: string) {
      const endpoint = "http://localhost:5000";
      axios
         .post(endpoint + "/update-score", { score, level })
         .then((res) => {
            console.log("Score updated!");
         })
         .catch((err) => {
            console.log("Score update faild");
         });
   }
}

export default GameScene;
