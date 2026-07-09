const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

// Load images
const playerImg = new Image();
playerImg.src = "images/redcar.png";

const enemyImg = new Image();
enemyImg.src = "images/greencar.png";

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

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

function resetGame() {
    player.x = 170;
    player.y = 580;
    enemies = [];
    score = 0;
    roadOffset = 0;
    gameOver = false;
}

function update() {

    if (gameOver) return;

    // Move player left
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
        player.x -= player.speed;
    }

    // Move player right
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
        player.x += player.speed;
    }

    // Move player forward
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
        player.y -= player.speed;
    }

    // Move player backward
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
        player.y += player.speed;
    }

    // Keep the player inside the road boundaries
    player.x = Math.max(60, Math.min(280, player.x));
    player.y = Math.max(50, Math.min(580, player.y));

    // Move the road animation
    roadOffset += 8;

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {

        let enemy = enemies[i];
        enemy.y += enemy.speed;

        // Remove enemy after leaving the screen
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            score++;
            continue;
        }

        // More accurate collision (less sensitive on the sides)
        const sidePadding = 18;
        const verticalPadding = 15;

        if (
            player.x + sidePadding < enemy.x + enemy.w - sidePadding &&
            player.x + player.w - sidePadding > enemy.x + sidePadding &&
            player.y + verticalPadding < enemy.y + enemy.h - verticalPadding &&
            player.y + player.h - verticalPadding > enemy.y + verticalPadding
        ) {
            gameOver = true;

            setTimeout(() => {
                alert("Game Over!\nScore: " + score);
                resetGame();
            }, 100);

            return;
        }
    }
}

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

    for (let y = -40 + (roadOffset % 40); y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(200, y);
        ctx.lineTo(200, y + 20);
        ctx.stroke();
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();

    if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    }

    enemies.forEach(enemy => {
        if (enemyImg.complete) {
            ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.w, enemy.h);
        }
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();