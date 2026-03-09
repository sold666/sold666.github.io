import {CANVAS, CTX} from './utils/canvas.js';
import {Player} from './entities/player.js';
import {createPlatformsFromLinks} from "./utils/platforms_logic.js";
import {drawBubble} from "./utils/speech_logic.js";

export const KEYS = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

export const platforms = createPlatformsFromLinks();
export let player = new Player(platforms[0]);
export let currentPlatform = null;

let lastKey = 'right';
let gameOver = false;
let jumping = false;
let jumpDelay = 500;
let lastJumpTime = 0;
let isSpeaking = false;
let speech = '';

const modal = document.getElementById('game-over-modal');

function init() {
    player = new Player(platforms[0]);
    currentPlatform = null;
    lastKey = 'right';
    jumping = false;
    isSpeaking = false;
    speech = '';
    KEYS.left.pressed = false;
    KEYS.right.pressed = false;
}

function displayGameOver() {
    if (modal.style.display === 'block') return;

    const restartText = modal.querySelector('p');
    modal.style.display = 'block';
    restartText.classList.add('restart-animation');
}

function restartGame() {
    const restartText = modal.querySelector('p');
    modal.style.display = 'none';
    restartText.classList.remove('restart-animation');

    gameOver = false;
    init();
}

function animate() {
    requestAnimationFrame(animate);

    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    if (!gameOver) {
        player.update();
    } else {
        player.draw();
    }

    if (isSpeaking) {
        const bubbleWidth = 200;
        const bubbleHeight = 50;
        const bubbleX = player.position.x + player.width;
        const bubbleY = player.position.y - bubbleHeight - 10;
        drawBubble(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10, speech);
    }

    if (player.position.y < 0) {
        player.position.y = 0;
        player.velocity.y = 0;
    }

    if (player.position.x + player.width > CANVAS.width) {
        player.position.x = CANVAS.width - player.width;
        player.velocity.x = 0;
    }

    if (player.position.x < 0) {
        player.position.x = 0;
        player.velocity.x = 0;
    }

    if (!gameOver) {
        if (KEYS.right.pressed) {
            player.velocity.x = player.speed;
        } else if (KEYS.left.pressed) {
            player.velocity.x = -player.speed;
        } else {
            player.velocity.x = 0;
        }
    } else {
        player.velocity.x = 0;
        player.velocity.y = 0;
    }

    currentPlatform = null;

    for (const platform of platforms) {
        platform.draw();

        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
            currentPlatform = platform;
        }
    }

    if (
        KEYS.right.pressed &&
        lastKey === 'right'
    ) {
        player.setSprite(
            player.sprites.run.right,
            player.sprites.run.cropWidth,
            player.sprites.run.width,
            player.sprites.run.maxFrames
        );
    } else if (
        KEYS.left.pressed &&
        lastKey === 'left'
    ) {
        player.setSprite(
            player.sprites.run.left,
            player.sprites.run.cropWidth,
            player.sprites.run.width,
            player.sprites.run.maxFrames
        );
    } else if (
        !KEYS.left.pressed &&
        lastKey === 'left'
    ) {
        player.setSprite(
            player.sprites.stand.left,
            player.sprites.stand.cropWidth,
            player.sprites.stand.width,
            player.sprites.stand.maxFrames
        );
    } else if (
        !KEYS.right.pressed &&
        lastKey === 'right'
    ) {
        player.setSprite(
            player.sprites.stand.right,
            player.sprites.stand.cropWidth,
            player.sprites.stand.width,
            player.sprites.stand.maxFrames
        );
    }

    if (player.velocity.y > 0 && player.position.x !== 200 && player.position.y !== 0) {
        player.falling = true;
        player.setSprite(
            player.sprites.fall.general,
            player.sprites.fall.cropWidth,
            player.sprites.fall.width,
            player.sprites.fall.maxFrames
        );
    } else {
        player.falling = false;
    }

    if (player.position.y > CANVAS.height) {
        gameOver = true;
        displayGameOver();
    }
}

function handleKeyDown(event) {
    if (gameOver) {
        if (event.keyCode === 82) {
            restartGame();
        }
        return;
    }

    switch (event.keyCode) {
        case 65:
            KEYS.left.pressed = true;
            lastKey = 'left';
            break;

        case 68:
            KEYS.right.pressed = true;
            lastKey = 'right';
            break;

        case 32: {
            const currentTime = Date.now();

            if (!jumping && currentTime - lastJumpTime > jumpDelay) {
                player.velocity.y = -13;
                jumping = true;
                lastJumpTime = currentTime;
            }
            break;
        }

        case 13:
            if (currentPlatform?.link) {
                window.location.href = currentPlatform.link;
            }
            break;

        case 74:
            isSpeaking = true;
            speech = 'Have a good day! 😌';
            break;
    }
}

function handleKeyUp(event) {
    if (gameOver) {
        return;
    }

    switch (event.keyCode) {
        case 65:
            KEYS.left.pressed = false;
            break;

        case 68:
            KEYS.right.pressed = false;
            break;

        case 32:
            jumping = false;
            break;

        case 74:
            setTimeout(() => {
                isSpeaking = false;
                speech = '';
            }, 2000);
            break;
    }
}

addEventListener('keydown', handleKeyDown);
addEventListener('keyup', handleKeyUp);

init();
animate();