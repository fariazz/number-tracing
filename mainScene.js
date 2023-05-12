import {
    getImageData,
    countGrayPixels,
    countTracedPixels
} from './utility.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.isDrawing = false;
        this.currentNumber = 0;
        this.numberSprite = null;
        this.graphics = null;
    }

    preload() {
        this.load.image('digger', 'digger.png');
        this.load.image('background0', 'background0.jpg');
        this.load.image('background1', 'background1.jpg');
        this.load.image('background2', 'background2.jpg');
        this.load.image('background3', 'background3.jpg');
        this.load.image('background4', 'background4.jpg');
        this.load.image('background5', 'background5.jpg');
        this.load.image('background6', 'background6.jpg');
        this.load.image('background7', 'background7.jpg');
        this.load.image('background8', 'background8.jpg');
        this.load.image('background9', 'background9.jpg');
        this.load.audio('diggerSound', 'digger.wav');
        this.load.audio('winSound', 'win.mp3');
    }

    create() {
        this.createNumberSprite();
        this.setUpTracingMechanism();

        // Add background image creation here
        this.backgroundImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background1'); // Replace 'background' with the key of your background image
        this.backgroundImage.setOrigin(0.5, 0.5); // Set the origin to the top-left corner (optional)
        this.backgroundImage.setScale(0.8); // Adjust the scale of the background image (optional)
        this.backgroundImage.setDepth(-1);

        // Add sprite to be shown when the user traces the number here
        this.cursorSprite = this.add.sprite(0, 0, 'digger'); // Replace 'spriteKey' with your actual sprite key
        this.cursorSprite.setScale(0.1);
        this.cursorSprite.setVisible(false); // Initially hide the sprite
        this.cursorSprite.setDepth(1);

        this.cursorSound = this.sound.add('diggerSound', {
            loop: true
        });

        this.winSound = this.sound.add('winSound');

        this.currentNumber = this.pickRandomNumber();
        this.drawNumber(this.currentNumber);

        // Create a restart button
        const restartButton = this.add.text(20, 10, 'RESTART', {
            font: '20px Arial',
            fill: '#fff',
            stroke: '#fff',
            align: 'left'
        });
        restartButton.setDepth(2)
        restartButton.setInteractive(); // Enable interactivity for the button

        // Add a click event listener to the button
        restartButton.on('pointerdown', () => {
            this.restartGame();
        });

        const textBackground = this.add.graphics();
        textBackground.fillStyle(0xc55add, 1); // Set the background color and transparency
        textBackground.fillRect(
            restartButton.x - 10, // Adjust the padding around the text
            restartButton.y - 5,
            restartButton.width + 20,
            restartButton.height + 10
        );

    }

    restartGame() {
        // Custom logic to restart the game
        // Reset game state, positions, scores, etc.
        // ...

        // Restart the scene or game
        this.scene.restart(); // Use `this.scene.start(sceneKey)` if you want to start a specific scene
    }

    createNumberSprite() {
        const canvasCenterX = this.game.config.width / 2;
        const canvasCenterY = this.game.config.height / 2;

        const background = this.add.graphics();
        background.fillStyle(0x000000, 0.4);
        const width = 280;
        const height = 400;

        background.fillRect(
            canvasCenterX - width / 2,
            canvasCenterY - height / 2,
            width,
            height
        );

        this.numberSprite = this.add.text(canvasCenterX, canvasCenterY, '', {
            font: '400px Arial',
            fill: '#808080',
            stroke: '#808080',
            strokeThickness: 10,
            align: 'center'
        });
        this.numberSprite.setOrigin(0.5);
        this.numberSprite.setInteractive();
    }

    drawNumber(number) {
        let newNumber = number.toString();
        this.numberSprite.setText(newNumber);
        this.backgroundImage.setTexture(`background${newNumber}`)

        this.time.delayedCall(50, () => {
            this.originalImageData = getImageData(this.game.canvas, this.numberSprite);
            this.originalGrayPixels = countGrayPixels(this.originalImageData);
        });
    }

    checkTracing() {
        const tracedImageData = getImageData(this.game.canvas, this.numberSprite);
        const remainingGrayPixels = countGrayPixels(tracedImageData);
        const tracedPixels = countTracedPixels(tracedImageData);

        const tracedPercentage = 1 - remainingGrayPixels / this.originalGrayPixels;
        const extraTracingPercentage = tracedPixels / this.originalGrayPixels;

        console.log(tracedPercentage, extraTracingPercentage)

        const tracingThreshold = 0.8;
        const extraTracingThreshold = 2;

        return tracedPercentage > tracingThreshold && extraTracingPercentage < extraTracingThreshold;
    }

    pickRandomNumber() {
        return Math.floor(Math.random() * 9) + 0;
    }

    setUpTracingMechanism() {
        this.numberSprite.on('pointerdown', (pointer) => {
            if (this.isWinning) return;

            this.isDrawing = true;

            this.cursorSprite.setVisible(true);
            this.cursorSound.play();

            if (!this.graphics)
                this.graphics = this.add.graphics();

            this.graphics.lineStyle(50, 0x0000ff, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(pointer.x, pointer.y); // Move to the starting position
        });

        this.numberSprite.on('pointermove', (pointer) => {
            if (this.isWinning) return;
            if (!this.isDrawing) return;
            this.graphics.lineTo(pointer.x, pointer.y);
            this.graphics.strokePath();

            if (this.input.activePointer.isDown) {
                this.cursorSprite.setPosition(pointer.x, pointer.y); // Update the sprite position based on the pointer position
            }
        });

        this.numberSprite.on('pointerup', () => {
            if (this.isWinning) return;

            this.isDrawing = false;
            

            this.cursorSprite.setVisible(false);
            this.cursorSound.pause();

            // Check if the user traced the number correctly
            if (this.checkTracing()) {
                this.isWinning = true;
                this.winSound.play();

                this.winSound.once('complete', () => {
                    this.isWinning = false;
                    this.graphics.destroy();
                    this.graphics = null;

                    this.currentNumber = this.pickRandomNumber();
                    this.drawNumber(this.currentNumber);
                });


            }

        });
    }

    // Add functions to update and display score here
}