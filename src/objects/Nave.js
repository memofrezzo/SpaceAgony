export default class Nave extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, meteoroGroup, corazonGroup) {
      super(scene, x, y, "Nave2");
  
      scene.add.existing(this);
      scene.physics.world.enable(this);
  
     // this.body.setGravityY(0);
      this.body.setCollideWorldBounds(true);
      this.body.setVelocityX(300);
      this.setScale(0.45);
      this.isShooting = false;
      this.shootDelay = 400;
      this.lastShootTime = 400;
      this.corazonGroup = corazonGroup; 
      this.meteoroGroup = meteoroGroup; // Asignar el grupo de meteoros
      this.on('muerteNave', () => {
        this.desactivarNave();
      });
    }
  
    // Resto del código de la clase Nave
  
    restarVida() {
      this.vidas--;
      if (this.vidas <= 0) {
        this.emit('muerteNave'); // Emitir el evento de muerte de la nave
      }
    }


  
    update(time) {
      const teclas = this.scene.input.keyboard.createCursorKeys();
      const camera = this.scene.cameras.main;
  
      if (this.habilidad1Activa) {
        // Velocidad más rápida cuando la habilidad1 está activa
        if (teclas.up.isDown && this.y > camera.y) {
          this.body.velocity.y = -600; // Velocidad hacia arriba más rápida
        } else if (teclas.down.isDown && this.y < camera.y + camera.height) {
          this.body.velocity.y = 600; // Velocidad hacia abajo más rápida
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
      else {
        // Velocidad normal sin la habilidad1 activa
        if (teclas.up.isDown && this.y > camera.y) {
          this.body.velocity.y = -400; // Velocidad hacia arriba normal
        } else if (teclas.down.isDown && this.y < camera.y + camera.height) {
          this.body.velocity.y = 400; // Velocidad hacia abajo normal
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
  }
    shoot() {
      this.scene.sound.play('shot', { volume: 0.9 }); // Ajusta el volumen según tus necesidades

      // Crear y configurar el disparo
      const disparo = this.scene.disparoGroup.create(this.x + 15, this.y + 1, 'Disparo');
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

  
    blinkNave() {
      this.setVisible(false);
  
      const blinkInterval = setInterval(() => {
        this.setVisible(!this.visible);
      }, 200);
  
      this.scene.time.delayedCall(2000, () => {
        clearInterval(blinkInterval);
        this.setVisible(true);
      }, this);
    }
  }