const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables
const canvas = document.createElement('canvas')
canvas.id = 'canvas';
const context = canvas.getContext('2d') //2d allows methods associated with canvas:
//rect, fill, etc.
let currentSize = 10; //brush size
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
    if(brushSlider.value < 10){
        brushSize.textContent = `0${brushSlider.value}`;
    }else{
        brushSize.textContent = brushSlider.value;
    }
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
    currentSize = brushSlider.value;
    displayBrushSize()
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {
    //change event vs click event 
    bucketColor = `#${bucketColorBtn.value}`;
    createCanvas() //recreate canvas with new bucket color
    restoreCanvas(); //if we want to reset background color and not lose drawing
});

// // Eraser
eraser.addEventListener('click', () => {
    isEraser = true;
    brushIcon.style.color = 'white'; //inactive button
    eraser.style.color = 'black'; //active button
    activeToolEl.textContent = 'Eraser';
    currentColor = bucketColor;//brush is basically painting with background color
    currentSize = 50;
});

// // Switch back to Brush
function switchToBrush() {
    isEraser = false;
    activeToolEl.textContent = 'Brush';
    brushIcon.style.color = 'black';
    eraser.style.color = 'white';
    currentColor = `#${brushColorBtn.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
}

// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50; //50px tool bar that we want to avoid
    context.fillStyle = bucketColor;
    context.fillRect(0, 0, canvas.width, canvas.height); //create reactangle to take up entire canvas space
    body.appendChild(canvas);
    switchToBrush() // by default brush is selected
}

// // Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas(); //start with fresh canvas with current bucket color
  drawnArray = []; //reset drawn array
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// // Draw what is stored in DrawnArray
function restoreCanvas() { //to switch background colors without losing drawing on top
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round'; //draw with rounded lines
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);//redraw
    context.stroke();//redraw the line
  }
}

// // Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  console.log(line);
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left, //x and 
    y: event.clientY - boundaries.top,  //y coordinates
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);

  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
  console.log('mouse is unclicked');
});

// // Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
    //save drawnarray into local storage as a string (local storage only saves in string)
    //name it when you set it
    localStorage.setItem('savedCanvas', JSON.stringify(drawnArray)) 
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  setTimeout(switchToBrush, 1500);
});

// // Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    //parse from string back into objct
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    //throw up canvas loaded for 1500ms before switching back to brush
    setTimeout(switchToBrush, 1500);
  }else{
    activeToolEl.textContent = 'No Canvas Found';
    setTimeout(switchToBrush, 1500);
  }

});

// // Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
    localStorage.removeItem('savedCanvas')
    // Active Tool
    activeToolEl.textContent = 'Storage Cleared';
    setTimeout(switchToBrush, 1500);
});

// // Download Image

downloadBtn.addEventListener('click', () => {
    //html canvas method to save canvas as image file
    //anchor element wraps around download button
    downloadBtn.href = canvas.toDataURL('image/jpeg', 1.0)
    downloadBtn.download = 'paint-exmaple.jpeg' //name file we are downloading
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  setTimeout(switchToBrush, 1500);
});

// // Event Listener
brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
