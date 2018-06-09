function initCanvas () {
    let canvas = document.getElementById('canvas');
    let canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = 'rgba(240, 240, 240, 1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    return {
        canvas,
        canvasCtx,
    };
}
