export default class Preload extends Phaser.Scene {
    // escena para optimiozar tiempos
    // carga el preload solo una vez y sirve para todo el juego
    constructor() {
      // key of the scene
      super("Preload");
    }
  
    preload() {
      // load assets
      this.load.tilemapTiledJSON("Nivel1", "./public/tilemaps/Nivel1.json");
      this.load.image("nave", "./public/images/Nave.png");
      this.load.image("Nave2", "./public/images/Nave2.png");
      this.load.image("Escenario1", "./public/images/Escenario1.png");
      this.load.image("Escenario2", "./public/images/Escenario2.png");
      this.load.image("Disparo", "./public/images/Disparo.png");
      this.load.image("VidaNave", "./public/images/VidaNave.png");
      this.load.image("meteorito", "./public/images/Meteorito.png");
      this.load.image("explosionNave", "./public/images/explosionNave.gif");
      this.load.image("Logo", "./public/images/Logo.jpeg");
      this.load.image("Github", "./public/images/Github.png");
      this.load.image("Estrella", "./public/images/Estrella.png");
      this.load.image("Circulo", "./public/images/circulo.png");
      this.load.image("Controls", "./public/images/Controls.png");
      this.load.image("Donaciones", "./public/images/Donaciones.png");
      this.load.spritesheet("explosionMeteorito", "./assets/images/explosionMeteorito.png", {
        frameWidth: 218,
        frameHeight: 164,
      });
    }
  
    create() {  
      // init scene juego
      this.anims.create({
        key: "explosion",
        frames: this.anims.generateFrameNumbers("explosionMeteorito", { start: 0, end: 32 }),
        frameRate: 30,
        repeat: 0,
        hideOnComplete: false,
      });
      this.scene.start("MenuScene");
    }
  }