import Preload from "./src/scenes/Preload.js";
import Nivel1 from "./src/scenes/Nivel1.js";
import nivel2 from "./src/scenes/nivel2.js";
import Nivel3 from "./src/scenes/Nivel3.js";
import MenuScene from "./src/scenes/MenuScene.js";
import GameOver from "./src/scenes/GameOver.js";
import Win from "./src/scenes/Win.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1421,
  height: 880,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: false
    }
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preload, MenuScene, Nivel1, nivel2, Nivel3, GameOver, Win],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);