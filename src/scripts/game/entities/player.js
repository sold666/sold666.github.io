import {CANVAS, CTX, GRAVITY} from '../utils/canvas.js';

export class Player {
    constructor(platform) {
        this.platform = platform;
        this.falling = false;
        this.speed = 1.8;

        this.position = {
            x: this.platform.position.x,
            y: 0
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.width = 100;
        this.height = 90;

        this.frames = 0;
        this.frameTick = 0;
        this.animationSpeed = 3;

        this.sprites = {
            stand: {
                right: document.getElementById("ch_stand_right"),
                left: document.getElementById("ch_stand_left"),
                cropWidth: 250,
                width: 100,
                maxFrames: 18
            },
            run: {
                right: document.getElementById("ch_run_right"),
                left: document.getElementById("ch_run_left"),
                cropWidth: 250,
                width: 100,
                maxFrames: 18
            },
            fall: {
                general: document.getElementById("ch_fall"),
                cropWidth: 250,
                width: 100,
                maxFrames: 55
            }
        };

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
        this.currentMaxFrames = this.sprites.stand.maxFrames;
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
            this.width,
            this.height
        );
    }

    update() {
        this.frameTick++;

        if (this.frameTick >= this.animationSpeed) {
            this.frameTick = 0;
            this.frames++;

            if (this.frames > this.currentMaxFrames) {
                this.frames = 0;
            }
        }

        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= CANVAS.height) {
            this.velocity.y += GRAVITY;
        }
    }

    setSprite(sprite, cropWidth, width, maxFrames) {
        if (this.currentSprite !== sprite) {
            this.currentSprite = sprite;
            this.currentCropWidth = cropWidth;
            this.width = width;
            this.currentMaxFrames = maxFrames;
            this.frames = 0;
            this.frameTick = 0;
        }
    }
}