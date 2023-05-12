import {
    MainScene
} from './mainScene.js';

const config = {
    width: Math.min(window.innerWidth * 0.8, 800),
    height: Math.min(window.innerHeight * 0.8, 800),
    canvas: document.getElementById('gameCanvas'),
    type: Phaser.CANVAS,
    scene: [MainScene],
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    }
};

const game = new Phaser.Game(config);