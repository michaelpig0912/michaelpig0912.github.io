const canvas = document.getElementById('touchArea');
const ctx = canvas.getContext('2d');
const clearCanvasButton = document.getElementById('clearCanvasButton');

const eventTypeSpan = document.getElementById('eventType');
const touchCountSpan = document.getElementById('touchCount');
const coordXSpan = document.getElementById('coordX');
const coordYSpan = document.getElementById('coordY');

let drawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas dimensions based on its styled size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#e74c3c'; // Drawing color
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas); // Adjust canvas if window is resized

clearCanvasButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    eventTypeSpan.textContent = '-';
    touchCountSpan.textContent = '0';
    coordXSpan.textContent = '-';
    coordYSpan.textContent = '-';
});

// Mouse Event Listeners (for desktop testing)
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    updateInfo('mousedown', 1, e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        draw(e.offsetX, e.offsetY);
        updateInfo('mousemove', 1, e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    updateInfo('mouseup', 0, lastX, lastY);
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
    updateInfo('mouseout', 0, lastX, lastY);
});

// Touch Event Listeners
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling/default touch actions
    drawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    updateInfo('touchstart', e.touches.length, lastX, lastY);
    // For multi-touch, you might want to iterate e.touches
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (drawing) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        draw(currentX, currentY);
        updateInfo('touchmove', e.touches.length, currentX, currentY);
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    drawing = false;
    updateInfo('touchend', e.touches.length, lastX, lastY);
});

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    drawing = false;
    updateInfo('touchcancel', e.touches.length, lastX, lastY);
});

function draw(x, y) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

function updateInfo(type, count, x, y) {
    eventTypeSpan.textContent = type;
    touchCountSpan.textContent = count;
    coordXSpan.textContent = x !== undefined ? x.toFixed(2) : '-';
    coordYSpan.textContent = y !== undefined ? y.toFixed(2) : '-';
}

console.log("touch script loaded"); 