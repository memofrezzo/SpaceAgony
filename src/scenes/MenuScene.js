export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Fondo del menú

    // Logo Principal
    let logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'Logo').setOrigin(0.5);
    logo.setInteractive();
    
    logo.on('pointerover', function () {
      logo.setScale(1.1);
    });
    
    logo.on('pointerout', function () {
      logo.setScale(1);
    });

    logo.on('pointerup', function () {
      this.scene.start('Nivel1'); 
    }, this);

    //controles
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 260, 'Controls').setOrigin(0.5).setScale(0.65);

    // Icono de GitHub
    let Github = this.add.image(this.cameras.main.centerX -400, this.cameras.main.centerY + 250, 'Github').setOrigin(0.5);
    Github.setInteractive();
    Github.on('pointerover', function () {
      Github.setScale(1.2);
    });

    Github.on('pointerout', function () {
      Github.setScale(1);});

    Github.on('pointerup', function () {
        // Acción al hacer clic en el icono de GitHub
        window.open('https://memofrezzo.github.io/Portfolio-2023-Alain/', '_blank');
      });

      let Circulo = this.add.image(this.cameras.main.centerX +400, this.cameras.main.centerY + 250, 'Circulo').setOrigin(0.5);
      Circulo.setInteractive();
      Circulo.on('pointerover', function () {
        Circulo.setScale(1.2);
      });

      Circulo.on('pointerout', function () {
        Circulo.setScale(1);});
    
      //Donaciones
      let Donaciones = this.add.image(this.cameras.main.centerX +400, this.cameras.main.centerY + 250, 'Donaciones').setOrigin(0.5);
      Donaciones.setInteractive();
      Donaciones.on('pointerover', function () {
        Donaciones.setScale(1.2);
      });
      Donaciones.on('pointerout', function () {
        Donaciones.setScale(1);});
      
      }    

  startGame() {
    // Aquí puedes cargar la escena del juego principal
  }

  showOptions() {
    // Aquí puedes cargar la escena de opciones
  }

  showCredits() {
    // Aquí puedes cargar la escena de créditos
  }

  openGitHub() {
    window.open('https://memofrezzo.github.io/Portfolio-2023-Alain/', '_blank');
  }

  showControls() {
    // Aquí puedes mostrar los controles del juego
  }
}