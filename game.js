const config = {
    width: Math.min(window.innerWidth * 0.8, 800),
    height: Math.min(window.innerHeight * 0.8, 800),
    canvas: document.getElementById('gameCanvas'),
    type: Phaser.CANVAS,
    scene: {
        preload: preload,
        create: create
    }
    };
    
    const game = new Phaser.Game(config);