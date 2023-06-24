class Nave extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, meteoroGroup) {
    super(scene, x, y, 'nave');

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.body.setGravityY(0);
    this.body.setCollideWorldBounds(true);
    this.body.setVelocityX(300);
    this.setScale(0.45);

    this.isShooting = false;
    this.shootDelay = 300;
    this.lastShootTime = 400;

    this.meteoroGroup = meteoroGroup; // Asignar el grupo de meteoros
  }
    
  update(time) {
    const teclas = this.scene.input.keyboard.createCursorKeys();
    const camera = this.scene.cameras.main;

    if (teclas.up.isDown && this.y > camera.y) {
      this.body.velocity.y = -400; // Velocidad hacia arriba
    } else if (teclas.down.isDown && this.y < camera.y + camera.height) {
      this.body.velocity.y = 400; // Velocidad hacia abajo
    } else {
      this.body.velocity.y = 0;
    }

    if (teclas.space.isDown) {
      // Verificación del tiempo suficiente desde el último disparo
      if (time > this.lastShootTime + this.shootDelay) {
        this.shoot();
        this.lastShootTime = time;
      }
    }
  }

  shoot() {
    // Crear y configurar el disparo
    const disparo = this.scene.physics.add.sprite(this.x + 15, this.y + 1, 'Disparo');
    disparo.setVelocityX(1500); // Velocidad del disparo en el eje X
    disparo.setScale(0.3);

    // Destrucción el disparo después de cierto tiempo para evitar la acumulación de disparos en el mundo
    this.scene.time.addEvent({
      delay: 2000, // Tiempo en milisegundos antes de destruir el disparo
      callback: () => {
        disparo.destroy();
      },
    });
  }

  handleCollision() {
    // Restar una vida
    this.vidas--;
  
    // Destruir los meteoros y los disparos
    this.scene.meteoroGroup.getChildren().forEach((meteoro) => {
      // Crear una animación de explosión en la posición del meteorito
      const explosion = this.scene.add.sprite(meteoro.x, meteoro.y, 'explosionMeteorito');
      explosion.play('explosion', true);
      explosion.on('animationcomplete', () => {
        explosion.destroy(); // Eliminar la animación de explosión cuando se complete
      });
  
      // Ocultar y desactivar el meteorito en lugar de destruirlo
      meteoro.setVisible(false);
      meteoro.setActive(false);
    });
  
    // Comprobar si aún quedan vidas
    if (this.vidas > 0) {
      // Hacer parpadear la nave
      this.blinkNave();
  
      // Esperar 2 segundos antes de permitir otra colisión
      this.scene.time.delayedCall(2000, () => {
        // Hacer visible la nave nuevamente
        this.setActive(true);
        this.setVisible(true);
      }, this);
    } else {
      // No quedan vidas, finalizar el juego
      this.gameOver();
    }
  }

  blinkNave() {
    const nave = this.nave;
    nave.setVisible(false);

    const blinkInterval = setInterval(() => {
      nave.setVisible(!nave.visible);
    }, 200);

    this.scene.time.delayedCall(2000, () => {
      clearInterval(blinkInterval);
      nave.setVisible(true);
    }, this);
  }

  gameOver() {
    if (this.vidas <= 0) {
    this.scene.start('nivel2');}
  }
}

export default class Nivel1 extends Phaser.Scene {
  constructor() {
    super('Nivel1');
  }
  init() {
    this.playerSurvived = false;
    this.Vidas = 3;
    this.isNextLevelEnabled = false;
  }
  create() {
     // Crear el grupo de meteoros
  this.meteoroGroup = this.physics.add.group({
    defaultKey: 'meteorito',
    maxSize: 10 // Establecer el tamaño máximo del grupo de meteoritos según tus necesidades
  });
    //Mutear música
    let isMusicMuted = false;
    let musicOn = this.add.image(0, 0, "musicOn").setInteractive().setDepth(1);

    musicOn.on("pointerdown", () => {
      if (isMusicMuted){
        // music.play();
        musicOn.setTexture("musicOn");
        isMusicMuted = false;
      } else {
        //music.pause();
        musicOn.setTexture("musicOff");
        isMusicMuted = true;
      }
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

    this.nave = new Nave(this, naveX, naveY, this.meteoroGroup);
    this.meteoritoSpawnTimer = 0;
    this.cameras.main.startFollow(this.nave);
    this.cameras.main.setLerp(1, 0);
    this.cameras.main.setScroll(0, 40);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.generarImagen();
      },
      callbackScope: this
    });
  
    // Colisión entre la nave y los meteoros del grupo
    this.physics.add.overlap(this.nave, this.meteoroGroup, this.nave.handleCollision, null, this.nave);
  }

  generarImagen() {
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(200, 600); // Velocidad aleatoria entre 200 y 600
    const sprite = this.meteoroGroup.create(x, y, 'meteorito');
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
  }
  

  update(time) {
    this.nave.update(time);
    const cameraOffsetX = -500; // Desplazamiento horizontal desde la posición de la nave
    const cameraOffsetY = 0; // Desplazamiento vertical desde la posición de la nave
    this.cameras.main.setFollowOffset(cameraOffsetX, cameraOffsetY);
  }
  
}


//Mejor funcion del mundo:
//.setInteractive(this.imput.makePixelPerfect());