const canvas = document.getElementById('gameCanvas');
setCanvasDimensions();
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentNumber = 0;

function setCanvasDimensions() {
    const width = Math.min(window.innerWidth * 0.8, 800);
    const height = Math.min(window.innerHeight * 0.8, 800);
    canvas.width = width;
    canvas.height = height;
  }

function pickRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

let originalImageData;
let originalGrayPixels;

function drawNumber(number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'gray';
    ctx.fillStyle = 'gray';
    ctx.font = '500px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle"; // set text in center of place vertically

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    ctx.strokeText(number.toString(), canvasCenterX, canvasCenterY);
    ctx.fillText(number.toString(), canvasCenterX, canvasCenterY);

    // Store the original image data and gray pixel count for later use
    originalImageData = getImageData();
    originalGrayPixels = countGrayPixels(originalImageData);
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.strokeStyle = 'blue'; 
  ctx.lineWidth = 50;
  
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  // Check if the user traced the number correctly
  if (checkTracing()) {
    alert('Good job!');
    currentNumber = pickRandomNumber();
    drawNumber(currentNumber);
  } 
});

function getImageData() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
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
      
    const tracedImageData = getImageData();
    const remainingGrayPixels = countGrayPixels(tracedImageData);
    const tracedPixels = countTracedPixels(tracedImageData);
  
    const tracedPercentage = 1 - remainingGrayPixels / originalGrayPixels;
    const extraTracingPercentage = tracedPixels / originalGrayPixels;
    
    console.log(tracedPercentage, extraTracingPercentage)

    const tracingThreshold = 0.7;
    const extraTracingThreshold = 2;
  
    return tracedPercentage > tracingThreshold && extraTracingPercentage < extraTracingThreshold;
  }

currentNumber = pickRandomNumber();
drawNumber(currentNumber);
