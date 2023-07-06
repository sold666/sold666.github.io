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

export let player = new Player();
export const platforms = createPlatformsFromLinks();
export let currentPlatform = null;
let lastKey;
let gameOver = false;
let jumping = false;
let jumpDelay = 500;
let lastJumpTime = 0;
let isSpeaking = false;
let speech = '';

function init() {
    player = new Player();
}

function displayGameOver() {
    const modal = document.getElementById('game-over-modal');
    modal.style.display = 'block';

    const restartText = modal.querySelector('p');
    restartText.classList.add('restart-animation');
}

function restartGame() {
    const modal = document.getElementById('game-over-modal');
    modal.style.display = 'none';

    const restartText = modal.querySelector('p');
    restartText.classList.remove('restart-animation');
    init();
    gameOver = false;
}

function animate() {
    requestAnimationFrame(animate);
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    player.update();

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

    if (KEYS.right.pressed) {
        player.velocity.x = player.speed;
    } else if (KEYS.left.pressed) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
    }

    for (const platform of platforms) {
        platform.draw();

        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
            currentPlatform = platform;
        }
    }

    if (KEYS.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (KEYS.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (!KEYS.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    } else if (!KEYS.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    }

    if (player.velocity.y > 0 && player.position.x !== 200 && player.position.y !== 0) {
        player.falling = true;
        player.currentSprite = player.sprites.fall.general;
        player.currentCropWidth = player.sprites.fall.cropWidth;
        player.width = player.sprites.fall.width;
    } else {
        player.falling = false;
    }

    if (player.position.y > CANVAS.height) {
        gameOver = true;
    }

    if (gameOver) {
        displayGameOver();
    }
}

function handleKeyDown(event) {
    if (modal.style.display === 'block') {
        return;
    }
    switch (event.keyCode) {
        case 65:
            console.log('left');
            KEYS.left.pressed = true;
            lastKey = 'left';
            break;
        case 68:
            console.log('right');
            KEYS.right.pressed = true;
            lastKey = 'right';
            player.velocity.x += 1;
            break;
        case 32:
            console.log('up');
            const currentTime = Date.now();
            if (!jumping && currentTime - lastJumpTime > jumpDelay) {
                player.velocity.y -= 20;
                jumping = true;
                lastJumpTime = currentTime;
            }
            break;
        case 13:
            console.log('enter');
            if (!gameOver) {
                window.location.href = currentPlatform.link;
            }
            break;
        case 74:
            console.log('say');
            isSpeaking = true;
            speech = 'Please, give me a job!';
            break;
        case 82:
            if (gameOver) {
                restartGame();
            }
            break;
    }
}

function handleKeyUp(event) {
    if (modal.style.display === 'block') {
        return;
    }
    switch (event.keyCode) {
        case 65:
            console.log('left');
            KEYS.left.pressed = false;
            break;
        case 68:
            console.log('right');
            KEYS.right.pressed = false;
            player.velocity.x = 0;
            break;
        case 32:
            console.log('up');
            jumping = false;
            break;
        case 74:
            console.log('say');
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
