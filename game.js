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
    
    let isDrawing = false;
    let currentNumber = 0;
    
    function preload() {
    }
    
    function create() {
    const canvasCenterX = game.config.width / 2;
    const canvasCenterY = game.config.height / 2;
    let numberSprite = this.add.text(canvasCenterX, canvasCenterY, '', {
        font: '500px Arial',
        fill: '#808080',
        stroke: '#808080',
        strokeThickness: 10,
        align: 'center'
    });
numberSprite.setOrigin(0.5);
numberSprite.setInteractive();

// Store the original image data and gray pixel count for later use
let originalImageData;
let originalGrayPixels;

function drawNumber(number, scene) {
    numberSprite.setText(number.toString());

    console.log(scene, 'scene')

    // game.scene.events.add(10, () => {
    //     // Update the image data and gray pixel count after a short delay
    //     originalImageData = getImageData(numberSprite);
    //     originalGrayPixels = countGrayPixels(originalImageData);
    // });    
}

function getImageData(sprite) {
    return game.canvas.getContext('2d').getImageData(0, 0, game.canvas.width, game.canvas.height);
}

function countGrayPixels(imageData) {
    let count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 128 && imageData.data[i + 1] === 128 && imageData.data[i + 2] === 128) {
            count++;
        }
    }
    return count;
}

function countTracedPixels(imageData) {
    let count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 255) {
            count++;
        }
    }
    return count;
}

function checkTracing() {
    const tracedImageData = getImageData(numberSprite);
    const remainingGrayPixels = countGrayPixels(tracedImageData);
    const tracedPixels = countTracedPixels(tracedImageData);

    const tracedPercentage = 1 - remainingGrayPixels / originalGrayPixels;
    const extraTracingPercentage = tracedPixels / originalGrayPixels;

    const tracingThreshold = 0.7;
    const extraTracingThreshold = 2;

    console.log(tracedPercentage, extraTracingPercentage)

    return tracedPercentage > tracingThreshold && extraTracingPercentage < extraTracingThreshold;
}

function pickRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

let graphics;

numberSprite.on('pointerdown', (pointer) => {
    isDrawing = true;
    graphics = this.add.graphics();
    graphics.lineStyle(50, 0x0000ff, 1);
    graphics.beginPath();
    graphics.moveTo(pointer.x, pointer.y); // Move to the starting position
});

numberSprite.on('pointermove', (pointer) => {
    if (!isDrawing) return;
    graphics.lineTo(pointer.x, pointer.y);
    graphics.strokePath();
});

numberSprite.on('pointerup', () => {
    isDrawing = false;
    // Check if the user traced the number correctly
    if (checkTracing()) {
        alert('Good job!');
        currentNumber = pickRandomNumber();
        drawNumber(currentNumber, this.scene);
    }
    graphics.destroy(); // Destroy the graphics object
    graphics = null; // Set the graphics object to null to free up memory
});


currentNumber = pickRandomNumber();
drawNumber(currentNumber, this.game.scene);
    }
