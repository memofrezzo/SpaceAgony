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
      
  
  
      this.load.image("salida", "./public/images/salida.png");
    }
  
    create() {  
      // init scene juego
      this.scene.start("nivel2");
    }
  }