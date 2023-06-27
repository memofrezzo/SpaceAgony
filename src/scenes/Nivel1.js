import Nave from "../objects/Nave.js";

export default class Nivel1 extends Phaser.Scene {
  constructor() {
    super('Nivel1');
  }
  init() {
    this.playerSurvived = false;
    this.isNextLevelEnabled = false;
    this.vidas = 3;
  }
  
  create() {
    const music = this.sound.add('musica1', {
      loop: true
    });
    music.play();
    this.disparoGroup = this.physics.add.group();
    this.musicOff = this.physics.add.sprite(1400, 40, 'musicaLogo').setInteractive(); //No puse el logo de la música porque no lo terminé
    this.musicOff.setScale(0.1);
    this.musicOff.setDepth(1);
    this.musicOff.setVelocityX(300);
  
    const pauseResumeMusic = () => {
      if (music.isPlaying) {
        music.pause();
        this.musicOff.setTint(0xff0000); // Cambiar el color de la imagen al pausar la música
      } else {
        music.resume();
        this.musicOff.clearTint(); // Eliminar el color de la imagen al reanudar la música
      }
    };
  
    this.musicOff.on('pointerdown', pauseResumeMusic);
  
    // Manejo de eventos del teclado
    this.input.keyboard.on('keydown-M', () => {
      pauseResumeMusic();
    });
  
     // Crear el grupo de meteoros
     this.disparoGroup= this.physics.add.group({
      defaultKey: 'disparo',
      maxSize: 10 // Establecer el tamaño máximo del grupo de meteoritos según tus necesidades
    });
     this.corazonGroup = this.physics.add.group({
      defaultKey: 'corazon',
      maxSize: 10 // Establecer el tamaño máximo del grupo de meteoritos según tus necesidades
    });
  this.meteoroGroup = this.physics.add.group({
    defaultKey: 'meteorito',
    maxSize: 10 // Establecer el tamaño máximo del grupo de meteoritos según tus necesidades
  });

    this.map = this.make.tilemap({ key: 'Nivel1' });
    const tileset = this.map.addTilesetImage('Escenario1', 'Escenario1');
    this.map.createLayer('background', tileset, 0, 0);

    const zoomFactor = 0.9;
    this.cameras.main.setZoom(zoomFactor);

    const { widthInPixels, heightInPixels } = this.map;
    this.physics.world.setBounds(0,0,widthInPixels, heightInPixels);

    const yOffset = 0;
    this.cameras.main.setScroll(0, yOffset);

    const naveX = 163.333333333333;
    const naveY = 510.666666666667;

    // Crear el grupo de meteoros
    this.meteoroGroup = this.physics.add.group();
    this.corazonGroup = this.physics.add.group();

    this.nave = new Nave(this, naveX, naveY, this.meteoroGroup, this.corazonGroup);
    this.meteoritoSpawnTimer = 0;
    this.cameras.main.startFollow(this.nave);
    this.cameras.main.setLerp(1, 0);
    this.cameras.main.setScroll(0, 40);

    this.time.addEvent({
      delay: 2000,
      callback: this.agregarCorazon,
      callbackScope: this,
      loop: true
    });
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        this.generarCorazon();
      },
      callbackScope: this
    });
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.generarImagen();
      },
      callbackScope: this
    });
  
    //exit
    const spawnPoint = this.map.findObject("objects", (obj) => obj.name === "exit");
    console.log("spawn point salida ", spawnPoint);
    if (spawnPoint){
      this.exit = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "Estrella") 
      .setScale(1)
      .setSize(40,1000);
    }
    this.physics.add.overlap(
      this.nave,
      this.exit,
      this.esVencedor,
      null,
      this
    );    
    // Colisión entre la nave y los meteoros del grupo
    this.physics.add.overlap(this.nave, this.meteoroGroup, this.handleCollision, null, this);
    this.physics.add.overlap(this.nave, this.corazonGroup, this.handleCollision, null, this);
    this.physics.add.overlap(this.disparoGroup, this.meteoroGroup, this.handleCollision, null, this);
    }

   generarCorazon() {
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(200, 300); // Velocidad aleatoria entre 200 y 600
    const sprite = this.corazonGroup.create(x, y, 'corazon').setDepth(2);
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
  }

  generarImagen() {
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(300, 500); // Velocidad aleatoria entre 200 y 600
    const sprite = this.meteoroGroup.create(x, y, 'meteorito').setScale(0.9);
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
  }
  
  esVencedor() {
    this.scene.start("Win"), {
    };
    
  }

  update(time) {
    this.nave.update(time);
    const cameraOffsetX = -500; // Desplazamiento horizontal desde la posición de la nave
    const cameraOffsetY = 0; // Desplazamiento vertical desde la posición de la nave
    this.cameras.main.setFollowOffset(cameraOffsetX, cameraOffsetY);
  }
  handleCollision(nave, objeto) {
    if (objeto.texture.key === 'corazon') {
      // Sumar una vida
      this.vidas++;
      // Ocultar y desactivar el corazón colisionado
      objeto.disableBody(true, true);
      // Salir de la función, ya que no es necesario hacer más acciones
      return;
    }
  
    if (objeto.texture.key === 'meteorito') {
      console.log('Colisión con meteoro');
      this.vidas--;
      objeto.disableBody(true, true);
      if (this.vidas > 0) {
        // Hacer parpadear la nave
        this.nave.blinkNave();
  
        // Esperar 2 segundos antes de permitir otra colisión
        this.time.delayedCall(2000, () => {
          // Hacer visible la nave nuevamente
          this.nave.setActive(true);
          this.nave.setVisible(true);
        }, this);
      } else {
        this.nave.play("ExplosionNave").setScale(2.3); // Reproducir la animación de la explosión de la nave
        this.time.delayedCall(2000, () => {
          this.gameOver();
        }, this);
      }
      }
      // Verificar si el objeto colisionado es un disparo
      if (objeto.texture.key === 'Disparo') {
        // Ocultar y desactivar el disparo colisionado
        objeto.disableBody(true, true);
        // Salir de la función, ya que no es necesario hacer más acciones
        return;
      }
  }
  
  

  gameOver() {
    this.scene.start('GameOver');
  }
  
}


//Mejor funcion del mundo:
//.setInteractive(this.imput.makePixelPerfect());