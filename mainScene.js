import Phaser from 'phaser';
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
        // Add background image preload here
    }

    create() {
        this.createNumberSprite();
        this.setUpTracingMechanism();

        // Add background image creation here

        // Add sprite to be shown when the user traces the number here

        this.currentNumber = this.pickRandomNumber();
        this.drawNumber(this.currentNumber);
    }

    createNumberSprite() {
        const canvasCenterX = this.game.config.width / 2;
        const canvasCenterY = this.game.config.height / 2;
        this.numberSprite = this.add.text(canvasCenterX, canvasCenterY, '', {
            font: '500px Arial',
            fill: '#808080',
            stroke: '#808080',
            strokeThickness: 10,
            align: 'center'
        });
        this.numberSprite.setOrigin(0.5);
        this.numberSprite.setInteractive();
    }

    drawNumber(number) {
        this.numberSprite.setText(number.toString());

        // Update the image data and gray pixel count after a short delay
        setTimeout(() => {
            this.originalImageData = getImageData(this.game.canvas, this.numberSprite);
            this.originalGrayPixels = countGrayPixels(this.originalImageData);
        }, 10);
    }

    checkTracing() {
        const tracedImageData = getImageData(this.game.canvas, this.numberSprite);
        const remainingGrayPixels = countGrayPixels(tracedImageData);
        const tracedPixels = countTracedPixels(tracedImageData);

        const tracedPercentage = 1 - remainingGrayPixels / this.originalGrayPixels;
        const extraTracingPercentage = tracedPixels / this.originalGrayPixels;

        const tracingThreshold = 0.7;
        const extraTracingThreshold = 2;

        return tracedPercentage > tracingThreshold && extraTracingPercentage < extraTracingThreshold;
    }

    pickRandomNumber() {
        return Math.floor(Math.random() * 10) + 1;
    }

    setUpTracingMechanism() {
        this.numberSprite.on('pointerdown', (pointer) => {
            this.isDrawing = true;
            this.graphics = this.add.graphics();
            this.graphics.lineStyle(50, 0x0000ff, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(pointer.x, pointer.y); // Move to the starting position
        });

        this.numberSprite.on('pointermove', (pointer) => {
            if (!this.isDrawing) return;
            this.graphics.lineTo(pointer.x, pointer.y);
            this.graphics.strokePath();
        });

        this.numberSprite.on('pointerup', () => {
            this.isDrawing = false;
            // Check if the user traced the number correctly
            if (this.checkTracing()) {
                alert('Good job!');
                this.currentNumber = this.pickRandomNumber();
                this.drawNumber(this.currentNumber);
            }
            this.graphics.destroy(); // Destroy the graphics object
            this.graphics = null; // Set the graphics object to null to free up memory
        });
    }

    // Add functions to update and display score here
}