export function getImageData(canvas, sprite) {
    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  }
  
  export function countGrayPixels(imageData) {
    let count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 255) {
            count++;
        }
    }
    return count;
  }
  
  export function countTracedPixels(imageData) {
    let count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 128 && imageData.data[i + 1] === 128 && imageData.data[i + 2] === 128) {
            count++;
        }
    }
    return count;
  }