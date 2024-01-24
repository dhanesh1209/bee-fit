import Phaser from "phaser";

class LoadingScene extends Phaser.Scene {
   constructor() {
      super({ key: "loading-scene" });
   }

   preload() {
      this.load.image("menu-bg", "static/assets/map/bg.png");
      this.load.image("game-bg", "static/assets/map/bg_1.png");
      this.load.image("play-btn", "static/assets/ui/play-btn.png");
      this.load.image("restart-btn", "static/assets/ui/restart-btn.png");

      this.load.image("easy-btn", "static/assets/ui/easy-btn.png");
      this.load.image("medium-btn", "static/assets/ui/medium-btn.png");
      this.load.image("hard-btn", "static/assets/ui/hard-btn.png");
      this.load.image("expert-btn", "static/assets/ui/expert-btn.png");
      this.load.image("btn-play", "static/assets/ui/btn-play.png");
      this.load.image("menu-btn", "static/assets/ui/menu-btn.png");
      this.load.image("game-over", "static/assets/ui/game-over.png");
      this.load.image("btn-help", "static/assets/ui/btn-help.png");
      this.load.image("btn-lb", "static/assets/ui/btn-lb.png");
      this.load.image("btn-back", "static/assets/ui/btn-back.png");

      this.load.image("shadow", "static/assets/map/shadow.png");

      this.load.image("fruit_1", "static/assets/fruits/raspberry.png");
      this.load.image("fruit_2", "static/assets/fruits/red-apple.png");
      this.load.image("fruit_3", "static/assets/fruits/red-cherry.png");
      this.load.image("fruit_4", "static/assets/fruits/orange.png");
      this.load.image("fruit_5", "static/assets/fruits/strawberry.png");
      this.load.image("fruit_6", "static/assets/fruits/peach.png");
      this.load.image("fruit_7", "static/assets/fruits/plum.png");
      this.load.image("fruit_8", "static/assets/fruits/star-fruit.png");
      this.load.image("fruit_9", "static/assets/fruits/banana.png");
      this.load.image("fruit_10", "static/assets/fruits/watermelon.png");

      this.load.image("swinging_blade", "static/assets/map/swinging_blade.png");
      this.load.image("swinging_spike_stick", "static/assets/map/swinging_spike_stick.png");

      this.load.spritesheet("bee", "static/assets/bee/bee-sheet.png", { frameWidth: 64, frameHeight: 64 });

      this.initLoader();
   }

   create() {
      let element = document.createElement("div");
      element.classList.add("content");

      let nameBox = document.createElement("div");
      nameBox.id = "name_box";
      nameBox.classList.add("name-box");

      nameBox.innerHTML = `<lebel> Enter your username </lebel> <input id="name_input" type="text" placeholder="Enter..." /> <input id="submit_btn" type="submit" value="Submit" />  <input id="cancel_btn" type="button" value="Cancel"/>`;

      element.appendChild(nameBox);

      document.getElementById("web-root").appendChild(element);
   }

   initLoader() {
      let width = this.scale.width;
      let height = this.scale.height;

      let pwidth = width - 200;
      let pheight = 10;

      let progressBox = this.add.graphics();
      let progressBar = this.add.graphics();

      progressBox.fillStyle(0x000000, 0.8);
      progressBox.fillRect(width / 2 - pwidth / 2, height - 100, pwidth + 4, pheight + 4);

      this.load.on("progress", function (value: number) {
         progressBar.clear();
         progressBar.fillStyle(0x42eacb, 1);
         progressBar.fillRect(width / 2 - pwidth / 2 + 2, height - 98, pwidth * value, pheight);
      });

      this.load.on("complete", () => {
         progressBar.destroy();
         progressBox.destroy();

         this.scene.start("main-scene");
      });
   }
}

export default LoadingScene;
