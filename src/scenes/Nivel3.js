export default class Nivel3 extends Phaser.Scene {
    // escena para optimiozar tiempos
    // carga el preload solo una vez y sirve para todo el juego
    constructor() {
      // key of the scene
      super("Nivel3");
    }

  create() {
    // Play music
    this.music = this.sound.add('musica1');
    this.music.play();
    
    // Create ship
    this.ship = this.physics.add.sprite(100, 100, 'Nave2');

    // Enable acceleration/deceleration
    this.ship.setMaxVelocity(200);

    // Create enemy group
    this.enemies = this.physics.add.group({
      key: 'Enemie1',
      repeat: 10,
      setXY: { x: 900, y: 100, stepX: 70 }
    });

    // Create star group
    this.stars = this.physics.add.group({
      key: 'Estrella',
      repeat: 20,
      setXY: {x: 400, y: 0, stepX: 70, stepY: 20} 
    });
    
    // Colliders
    this.physics.add.collider(this.ship, this.enemies, this.hitEnemy, null, this);
    this.physics.add.collider(this.ship, this.stars, this.resetShip, null, this);

    // Bullets
    this.bullets = this.physics.add.group();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    // Ship movement
    if(this.cursors.left.isDown) {
      this.ship.setAccelerationX(-500);
    } else if (this.cursors.right.isDown) {
      this.ship.setAccelerationX(500);
    } else {
      this.ship.setAccelerationX(0); 
    }
    
    // Firing
    if(this.fireButton.isDown) {
      this.fireBullet();
    }

    // Enemy movement
    this.enemies.children.iterate(child => {
      child.x -= 3;
      if(child.x < -50) {
        child.x = 850;
      }
    });
    
    // Bullet movement
    this.bullets.children.each(child => {
      child.x += 8;
      if(child.x > 900) {
        child.destroy(); 
      } 
    });
  }

  fireBullet() {
    // Get bullet from pool
    let bullet = this.bullets.getFirstDead();
    if(bullet) {
      bullet.x = this.ship.x;
      bullet.y = this.ship.y;
      bullet.setActive(true);
      bullet.setVisible(true);
      this.sound.play('fire'); // Fire sfx
    }
  }

  hitEnemy(ship, enemy) {
    // Explosion sfx
    this.sound.play('winMusic');  
    this.resetShip();
  }

  resetShip() {
    this.ship.x = 100;
    this.ship.y = 100; 
    this.ship.setVelocity(0);
  }

}
