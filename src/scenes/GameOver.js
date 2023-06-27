export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    this.imagenVictoria = this.add.image(screenWidth / 2, screenHeight / 2, "mapa").setScale(2);

    this.texto = this.add.text(
      screenWidth / 2,
      screenHeight / 2,
      "PERDISTE!",
      { fontSize: "30px", fill: "#FFFFFF" }
    ).setOrigin(0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }

  update() {
    if (this.keyR.isDown) {
      this.scene.start("MenuScene");
    }
  }
}
