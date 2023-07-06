import {CANVAS, CTX, GRAVITY} from '../utils/canvas.js';

export class Player {
    constructor(platform) {
        this.platform = platform;
        this.falling = false;
        this.speed = 5;
        this.position = {
            x: this.platform.position.x,
            y: 0
        };
        this.velocity = {
            x: 0,
            y: 1
        };
        this.width = 100;
        this.height = 90;
        this.frames = 0;
        this.sprites = {
            stand: {
                right: document.getElementById("ch_stand_right"),
                left: document.getElementById("ch_stand_left"),
                cropWidth: 250,
                width: 100
            },
            run: {
                right: document.getElementById("ch_run_right"),
                left: document.getElementById("ch_run_left"),
                cropWidth: 250,
                width: 100
            },
            fall: {
                general: document.getElementById("ch_fall"),
                cropWidth: 250,
                width: 100
            }
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 250;
    }

    draw() {
        CTX.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            250,
            this.position.x,
            this.position.y,
            this.width, this.height);
    }

    update() {
        this.frames++;
        if (this.falling && this.position.y === 0 || this.position.x === this.platform.position.x) {
            this.frames = 0;
        }
        if (this.falling) {
            if (this.currentSprite === this.sprites.fall) {
                if (this.frames > 20) {
                    this.frames = 0;
                }
            }
        } else {
            if (this.frames > 18) {
                this.frames = 0;
            }
        }

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y <= CANVAS.height)
            this.velocity.y += GRAVITY;
    }
}
