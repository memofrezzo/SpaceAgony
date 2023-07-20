export default class FinalBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'FinalBoss'); //  es el nombre del spritesheet del jefe final
  
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      // Propiedades del jefe final
      this.vidaMaxima = 1000;
      this.vidaActual = this.vidaMaxima;
      this.isInvulnerable = false; // Para evitar recibir daño mientras realiza ciertas acciones
  
      // Animaciones del jefe final
      scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('FinalBoss', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      // Agregar la barra de salud del jefe final
      this.barraDeSalud = scene.add.graphics();
      this.actualizarBarraDeSalud();
  
      // Configurar colisiones y rebote con el mundo
      this.setCollideWorldBounds(true);
      this.setBounce(1, 1);
    }

    update() {
        // Implementar el comportamiento del jefe final en cada fotograma
    
        // Verificar colisiones con los disparos de la nave
        scene.physics.overlap(this, scene.disparoGroup, this.handleCollisionDisparo, null, this);
    
        // Otros comportamientos del jefe final
        // ...
      }
    
      handleCollisionDisparo(jefe, disparo) {
        // Aquí definimos lo que ocurre cuando el jefe final colisiona con un disparo
        disparo.disableBody(true, true); // Desactivar y ocultar el disparo
        jefe.health -= 10; // Disminuir la salud del jefe
    
        if (jefe.health <= 0) {
          // Aquí definimos lo que ocurre cuando la salud del jefe llega a cero
          // Por ejemplo, iniciar una animación de derrota, mostrar un mensaje, etc.
        }
      }
  
    recibirDanio(danio) {
      if (!this.isInvulnerable) {
        this.vidaActual -= danio;
  
        // Actualizar la barra de salud
        this.actualizarBarraDeSalud();
  
        if (this.vidaActual <= 0) {
          this.morir();
        }
      }
    }
  
    actualizarBarraDeSalud() {
      // Calcula el ancho de la barra de salud proporcional a la vida actual
      const anchoBarra = (this.vidaActual / this.vidaMaxima) * 200;
  
      // Dibuja la barra de salud en la pantalla
      this.barraDeSalud.clear();
      this.barraDeSalud.fillStyle(0xff0000); // Color rojo
      this.barraDeSalud.fillRect(this.x - 100, this.y - 50, anchoBarra, 10);
    }
  
    morir() {
      // Aquí puedes definir lo que sucede cuando el jefe final es derrotado
      // Por ejemplo, reproducir una animación de muerte y dar una recompensa al jugador.
      this.setActive(false).setVisible(false);
      this.barraDeSalud.clear(); // Limpiar la barra de salud para que no se muestre después de la muerte.
    }
  
    // Agrega aquí los diferentes ataques y patrones de ataque del jefe final
    // Puedes usar temporizadores y eventos para controlar la secuencia de ataques.
  
    // Ejemplo de un ataque básico
    ataqueBasico() {
      // Implementa aquí la lógica para realizar un ataque básico del jefe final
      // Por ejemplo, crear proyectiles o lanzar ataques hacia el jugador.
    }
  
    // Ejemplo de un ataque especial
    ataqueEspecial() {
      // Implementa aquí la lógica para realizar un ataque especial del jefe final
      // Este ataque puede tener mecánicas únicas y ser más poderoso que el ataque básico.
    }
  }
  