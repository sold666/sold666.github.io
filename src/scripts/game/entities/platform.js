import {CTX} from '../utils/canvas.js';

export class Platform {
    constructor(x, y, width, height, link) {
        this.position = {
            x: x,
            y: y
        };
        this.width = width;
        this.height = height;
        this.link = link;
    }

    draw() {
        CTX.fillStyle = 'rgba(0, 0, 0, 0)';
        CTX.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
