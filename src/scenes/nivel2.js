import Nave from "../objects/Nave.js";
import FinalBoss from "../objects/FinalBoss.js";


export default class nivel2 extends Phaser.Scene {
  constructor() {
    super('nivel2');
  }
  init() {
    this.playerSurvived = false;
    this.isNextLevelEnabled = false;
    this.vidas = 3;
  }
  
  create() {
    this.vidasContainer = this.add.container(0, 0);
    this.vidasContainer.setScrollFactor(0);
    this.vidasContainer.setDepth(2);
    this.musicBoss = this.sound.add('musicArcade');
    this.generarBasura = true;

    if (this.vidas <= 0) { this.nave.on('muerteNave', () => {
      this.gameOver(); // Llamar al método gameOver cuando la nave se quede sin vidas
    });}

    this.corazonImage = this.add.image(45, 5, 'corazon').setScale(0.5);
    this.vidasText = this.add.text(0, -10, '', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    this.vidasText.setText(this.vidas.toString());

    this.vidasContainer.add(this.corazonImage);
    this.vidasContainer.add(this.vidasText);
    this.disparoGroup = this.physics.add.group();
    this.disparoFinalBossGroup = this.physics.add.group();
    this.musicOff = this.physics.add.sprite(1400, 40, 'musicaLogo').setInteractive(); //No puse el logo de la música porque no lo terminé
    this.musicOff.setScale(0.1);
    this.musicOff.setDepth(2);
    this.musicOff.setVelocityX(300);
  
    const pauseResumeMusic = () => {
      if (this.musicBoss.isPlaying) {
        this.musicBoss.pause();
        this.musicOff.setTint(0xff0000); // Cambiar el color de la imagen al pausar la música
      } else {
        this.musicBoss.resume();
        this.musicOff.clearTint(); // Eliminar el color de la imagen al reanudar la música
      }
    };
  
    this.musicOff.on('pointerdown', pauseResumeMusic);
  
    // Manejo de eventos del teclado
    this.input.keyboard.on('keydown-M', () => {
      pauseResumeMusic();
    });
  
     // Crear el grupo de meteoros
    this.map = this.make.tilemap({ key: 'Nivel1' });
    const tileset = this.map.addTilesetImage('Escenario1', 'Escenario1');
    this.map.createLayer('background', tileset, 0, 0);

    const zoomFactor = 0.9;
    this.cameras.main.setZoom(zoomFactor);

    const { widthInPixels, heightInPixels } = this.map;
    this.physics.world.setBounds(0,0,widthInPixels, heightInPixels);

    const yOffset = 0;
    this.cameras.main.setScroll(0, yOffset);

     // Crea la nave

    this.meteoroGroup = this.physics.add.group();
    this.basuraGroup = this.physics.add.group();
    this.corazonGroup = this.physics.add.group();
    this.habilidad1Group = this.physics.add.group();
    this.habilidad2Group = this.physics.add.group();
    this.meteoritoSpawnTimer = 0;
   

    const naveX = 163.333333333333;
    const naveY = 510.666666666667;
    this.nave = new Nave(this, naveX + 120, naveY, this.meteoroGroup, this.basuraGroup, this.corazonGroup, this.habilidad1Group, this.habilidad2Group);
    this.cameras.main.startFollow(this.nave);
    this.cameras.main.setLerp(1, 0);
    this.cameras.main.setScroll(0, 40);
    // Luego crea el FinalBoss, pasando la referencia de la nave
    const jefeFinalX = this.cameras.main.width - 100; // Ajusta la posición X según lo necesites
    const jefeFinalY = this.cameras.main.height / 2; // Ajusta la posición Y según lo necesites
    this.FinalBoss = new FinalBoss(this, jefeFinalX, jefeFinalY, this.nave, this.disparoGroup, this);
    // Crear el grupo de meteoros
    

    //Habilidad1
    this.time.addEvent({
      delay: 10000, // 30 segundos
      loop: true,
      callback: () => {
        this.generarHabilidad1();
      },
      callbackScope: this
    });

     //Habilidad2
     this.time.addEvent({
      delay: 7000, // 7 segundos
      loop: true,
      callback: () => {
        this.generarHabilidad2();
      },
      callbackScope: this
    });

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        if (this.generarBasura) { // Verificar si se deben generar meteoritos
          this.generarImagen2();
        }
      },
      callbackScope: this
    });

    //GenerarCorazón
    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: () => {
        this.generarCorazon();
      },
      callbackScope: this
    });

    //generar meteorito
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
      .sprite(20500, spawnPoint.y, "Estrella") 
      .setScale(1)
      .setSize(40,1000);
    }
    this.physics.add.overlap(
      this.nave,
      this.exit,
      this.FinalBoss.morir,
      null,
      this
    );    
    // Colisión entre la nave y los meteoros del grupo
    this.physics.add.overlap(this.nave, this.meteoroGroup, this.handleCollision, null, this);
    this.physics.add.overlap(this.nave, this.corazonGroup, this.handleCollision, null, this);
    this.physics.add.overlap(this.nave, this.habilidad1Group, this.handleCollisionHabilidad1, null, this);
    this.physics.add.overlap(this.nave, this.habilidad2Group, this.handleCollisionHabilidad2, null, this); 
    this.physics.add.overlap(this.FinalBoss, this.disparoGroup, this.FinalBoss.handleCollisionDisparo, null, this); 
    this.physics.add.overlap(this.nave, this.basuraGroup, this.handleCollisionBasuraEspacial, null, this);
    this.physics.add.overlap(this.disparoGroup, this.basuraGroup, this.handleDisparoCollision, null, this);
  
    this.physics.add.overlap(this.disparoGroup, this.meteoroGroup, this.handleDisparoCollision, null, this);
    }

    handleCollisionHabilidad1(nave, habilidad1) {
      this.nave.habilidad1Activa = true; // Activar la habilidad 1
      habilidad1.disableBody(true, true); // Ocultar y desactivar la habilidad 1 colisionada
      
      // Realizar las acciones correspondientes a la habilidad 1
      // Por ejemplo, aumentar la velocidad de la nave en el eje Y
     // Aumentar la velocidad en 100 unidades en el eje Y
    }
    

    handleCollisionHabilidad2(nave, habilidad2) {
      this.nave.habilidad2Activa = true; // Activar la habilidad 2
      habilidad2.disableBody(true, true); // Ocultar y desactivar la habilidad 2 colisionada
      
      // Realizar las acciones correspondientes a la habilidad 2
      // Por ejemplo, aumentar la velocidad de los disparos de la nave
      this.nave.shootDelay = 200; // Reducir el tiempo de retardo entre disparos a 200 ms
    }
    
    handleCollisionBasuraEspacial(nave, basuraEspacial) {
      this.vidas--;
      basuraEspacial.disableBody(true, true);
      this.actualizarCorazones();
    
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

    handleDisparoCollision(disparo, objetoColisionado) {
      // Verificar si el objeto colisionado es un meteoro
      if (objetoColisionado.texture.key === 'meteorito') {
        // Aquí puedes definir cómo se maneja la colisión entre un disparo y un meteoro
        // Por ejemplo, puedes desactivar y ocultar ambos objetos
        disparo.disableBody(true, true);
        objetoColisionado.disableBody(true, true);
      }
    
      // Verificar si el objeto colisionado es la basura espacial
      if (objetoColisionado.texture.key === 'BasuraEspacial') {
        // Aquí puedes definir cómo se maneja la colisión entre un disparo y la basura espacial
        // Por ejemplo, puedes desactivar y ocultar ambos objetos
        disparo.disableBody(true, true);
        objetoColisionado.disableBody(true, true);
      }
    }
   generarCorazon() {const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(200, 300); // Velocidad aleatoria entre 200 y 300
    const sprite = this.corazonGroup.create(x, y, 'corazon').setDepth(2);
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
    const factorVelocidadY = -3; // Factor de velocidad en el eje Y
    sprite.setVelocityY(Phaser.Math.Between(100, 100) * factorVelocidadY); // Velocidad en el eje Y multiplicada por el factor
  
    // Propiedad 'vida' del corazón colisionado (cantidad de vidas que restaura)
    sprite.vida = 1;
  
    // Establecer la detección de límites superior e inferior con rebote
    sprite.body.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;
    sprite.body.bounce.set(1, 1); // Establecer el rebote en ambas direcciones (eje Y)
  
    // Controlar el rebote en el eje Y
    sprite.body.world.on('worldbounds', (body) => {
      if (body === sprite.body) {
        // Verificar si el límite alcanzado es el superior o inferior
        if (sprite.y <= 0 || sprite.y >= camera.height) {
          sprite.setVelocityY(-sprite.body.velocity.y); // Invertir la velocidad en el eje Y para rebote
        }
      }
    });
  }

  generarHabilidad1() {
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(200, 300); // Velocidad aleatoria entre 200 y 300
    const sprite = this.habilidad1Group.create(x, y, 'habilidad1').setDepth(2);
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
    const factorVelocidadY = -3; // Factor de velocidad en el eje Y
    sprite.setVelocityY(Phaser.Math.Between(100, 100) * factorVelocidadY); // Velocidad en el eje Y multiplicada por el factor
  
    // Establecer la detección de límites superior e inferior con rebote
    sprite.body.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;
    sprite.body.bounce.set(1, 1); // Establecer el rebote en ambas direcciones (eje Y)
  
    // Controlar el rebote en el eje Y
    sprite.body.world.on('worldbounds', (body) => {
      if (body === sprite.body) {
        // Verificar si el límite alcanzado es el superior o inferior
        if (sprite.y <= 0 || sprite.y >= camera.height) {
          sprite.setVelocityY(-sprite.body.velocity.y); // Invertir la velocidad en el eje Y para rebote
        }
      }
    });
  }

  generarHabilidad2() {
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = camera.scrollX + camera.width + offsetX; // Posición X ajustada
    const y = Phaser.Math.Between(camera.scrollY, camera.scrollY + camera.height); // Posición Y aleatoria dentro de la cámara
  
    const velocidadAleatoria = Phaser.Math.Between(200, 300); // Velocidad aleatoria entre 200 y 300
    const sprite = this.habilidad2Group.create(x, y, 'habilidad2').setDepth(2);
    sprite.setVelocityX(-velocidadAleatoria); // Establecer la velocidad hacia la izquierda
    const factorVelocidadY = -3; // Factor de velocidad en el eje Y
    sprite.setVelocityY(Phaser.Math.Between(100, 100) * factorVelocidadY); // Velocidad en el eje Y multiplicada por el factor
  
    // Establecer la detección de límites superior e inferior con rebote
    sprite.body.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;
    sprite.body.bounce.set(1, 1); // Establecer el rebote en ambas direcciones (eje Y)
  
    // Controlar el rebote en el eje Y
    sprite.body.world.on('worldbounds', (body) => {
      if (body === sprite.body) {
        // Verificar si el límite alcanzado es el superior o inferior
        if (sprite.y <= 0 || sprite.y >= camera.height) {
          sprite.setVelocityY(-sprite.body.velocity.y); // Invertir la velocidad en el eje Y para rebote
        }
      }
    });
  }  

  generarImagen2() {
    const finalBoss = this.FinalBoss; // Asigna el objeto FinalBoss a una variable local
  
    if (!finalBoss || !finalBoss.active) {
      // Si el FinalBoss no existe o no está activo, no generamos la imagen
      return;
    }
  
    const camera = this.cameras.main;
    const offsetX = 100; // Valor de desplazamiento hacia atrás en el eje X
  
    const x = finalBoss.x; // Posición X desde la posición actual del FinalBoss
    const y = finalBoss.y; // Posición Y desde la posición actual del FinalBoss
  
    const velocidadAleatoriaX = Phaser.Math.Between(400, 600); // Velocidad aleatoria entre 400 y 600 en el eje X  
    const sprite = this.basuraGroup.create(x, y, 'ballOfPower')
    sprite.setVelocityX(-velocidadAleatoriaX); // Establecer la velocidad hacia la izquierda
    sprite.setVelocityY(0); // Velocidad inicial en el eje Y (sin movimiento vertical)
  
    // Ajustar el tiempo para que el objeto desaparezca después de 4 segundos
    this.time.delayedCall(4000, () => {
      sprite.destroy(); // Eliminar el objeto después de 4 segundos
    });
  
    // Función para mover la basura espacial hacia la nave con un retraso
    const moveTowardsNave = () => {
      const directionX = this.nave.x - sprite.x;
      const directionY = this.nave.y - sprite.y;
  
      // Normalizar la dirección para obtener un vector de longitud 1
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      const directionXNormalized = directionX / length;
      const directionYNormalized = directionY / length;
  
      // Velocidad a la que seguirá a la nave
      const velocidadSeguimiento = 900;
  
      // Mover la basura espacial hacia la nave con el vector de dirección normalizado
      sprite.setVelocityX(velocidadSeguimiento * directionXNormalized);
      sprite.setVelocityY(velocidadSeguimiento * directionYNormalized);
    };
  
    // Retrasar el movimiento hacia la nave por 1 segundo
    this.time.delayedCall(50, moveTowardsNave);
  
    // Establecer la detección de límites superior e inferior con rebote
    sprite.body.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;
  
    // Controlar el rebote en el eje Y
    sprite.body.world.on('worldbounds', (body) => {
      if (body === sprite.body) {
        // Invertir la velocidad en el eje Y para rebote
        sprite.setVelocityY(-sprite.body.velocity.y);
      }
    });
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

  gameOver() {
    // Detener y eliminar todos los sonidos y música de la escena actual
    this.sound.stopAll();
    this.sound.removeAll();
    this.generarBasura = false;
    this.scene.start('GameOver');
  }

  update(time) {
    this.nave.update(time);
    this.FinalBoss.update(time);
    const cameraOffsetX = -500; // Desplazamiento horizontal desde la posición de la nave
    const cameraOffsetY = 0; // Desplazamiento vertical desde la posición de la nave
    this.cameras.main.setFollowOffset(cameraOffsetX, cameraOffsetY);
    if (this.FinalBoss.followX) {
      const targetX = this.nave.x + 1000
      this.FinalBoss.x += (targetX - this.FinalBoss.x) * 0.08;
    }
  
    // Seguir a la nave en el eje Y
    if (this.FinalBoss.followY) {
        const targetY = this.nave.y;
      this.FinalBoss.y += (targetY - this.FinalBoss.y) * 0.08;
    }
  }

  actualizarCorazones() {
    // Actualizar la imagen del corazón en función de la cantidad de vidas restantes
    if (this.vidas > 0) {
      // Mostrar la imagen del corazón
      this.corazonImage.setTexture('corazon');
    } else {
      // Mostrar la imagen del corazón sin vida
      this.corazonImage.setTexture('corazonSinVida');
    }
  
    // Actualizar el texto con la cantidad de vidas restantes
    this.vidasText.setText(this.vidas.toString());
  }

  handleCollision(nave, objeto) {
  if (objeto.texture.key === 'corazon') {
    // Sumar una vida
    this.vidas++;
    // Ocultar y desactivar el corazón colisionado
    objeto.disableBody(true, true);
    this.vidasText.setText(this.vidas.toString());
    // Salir de la función, ya que no es necesario hacer más acciones
    return;
  }

  if (objeto.texture.key === 'meteorito') {
    console.log('Colisión con meteoro');
    this.vidas--;
    objeto.disableBody(true, true);
    this.actualizarCorazones();
    this.vidasText.setText(this.vidas.toString());

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
    // Salir de la función, ya que no es necesario hacer más acciones con los disparos
    return;
    }
  }
}

//Mejor funcion del mundo:
//.setInteractive(this.imput.makePixelPerfect());