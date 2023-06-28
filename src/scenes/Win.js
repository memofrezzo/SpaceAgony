export default class Win extends Phaser.Scene {
  constructor() {
    super("Win");
  }

  create (){
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    this.imagenVictoria = this.add.image(screenWidth / 2, screenHeight / 2 , "restart").setScale(2);
    this.texto = this.add.text(
      screenWidth / 2,
      screenHeight / 2 +200,
      "GANASTE!",
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
