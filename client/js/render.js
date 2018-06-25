var canvas;
var canvasCtx;

var __spriteMap = {}

function loadSpriteSafe (path) {
    if (__spriteMap[path]) {
        return __spriteMap[path];
    } else {
        return loadSprite(path);
    }
}

function loadSprite (path) {
    let img = new Image();
    img.src = path;
    __spriteMap[path] = img;

    return img;
}

function initCanvas () {
    canvas = document.getElementById('canvas');
    canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = 'rgba(16, 16, 16, 1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBox (x, y, wd, hg, color={r: 0, g: 0, b: 0, a: 1}) {
    canvasCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    canvasCtx.fillRect(x, canvas.height-y-hg, wd, hg);
}

function drawTile (path, x, y, wd, hg) {
    canvasCtx.drawImage(this.loadSpriteSafe(path), x, y, wd, hg);
}

function render (board) {
    requestAnimationFrame(render.bind(this, board));

    canvasCtx.fillStyle = 'rgba(16, 16, 16, 1)';

    // NOTE: draw order is very important (obvi)

    // 1. draw background

    // 2. draw tiles
    board.Render(canvasCtx);

    // 3. draw items

    // 4. draw players

    // 5. draw effects

    // 6. draw tooltips

    // 7. draw hud

    // 8. draw menus
}
