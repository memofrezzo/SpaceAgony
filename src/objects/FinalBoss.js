export default class FinalBoss extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'BossFinal');
    scene.add.existing(this);
    this.setScale(0.8);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);

    this.vidaMaxima = 1000;
    this.vidaActual = this.vidaMaxima;
    this.isInvulnerable = false;
    this.barraDeSalud = scene.add.graphics();

    this.body.setCollideWorldBounds(true);
    this.followX = true;
    this.followY = true; // Agregar esta línea para que también siga a la nave en el eje Y
  }

  update(time) {
  this.x = nave.x - (camera.width / 2) + (this.width / 2);

  // Seguir a la nave en Y
  this.y = nave.y;

    if (this.followX) {
      this.x = this.scene.nave.x; // Corregir aquí, usar this.scene.nave.x
    }

    if (this.followY) {
      this.y = this.scene.nave.y; // Corregir aquí, usar this.scene.nave.y
    }

    this.updateBarPosition();
    // Resto del código de actualización del jefe final
    // ...
  }

  updateBarPosition() {
    // Calcula el ancho de la barra de salud proporcional a la vida actual
    const anchoBarra = (this.vidaActual / this.vidaMaxima) * 200;

    // Dibuja la barra de salud en la pantalla
    this.barraDeSalud.clear();
    this.barraDeSalud.fillStyle(0xff0000); // Color rojo
    this.barraDeSalud.fillRect(this.x - 100, this.y - 50, anchoBarra, 10);
  }

  handleCollisionDisparo = (jefe, disparo) => {
    disparo.disableBody(true, true);
  
    if (this.vidaActual <= 0) {
      this.morir();
    }
  
    const danioPorcentaje = 50 / this.vidaMaxima;
    this.vidaActual -= this.vidaMaxima * danioPorcentaje;
  
    this.updateBarPosition();
    console.log(this.vidaActual)
  };

  morir() {
    // Reproducir sonido
    this.scene.sound.play('winMusic');
  
    // Animación de explosión
    this.play('ExplosionNave');
    this.setScale(2); // Establecer la escala después de llamar a la animación
  
    // Esperar 2 segundos
    this.scene.time.delayedCall(2000, () => {
  
      // Ir a pantalla de victoria
      this.scene.scene.start('Win');
  
    });
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
