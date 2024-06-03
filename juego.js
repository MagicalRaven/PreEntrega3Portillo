const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let playerHeight = 10;
let playerWidth = 10;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let onGround = true;

// Eventos de teclado
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.code == "Space") {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.code == "Space") {
        spacePressed = false;
    }
}

// Dibujar jugador
function drawPlayer() {
    ctx.beginPath();
    ctx.rect(x, y, playerWidth, playerHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Actualizar juego
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();

    if(rightPressed) {
        x += dx;
        if (x + playerWidth > canvas.width){
            x = canvas.width - playerWidth;
        }
    }
    else if(leftPressed) {
        x -= dx;
        if (x < 0){
            x = 0;
        }
    }

    // Salto
    if(spacePressed && onGround) {
        dy = -10;
        onGround = false;
    }

    // Gravedad
    y += dy;
    dy += 0.5; // Ajusta este valor para cambiar la gravedad
    if (y > canvas.height - playerHeight) {
        y = canvas.height - playerHeight;
        onGround = true;
        dy = 0;
    }

    requestAnimationFrame(update);
}

update();

