export default class FinalBoss extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, nave, disparoGroup, nivel2Instance) {
    super(scene, x, y, 'BossFinal');
    scene.add.existing(this);
    this.setScale(0.8);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);
    this.vidaMaxima = 2000;
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
    //this.winMusic = this.sound.add("winMusic");
    this.nivel2Instance = nivel2Instance;
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
     // this.winMusic.play();
    this.nivel2Instance.generarBasura = false;
    this.scene.time.delayedCall(2000, () => {
      
      // Ir a pantalla de victoria
      this.scene.scene.start('Win');
  
    });
  }
  

  // Agrega aquí los diferentes ataques y patrones de ataque del jefe final
  // Puedes usar temporizadores y eventos para controlar la secuencia de ataques.

  // Ejemplo de un ataque básico

  
  // ...

}
