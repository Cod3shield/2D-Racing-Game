const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

// Load game images
const playerImg = new Image();
playerImg.src = "images/redcar.png";

const enemyImg = new Image();
enemyImg.src = "images/greencar.png";

// Player settings
const player = {
    x: 170,
    y: 580,
    w: 60,
    h: 100,
    speed: 7
};

let enemies = [];
let roadOffset = 0;
let score = 0;
let gameOver = false;

// Speed meter
let currentSpeed = 50;

// Score color animation
let scoreColor = "white";

const scoreColors = [
    "red",
    "yellow",
    "cyan",
    "lime",
    "orange",
    "blue",
    "purple",
    "magenta"
];

let colorIndex = 0;

setInterval(() => {
    colorIndex++;
    if (colorIndex >= scoreColors.length) {
        colorIndex = 0;
    }
    scoreColor = scoreColors[colorIndex];
}, 2000);

// Create enemy cars
function spawnEnemy() {

    if (!gameOver) {

        enemies.push({
            x: Math.random() * 220 + 70,
            y: -120,
            w: 60,
            h: 100,
            speed: 5 + Math.random() * 3
        });
    }
}

setInterval(spawnEnemy, 1200);

// Store pressed keys
const keys = {};

// Keyboard key pressed
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

// Keyboard key released
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

/*
==========================================
Mobile Touch Controls
Works with buttons in index.html
==========================================
*/

const mobileButtons = {
    btnW: "w",
    btnA: "a",
    btnS: "s",
    btnD: "d"
};

Object.keys(mobileButtons).forEach(id => {

    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keys[mobileButtons[id]] = true;
    });

    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        keys[mobileButtons[id]] = false;
    });

    btn.addEventListener("mousedown", () => {
        keys[mobileButtons[id]] = true;
    });

    btn.addEventListener("mouseup", () => {
        keys[mobileButtons[id]] = false;
    });

    btn.addEventListener("mouseleave", () => {
        keys[mobileButtons[id]] = false;
    });
});

// Reset the game
function resetGame() {

    player.x = 170;
    player.y = 580;

    enemies = [];
    score = 0;
    roadOffset = 0;

    gameOver = false;

    document
        .getElementById("gameOverScreen")
        .classList
        .add("hidden");
}

// Update game objects
function update() {

    if (gameOver) return;

    currentSpeed = 50 + (score * 3);

    // Movement
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
        player.x += player.speed;
    }

    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
        player.y -= player.speed;
    }

    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
        player.y += player.speed;
    }

    // Keep player inside the road
    player.x = Math.max(60, Math.min(280, player.x));
    player.y = Math.max(50, Math.min(580, player.y));

    // Animate road
    roadOffset += 8;

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        // Increase enemy speed when score reaches 10
        let speedBoost = Math.floor(score / 10) * 2;
        enemy.y += enemy.speed + speedBoost;

        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            score++;
            continue;
        }

        // Collision detection
        const sidePadding = 18;
        const verticalPadding = 15;

        if (
            player.x + sidePadding < enemy.x + enemy.w - sidePadding &&
            player.x + player.w - sidePadding > enemy.x + sidePadding &&
            player.y + verticalPadding < enemy.y + enemy.h - verticalPadding &&
            player.y + player.h - verticalPadding > enemy.y + verticalPadding
        ) {
            gameOver = true;
            document.getElementById("finalScore").textContent = score;

            document
                .getElementById("gameOverScreen")
                .classList
                .remove("hidden");
            return;
        }
    }
}

// Draw the road
function drawRoad() {

    ctx.fillStyle = "#66b5ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 50, canvas.height);
    ctx.fillRect(350, 0, 50, canvas.height);
    ctx.fillStyle = "#555";
    ctx.fillRect(50, 0, 300, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    for (
        let y = -40 + (roadOffset % 40);
        y < canvas.height;
        y += 40
    ) {
        ctx.beginPath();
        ctx.moveTo(200, y);
        ctx.lineTo(200, y + 20);
        ctx.stroke();
    }
}

/*
==================================================
Repository Information
==================================================
This repository contains a partial version of the
project for demonstration and portfolio purposes.
Some source code, features, and assets have been
intentionally excluded to protect the complete
implementation.

Thank you for your understanding and interest in
this project.
==================================================
*/

