import {CTX} from "./canvas.js";

export function drawBubble(x, y, w, h, radius, text) {
    const padding = 10;
    const lineHeight = 20;

    CTX.beginPath();
    CTX.fillStyle = '#a2a2a6';
    CTX.strokeStyle = 'black';
    CTX.lineWidth = '3';

    CTX.moveTo(x + radius, y + h);
    CTX.lineTo(x + radius / 2, y + h + 10);
    CTX.lineTo(x + radius * 2, y + h);

    CTX.lineTo(x + w - radius, y + h);
    CTX.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);

    CTX.lineTo(x + w, y + radius);
    CTX.quadraticCurveTo(x + w, y, x + w - radius, y);

    CTX.lineTo(x + radius, y);
    CTX.quadraticCurveTo(x, y, x, y + radius);

    CTX.lineTo(x, y + h - radius);
    CTX.quadraticCurveTo(x, y + h, x + radius, y + h);

    CTX.fill();
    CTX.stroke();

    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (const element of words) {
        const testLine = line + element + ' ';
        const metrics = CTX.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > w - padding * 2) {
            lines.push(line);
            line = element + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    CTX.fillStyle = '#1c1b1b';
    CTX.font = '16px PixelFont';
    CTX.textAlign = 'left';
    CTX.textBaseline = 'top';
    for (let i = 0; i < lines.length; i++) {
        CTX.fillText(lines[i], x + padding, y + padding + i * lineHeight);
    }
}
