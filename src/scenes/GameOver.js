
    export default class GameOver extends Phaser.Scene {
      constructor() {
        super("GameOver");
      }
      create (){
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.lostMusic = this.sound.add("lostMusic");
    this.lostMusic.play()
    this.lostMusic.loop = false;
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    this.imagenVictoria = this.add.image(screenWidth / 2, screenHeight / 2 , "restart").setScale(2);
    this.texto = this.add.text(
      screenWidth / 2,
      screenHeight / 2 +200,
      "Press R to restart",
      { fontSize: "30px", fill: "#FF8000" }
    ).setOrigin(0.5);
    }
  update() {
    if (this.keyR.isDown) {
      this.scene.start("MenuScene");
    }
  }
}
