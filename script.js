const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let shooter = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 20,
    speed: 10
};

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

let balls = [];
let fallingBalls = [];
let fallingBallFrequency = 100;
let frameCount = 0;
let gameRunning = true;
let score = 0;

document.getElementById('restartButton').addEventListener('click', restartGame);

function drawShooter() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
}

function shootBall() {
    let ball = {
        x: shooter.x + shooter.width / 2,
        y: shooter.y,
        radius: 5,
        speed: 7
    };
    balls.push(ball);
}

function drawBalls() {
    balls.forEach((ball, index) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ball.y -= ball.speed;

        if (ball.y < 0) {
            balls.splice(index, 1);
        }
    });
}

function addFallingBall() {
    let ball = {
        x: Math.random() * canvas.width,
        y: 0,
        radius: 18,
        speed: 3
    };
    fallingBalls.push(ball);
}

function drawFallingBalls() {
    fallingBalls.forEach((ball, index) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();

        ball.y += ball.speed;

        balls.forEach((shooterBall, shooterBallIndex) => {
            if (isColliding(shooterBall, ball)) {
                fallingBalls.splice(index, 1);
                balls.splice(shooterBallIndex, 1);
                score++;
            }
        });

        if (ball.y > canvas.height) {
            fallingBalls.splice(index, 1);
            gameRunning = false;
        }
    });
}

function isColliding(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < ball1.radius + ball2.radius;
}

function updateShooterPosition() {
    if (keys.ArrowLeft && shooter.x > 0) {
        shooter.x -= shooter.speed;
    } else if (keys.ArrowRight && shooter.x < canvas.width - shooter.width) {
        shooter.x += shooter.speed;
    }
}

function restartGame() {
    balls = [];
    fallingBalls = [];
    frameCount = 0;
    score = 0;
    gameRunning = true;
    document.getElementById('restartButton').style.display = 'none';
    updateGame();
}

function updateGame() {
    if (!gameRunning) {
        ctx.font = '40px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillStyle = 'black';
        ctx.fillText('Your Score: ' + score, canvas.width / 2 - 100, canvas.height / 2 + 50);
        document.getElementById('restartButton').style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateShooterPosition();
    if (keys.Space) {
        shootBall();
        keys.Space = false;
    }
    drawShooter();
    drawBalls();
    drawFallingBalls();

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);

    frameCount++;
    if (frameCount % fallingBallFrequency === 0) {
        addFallingBall();
    }

    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

updateGame();
