class Nave extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nave');

    scene.add.existing(this);
    scene.physics.world.enable(this);

    // Configura las propiedades de la nave
    this.body.setGravityY(0); // Desactiva la gravedad
    this.body.setCollideWorldBounds(true); // Evita que la nave salga de los límites del mundo
    this.body.setVelocityX(400)
    this.setScale(0.45); 
  }

  update() {
    const teclas = this.scene.input.keyboard.createCursorKeys();
    const camera = this.scene.cameras.main;

    if (teclas.up.isDown && this.y > camera.y) {
      this.body.velocity.y = -400; // Velocidad hacia arriba
    } else if (teclas.down.isDown && this.y < camera.y + camera.height) {
      this.body.velocity.y = 400; // Velocidad hacia abajo
    } else {
      this.body.velocity.y = 0; // No se presionó ninguna tecla, la nave se detiene
    }
  }
}

export default class Nivel1 extends Phaser.Scene {
  constructor() {
    super('Nivel1');
  }

  create() {
    // Carga el mapa del tilemap JSON
    const map = this.make.tilemap({ key: 'Nivel1' });
    const tileset = map.addTilesetImage('Escenario1', 'Escenario1');
    map.createLayer('background', tileset,0,0)
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
    this.physics.world.setBounds(0, 0, map.widthInPixels , map.heightInPixels);
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

  update() {
    this.nave.update();
    const cameraOffsetX = -500; // Desplazamiento horizontal desde la posición de la nave
    const cameraOffsetY = 0; // Desplazamiento vertical desde la posición de la nave
    this.cameras.main.setFollowOffset(cameraOffsetX, cameraOffsetY);
  }
}
//Mejor funcion del mundo:
//.setInteractive(this.imput.makePixelPerfect());