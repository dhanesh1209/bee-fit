import axios from "axios";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
   btnsCont!: Phaser.GameObjects.Container;
   levelCont!: Phaser.GameObjects.Container;
   helpCont!: Phaser.GameObjects.Container;
   scoresCont!: Phaser.GameObjects.Container;
   gameLevel = "easy";
   constructor() {
      super({ key: "main-scene" });
   }

   create() {
      this.gameLevel = "easy";

      this.add.image(0, 0, "menu-bg").setOrigin(0, 0).setSize(600, 800);

      this.btnsCont = this.add.container(this.scale.width / 2, this.scale.height / 2);

      let gameName = this.add.text(0, -175, "BeeFit", { fontSize: 22, color: "#ff7300", fontStyle: "bold" }).setOrigin(0.5).setStroke("#32a9e5", 2);
      let playBtn = this.add.image(0, -70, "btn-play").setInteractive({ cursor: "pointer" });
      let lbBtn = this.add.image(0, 0, "btn-lb").setInteractive({ cursor: "pointer" });
      let helpBtn = this.add.image(0, 70, "btn-help").setInteractive({ cursor: "pointer" });

      this.btnsCont.add(gameName);
      this.btnsCont.add(playBtn);
      this.btnsCont.add(lbBtn);
      this.btnsCont.add(helpBtn);

      playBtn.on("pointerup", () => {
         let level = (window as any).level.toLowerCase();
         this.scene.stop("main-scene");
         this.scene.start("game-scene", { level: level });
      });

      lbBtn.on("pointerup", () => {
         this.btnsCont.setVisible(false);
         this.scoresCont.setVisible(true);
         this.getRanking();
      });

      helpBtn.on("pointerup", () => {
         this.btnsCont.setVisible(false);
         this.helpCont.setVisible(true);
      });

      this.levelCont = this.add.container(this.scale.width / 2, this.scale.height / 2).setVisible(false);

      let backBtn = this.add.image(0, 175, "btn-back").setInteractive({ cursor: "pointer" });
      this.levelCont.add(backBtn);

      backBtn.on("pointerup", () => {
         this.btnsCont.setVisible(true);
         this.levelCont.setVisible(false);
      });

      let levelText = this.add.text(0, -175, "Select Level", { fontSize: 22, color: "#ff7300", fontStyle: "bold" }).setOrigin(0.5).setStroke("#32a9e5", 2);
      let easyBtn = this.add.image(0, -105, "easy-btn").setInteractive({ cursor: "pointer" });
      let mediumBtn = this.add.image(0, -35, "medium-btn").setInteractive({ cursor: "pointer" });
      let hardBtn = this.add.image(0, 35, "hard-btn").setInteractive({ cursor: "pointer" });
      let expertBtn = this.add.image(0, 105, "expert-btn").setInteractive({ cursor: "pointer" });

      this.levelCont.add(levelText);
      this.levelCont.add(easyBtn);
      this.levelCont.add(mediumBtn);
      this.levelCont.add(hardBtn);
      this.levelCont.add(expertBtn);

      easyBtn.on("pointerup", () => {
         this.gameLevel = "easy";
         this.levelCont.setVisible(false);
         this.scene.stop("main-scene");
         this.scene.start("game-scene", { level: this.gameLevel });
      });

      mediumBtn.on("pointerup", () => {
         this.gameLevel = "medium";
         this.levelCont.setVisible(false);
         this.scene.stop("main-scene");
         this.scene.start("game-scene", { level: this.gameLevel });
      });

      hardBtn.on("pointerup", () => {
         this.gameLevel = "hard";
         this.levelCont.setVisible(false);
         this.scene.stop("main-scene");
         this.scene.start("game-scene", { level: this.gameLevel });
      });

      expertBtn.on("pointerup", () => {
         this.gameLevel = "expert";
         this.levelCont.setVisible(false);
         this.scene.stop("main-scene");
         this.scene.start("game-scene", { level: this.gameLevel });
      });

      this.scoresCont = this.add.container(this.scale.width / 2, this.scale.height / 2).setVisible(false);

      let lbText = this.add.text(0, -210, "Leaderboard", { fontSize: 22, color: "#ff7300", fontStyle: "bold" }).setOrigin(0.5).setStroke("#32a9e5", 2);
      this.scoresCont.add(lbText);

      let btnScoreBack = this.add.image(0, 105, "btn-back").setInteractive({ cursor: "pointer" });
      this.scoresCont.add(btnScoreBack);
      btnScoreBack.on("pointerup", () => {
         this.btnsCont.setVisible(true);
         this.scoresCont.setVisible(false);
      });

      this.helpCont = this.add.container(this.scale.width / 2, this.scale.height / 2).setVisible(false);

      let helpTitleText = this.add.text(0, -210, "Help", { fontSize: 22, color: "#ff7300", fontStyle: "bold" }).setOrigin(0.5).setStroke("#32a9e5", 2);
      this.helpCont.add(helpTitleText);

      let helpTextCont =
         "You have to avoid bars and collect potions to take energy and survive. Press A or Left to go left, Press D or Right to go right, and Press Space to speed up.";

      let helpText = this.add.text(0, -160, helpTextCont, { align: "center" }).setOrigin(0.5, 0).setWordWrapWidth(300).setLineSpacing(12);
      this.helpCont.add(helpText);

      let btnHelpBack = this.add.image(0, 105, "btn-back").setInteractive({ cursor: "pointer" });
      this.helpCont.add(btnHelpBack);
      btnHelpBack.on("pointerup", () => {
         this.btnsCont.setVisible(true);
         this.helpCont.setVisible(false);
      });
   }

   getRanking() {
      const endpoint = "http://localhost:5000";
      axios
         .get(endpoint + "/ranking")
         .then((res) => {
            console.log(res.data);
            this.showRanking(res.data.users);
         })
         .catch((err) => {
            console.log("Scores load faild!");
         });
   }

   showRanking(users: Array<{ user_id: string; score: number }>) {
      this.scoresCont.each((elm: any) => {
         if (elm.name === "score") {
            console.log("destroyed");
            elm.destroy();
            this.scoresCont.remove(elm);
         }
      });
      users.forEach((user, ind) => {
         let list = this.add
            .text(0, -160 + ind * 30, `${ind + 1}, UserID: ${user.user_id}, Score: ${user.score}`)
            .setName("score")
            .setOrigin(0.5, 0.5);
         this.scoresCont.add(list);
      });
   }

   showAddName() {
      const nameBox = document.getElementById("name_box");
      const nameInput = document.getElementById("name_input") as HTMLInputElement;
      const submitBtn = document.getElementById("submit_btn") as HTMLInputElement;
      const cancelBtn = document.getElementById("cancel_btn") as HTMLInputElement;

      nameBox.style.display = "block";
      this.btnsCont.setVisible(false);

      submitBtn.onclick = (ev) => {
         ev.stopPropagation();
         let username = nameInput.value;

         if (!username) return alert("Username required");
         if (username.length < 8) return alert("The username must have a minimum of 8 characters");

         let regex = /^[a-zA-Z0-9]+$/;
         if (!regex.exec(username)) return alert("The username can only contain a-z, A-Z, 0-9 characters");

         localStorage.setItem("username", username);
         nameBox.style.display = "none";
         this.levelCont.setVisible(true);
      };

      cancelBtn.onclick = (ev) => {
         ev.stopPropagation();
         nameBox.style.display = "none";
         this.btnsCont.setVisible(true);
         this.levelCont.setVisible(false);
      };
   }
}

export default MainScene;
