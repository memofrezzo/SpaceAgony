export default class FinalBoss extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, nave, disparoGroup) {
    super(scene, x, y, 'BossFinal');
    scene.add.existing(this);
    this.setScale(0.8);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);
    this.vidaMaxima = 1000;
    this.vidaActual = this.vidaMaxima;
    this.isInvulnerable = false;
    this.body.setCollideWorldBounds(true);
    this.followX = true;
    this.followY = true; // Agregar esta línea para que también siga a la nave en el eje Y
    this.sound = scene.sound;
    this.nave = nave;
    this.disparoGroup = disparoGroup
    this.disparoFinalBossGroup = scene.physics.add.group(); // Nuevo grupo para los disparos del jefe final
    this.barraDeVida1 = scene.add.image(x - 100, y + 170, 'VidaNave').setDepth(1);
    this.barraDeVida2 = scene.add.image(x - 100, y + 170, 'InteriorVidaNave').setDepth(2);
    this.winMusic = this.sound.add("winMusic");
    this.scene.time.addEvent({
      delay: 3000, // Disparar cada 3 segundos
      loop: true, // Hacer que se repita indefinidamente
      callback: this.ataqueBasico,
      callbackScope: this,
    });
  }

  update(time) {
  this.updateBar2Position()   
  this.barraDeVida1.x = this.x - 100;
  this.barraDeVida1.y = this.y + 170;
  this.barraDeVida2.x = this.x - 100;
  this.barraDeVida2.y = this.y + 170;
    // Resto del código de actualización del jefe final
    // ...
  }

  updateBar2Position() {
    // Calcula el ancho de la barra de vida proporcional a la vida actual
    let anchoBarra = (this.vidaActual / this.vidaMaxima) * this.barraDeVida2.width;

    // Actualiza el tamaño de la barra de vida
    this.barraDeVida2.setCrop(0, 0, anchoBarra, this.barraDeVida2.height);
  }

  handleCollisionDisparo = (jefe, disparo) => {
    disparo.disableBody(true, true);
  
    if (this.vidaActual === 0) {
      this.morir();
    }
  
    const danioPorcentaje = 50 / this.vidaMaxima;
    this.vidaActual -= this.vidaMaxima * danioPorcentaje;
  
    this.updateBar2Position();
    console.log(this.vidaActual)
  };

  morir() {
    // Reproducir sonido
    // Animación de explosión
    this.barraDeVida1.setVisible(false);
    this.barraDeVida2.setVisible(false);
    this.play('ExplosionNave');
    this.setScale(2); // Establecer la escala después de llamar a la animación
      this.winMusic.play();
    // Esperar 2 segundos
    this.scene.time.delayedCall(2700, () => {
      
      // Ir a pantalla de victoria
      this.scene.scene.start('Win');
  
    });
  }
  

  // Agrega aquí los diferentes ataques y patrones de ataque del jefe final
  // Puedes usar temporizadores y eventos para controlar la secuencia de ataques.

  // Ejemplo de un ataque básico

  
  // ...
  
  // Ejemplo de un ataque básico
  ataqueBasico() {
    // Implementa aquí la lógica para realizar un ataque básico del jefe final
    // Por ejemplo, crear proyectiles o lanzar ataques hacia el jugador.
    // Puedes utilizar la clase de disparos (disparoGroup) para generar los disparos del jefe.
  
    // Crear proyectil
    const proyectil = this.disparoGroup.create(this.x -200, this.y + 100, 'ballOfPower') .setDepth(5);
    if (proyectil) {
        const direccionX = this.nave.x - this.x;
        const direccionY = this.nave.y - this.y;
        const magnitud = Math.sqrt(direccionX * direccionX + direccionY * direccionY);
        const velocidadProyectil = 300; // Velocidad del proyectil en píxeles por segundo

        // Configurar la velocidad del proyectil en ambas direcciones (X e Y) hacia la nave
        proyectil.setVelocity(direccionX / magnitud * velocidadProyectil, direccionY / magnitud * velocidadProyectil);
  
      // Destrucción el disparo después de cierto tiempo para evitar la acumulación de disparos en el mundo
      this.scene.time.addEvent({
        delay: 2000, // Tiempo en milisegundos antes de destruir el disparo
        callback: () => {
          proyectil.destroy();
        },
      });
    }
    this.scene.physics.add.overlap(proyectil, this.disparoGroup, (proyectil, disparo) => {
    // Implementar aquí el efecto del disparo del jefe final sobre los disparos del jugador (por ejemplo, hacer que el disparo del jugador desaparezca)
    disparo.destroy();
  });

  // Evitar que el proyectil colisione con meteoros, habilidades y consigo mismo
  this.scene.physics.add.overlap(proyectil, this.meteoroGroup, () => {
  });
  this.scene.physics.add.overlap(proyectil, this.habilidad1Group, () => {
  });
  this.scene.physics.add.overlap(proyectil, this.habilidad2Group, () => {
  });

  // Detectar colisión con los disparos de la nave y hacer que desaparezcan
  this.scene.physics.add.overlap(proyectil, this.nave.disparoGroup, (proyectil, disparo) => {
    disparo.destroy();
  });
  }

  // Ejemplo de un ataque especial
  ataqueEspecial() {
    // Implementa aquí la lógica para realizar un ataque especial del jefe final
    // Este ataque puede tener mecánicas únicas y ser más poderoso que el ataque básico.
  }
}
