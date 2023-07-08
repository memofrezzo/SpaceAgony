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
      this.load.image("corazon", "./public/images/Corazon.png");
      this.load.image("Donaciones", "./public/images/Donaciones.png");
      this.load.image("musicaLogo", "./public/images/musicaLogo.png");
      this.load.image("restart", "./public/images/restart.png");
      this.load.image("mapa", "./public/images/mapa.png");
      this.load.image("bossFinal", "./public/images/BossFinal.png");
      this.load.image("musicaOff", "./public/images/musicaOff.png");
      this.load.image("corazonSinVida", "./public/images/CorazonSinVida.png");
      this.load.spritesheet("ExplosionNave", "./public/images/explosionNave.png", {
        frameWidth: 156,
        frameHeight: 228
      });
       this.load.spritesheet("ExplosionMeteorito", "./assets/images/ExplosionMeteorito.png", {
        frameWidth: 218,
        frameHeight: 164,
      }); 
      //Música
      this.load.audio("lostMusic", "./public/audio/lostMusic.mp3");
      this.load.audio("winMusic", "./public/audio/winMusic.mp3");
      this.load.audio("musica1", "./public/audio/musica1.wav");  
      this.load.audio("selectOption", "./public/audio/selectOption.mp3");
    }
  
    create() {
      this.anims.create({
        key: "ExplosionNave",
        frames: this.anims.generateFrameNumbers("ExplosionNave", { start: 0, end: 18 }),
        frameRate: 18,
        repeat: 0,
        hideOnComplete: false,
      });
      
      this.anims.create({
        key: "ExplosionMeteorito",
        frames: this.anims.generateFrameNumbers("ExplosionMeteorito", { start: 10, end: 28 }),
        frameRate: 18,
        repeat: 0,
        hideOnComplete: false,
      });
      this.scene.start("MenuScene"); 
    }
  }