export default class Nivel2 extends Phaser.Scene {
  constructor() {
    super('nivel2');
  }

  create() {
    this.teclas = this.input.keyboard.createCursorKeys();
    this.camera = this.cameras.main;
    this.nave = this.physics.add.sprite(163, 511, "nave").setDepth(2);
    this.nave.body.allowGravity = false;
    this.nave.setCollideWorldBounds(true);
    this.nave.setVelocityX(3000);
    this.nave.setScale(0.45);

    this.isShooting = false;
    this.shootDelay = 300;
    this.lastShootTime = 400;

    const music = this.sound.add('musica1', {
      loop: true
    });
    music.play();

    this.musicOff = this.physics.add.sprite(1400, 20, 'Estrella').setInteractive();
    this.musicOff.setScale(0.5);
    this.musicOff.setDepth(1);
    this.musicOff.setVelocityX(300);

    const pauseResumeMusic = () => {
      if (music.isPlaying) {
        music.pause();
        this.musicOff.setTint(0xff0000);
      } else {
        music.resume();
        this.musicOff.clearTint();
      }
    };

    this.musicOff.on('pointerdown', pauseResumeMusic);

    this.input.keyboard.on('keydown-M', () => {
      pauseResumeMusic();
    });

    this.map = this.make.tilemap({ key: 'Nivel1' });
    const tileset = this.map.addTilesetImage('Escenario1', 'Escenario1');
    this.map.createLayer('background', tileset, 0, 0);

    const zoomFactor = 0.9;
    this.cameras.main.setZoom(zoomFactor);

    const { widthInPixels, heightInPixels } = this.map;
    this.physics.world.setBounds(0, 0, widthInPixels, heightInPixels);

    const yOffset = 0;
    this.cameras.main.setScroll(0, yOffset);

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

    const spawnPoint = this.map.findObject("objects", (obj) => obj.name === "exit");
    console.log("spawn point salida ", spawnPoint);
    if (spawnPoint) {
      this.exit = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, "Estrella")
        .setScale(1)
        .setSize(40, 1000);
    }
    this.physics.add.overlap(
      this.nave,
      this.exit,
      this.esVencedor,
      null,
      this
    );
  }

  update(time) {
    if (this.teclas.up.isDown && this.nave.y > this.camera.y) {
      this.nave.y -= 4; // Velocidad hacia arriba
    } else if (this.teclas.down.isDown && this.nave.y < this.camera.y + this.camera.height) {
      this.nave.y += 4; // Velocidad hacia abajo
    }

    if (this.teclas.space.isDown) {
      if (!this.isShooting && time > this.lastShootTime + this.shootDelay) {
        this.shoot();
        this.lastShootTime = time;
      }
    }

    const cameraOffsetX = -500;
    const cameraOffsetY = 0;
    this.cameras.main.setFollowOffset(cameraOffsetX, cameraOffsetY);
  }

  shoot() {
    const disparo = this.physics.add.sprite(this.nave.x + 15, this.nave.y + 1, 'Disparo').setDepth(2);
    disparo.setVelocityX(1500); // Velocidad del disparo en el eje X
    disparo.setScale(0.3);

    this.isShooting = true;

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        disparo.destroy();
        this.isShooting = false;
      },
    });
  }

  generarImagen() {
    const camera = this.cameras.main;
    const offsetX = 100;

    const x = camera.scrollX + camera.width + offsetX;
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height);

    const velocidadAleatoria = Phaser.Math.Between(300, 550);
    const sprite = this.physics.add.image(x, y, 'meteorito');
    sprite.setVelocityX(-velocidadAleatoria);
  }

  esVencedor() {
    this.scene.start("Win");
  }
}
