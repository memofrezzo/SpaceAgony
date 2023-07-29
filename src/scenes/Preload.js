export default class Preload extends Phaser.Scene {
    // escena para optimiozar tiempos
    // carga el preload solo una vez y sirve para todo el juego
    constructor() {
      // key of the scene
      super("Preload");
    }
  
    preload() {
      // load assets
      //video
      this.load.video('presentacion', "./public/images/videoPreload.mp4");
      //rest of immages
      this.load.tilemapTiledJSON("Nivel1", "./public/tilemaps/Nivel1.json");
      this.load.image("nave", "./public/images/Nave.png");
      this.load.image("Nave2", "./public/images/Nave2.png");
      this.load.image("Escenario1", "./public/images/Escenario1.png");
      this.load.image("Escenario2", "./public/images/Escenario2.png");
      this.load.image("Disparo", "./public/images/Disparo.png");
      this.load.image("VidaNave", "./public/images/VidaNave.png");
      this.load.image("InteriorVidaNave", "./public/images/InteriorVidaNave.png");	
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
      this.load.image("Enemie1", "./public/images/Enemie1.png");
      this.load.image("musicaOff", "./public/images/musicaOff.png");
      this.load.image("corazonSinVida", "./public/images/CorazonSinVida.png");
      this.load.image("habilidad1", "./public/images/Habilidad1.png");
      this.load.image("habilidad2", "./public/images/Habilidad2.png");
      this.load.image("habilidad3", "./public/images/Habilidad3.png");
      this.load.image("BossFinal", "./public/images/BossFinal.png"); 
      this.load.image("enemie", "./public/images/enemie1.png");
      this.load.image("SkipIcon", "./public/images/SkipIcon.png");
      this.load.image("ballOfPower", "./public/images/BallOfPower.png");
      this.load.spritesheet("ExplosionNave", "./public/images/explosionNave.png", {
        frameWidth: 156,
        frameHeight: 228
      });
      //Música
      this.load.audio("lostMusic", "./public/audio/lostMusic.mp3");
      this.load.audio("winMusic", "./public/audio/winMusic.mp3");
      this.load.audio("musica1", "./public/audio/musica1.wav");  
      this.load.audio("selectOption", "./public/audio/selectOption.mp3");
      this.load.audio("habilidad1", "./public/audio/habilidad1.mp3");
      this.load.audio("habilidad2", "./public/audio/habilidad2.mp3");
      this.load.audio("shot", "./public/audio/Shot.mp3");
      this.load.audio("finalBossMusic", "./public/audio/finalBossMusic.mp3");
      this.load.audio("musicArcade", "./public/audio/musicArcade.mp3");
    }
  
    create() {
      this.anims.create({
        key: "ExplosionNave",
        frames: this.anims.generateFrameNumbers("ExplosionNave", { start: 0, end: 18 }),
        frameRate: 18,
        repeat: 0,
        hideOnComplete: false,
      });
    
      // Presentación de video
      this.numClicks = 0;
      this.presentacion = this.add.video(710.5, 440, "presentacion").setInteractive();
    
      const scaleWidth = this.cameras.main.width / this.presentacion.width;
      const scaleHeight = this.cameras.main.height / this.presentacion.height;
      const scaleFactor = Math.min(scaleWidth, scaleHeight);
      this.presentacion.setScale(scaleFactor);
      this.presentacion.play();
    
      this.presentacion.on('complete', () => {
        this.scene.start("MenuScene");
      });
    
      // Configuración del círculo blanco
      const circleRadius = 40;
      const circleX = this.cameras.main.width - circleRadius - 20;
      const circleY = circleRadius + 60;
      const circle = this.add.circle(circleX, circleY, circleRadius, 0x808080).setAlpha(0.5);      
      const skipIconX = circleX + 2;
      const skipIconY = circleY;
      const skipIcon = this.add.image(skipIconX, skipIconY, "SkipIcon") .setScale(0.17);
      skipIcon.setInteractive();
      skipIcon.setScrollFactor(0);
      skipIcon.setDepth(2);
    
      circle.on('pointerover', () => {
        skipIcon.setScale(0.2); // Aumentar la escala de la imagen
        circle.setScale(1.2); // Aumentar la escala del círculo
      });
    
      circle.on('pointerout', () => {
        skipIcon.setScale(0.17); // Restaurar la escala original de la imagen
        circle.setScale(1); // Restaurar la escala original del círculo
      });

      circle.on('pointerdown', () => {
        this.skipPresentation();
      });
    
      skipIcon.on('pointerover', () => {
        skipIcon.setScale(0.2); // Aumentar la escala de la imagen
        circle.setScale(1.2); // Aumentar la escala del círculo
      });
      
      skipIcon.on('pointerout', () => {
        skipIcon.setScale(0.17); // Restaurar la escala original de la imagen
        circle.setScale(1); // Restaurar la escala original del círculo
      });
    
      // Evento al hacer clic en la imagen
      skipIcon.on('pointerdown', () => {
        this.skipPresentation();
      });
    
      // Ocultar el círculo e imagen al inicio
      circle.setVisible(false);
      skipIcon.setVisible(false);
    
      // Configurar el temporizador para mostrar el círculo e imagen después de 3 segundos
      this.time.delayedCall(3500, () => {
        circle.setVisible(true);
        skipIcon.setVisible(true);
      });
    }
    
    // Función para saltar la presentación y cambiar de escena
    skipPresentation() {
      this.scene.start("nivel2");
    }
  }
    