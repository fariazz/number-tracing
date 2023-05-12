import {
    MainScene
} from './mainScene.js';

const config = {
    width: Math.min(window.innerWidth * 0.8, 800),
    height: Math.min(window.innerHeight * 0.8, 800),
    canvas: document.getElementById('gameCanvas'),
    type: Phaser.CANVAS,
    scene: [MainScene],
    pixelArt: true
};

const game = new Phaser.Game(config);