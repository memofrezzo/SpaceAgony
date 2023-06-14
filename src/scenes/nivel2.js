class Nave extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'Nave2');

    scene.add.existing(this);
    scene.physics.world.enable(this);

    // Configura las propiedades de la nave
    this.body.setGravityY(0); // Desactiva la gravedad
    this.body.setCollideWorldBounds(true); // Evita que la nave salga de los límites del mundo
    this.body.setVelocityX(500);
    this.setScale(0.45);

    this.isShooting = false;
    this.shootDelay = 300; // Retardo entre disparos en milisegundos
    this.lastShootTime = 400;
  }

  update(time) {
    const teclas = this.scene.input.keyboard.createCursorKeys();
    const camera = this.scene.cameras.main;

    if (teclas.up.isDown && this.y > camera.y) {
      this.body.velocity.y = -400; // Velocidad hacia arriba
    } else if (teclas.down.isDown && this.y < camera.y + camera.height) {
      this.body.velocity.y = 400; // Velocidad hacia abajo
    } else {
      this.body.velocity.y = 0; // No se presionó ninguna tecla, la nave se detiene
    }

    if (teclas.space.isDown) {
      // Verifica si ha pasado el tiempo suficiente desde el último disparo
      if (time > this.lastShootTime + this.shootDelay) {
        this.shoot();
        this.lastShootTime = time;
      }
    }
  }

  shoot() {
    // Crea y configura el disparo
    const disparo = this.scene.physics.add.sprite(this.x + 15, this.y + 1, 'Disparo');
    disparo.setVelocityX(1500); // Velocidad del disparo en el eje X
    disparo.setScale(0.3);

    // Destruye el disparo después de cierto tiempo para evitar la acumulación de disparos en el mundo
    this.scene.time.addEvent({
      delay: 4000, // Tiempo en milisegundos antes de destruir el disparo
      callback: () => {
        disparo.destroy();
      },
    });
  }
}

export default class Nivel2 extends Phaser.Scene {
  constructor() {
    super('nivel2');
  }

  create() {
    // Carga el mapa del tilemap JSON
    const map = this.make.tilemap({ key: 'Nivel1' });
    const tileset = map.addTilesetImage('Escenario1', 'Escenario2');
    map.createLayer('background', tileset, 0, 0);
    const zoomFactor = 0.9; // Valor que determina el nivel de zoom (puedes ajustarlo según tus necesidades)
    this.cameras.main.setZoom(zoomFactor);
    // Ajusta el tamaño del mundo al tamaño del mapa
    const { widthInPixels, heightInPixels } = map;
    this.physics.world.setBounds(0, 0, widthInPixels, heightInPixels);
    const yOffset = 0; // Valor que determina la cantidad de desplazamiento vertical (puedes ajustarlo según tus necesidades)
    this.cameras.main.setScroll(0, yOffset);

    // Crea la nave en la posición deseada
    const naveX = 163.333333333333;
    const naveY = 510.666666666667;
    this.nave = new Nave(this, naveX, naveY);
    this.cameras.main.startFollow(this.nave);
    this.cameras.main.setLerp(1, 0);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(0, 40);
    // Configura la velocidad de desplazamiento del mapa
    const mapSpeed = 0; // Velocidad en píxeles por segundo

    this.time.addEvent({
      delay: 16, // Actualiza el mapa cada 16 milisegundos (aproximadamente 60 cuadros por segundo)
      loop: true,
      callback: () => {
        map.tilePositionX += mapSpeed / 60; // Ajusta el desplazamiento en función del tiempo y la velocidad
      },
    });
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