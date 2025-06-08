const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, gameOver, gameStarted, score;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = randomFood();
  gameOver = false;
  gameStarted = false;
  score = 0;
  updateScore();
  drawGame();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function draw() {
  if (!gameStarted || gameOver) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true;
    setTimeout(() => alert("💀 Game Over! Press 'R' or swipe to restart."), 50);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    score++;
    updateScore();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  ctx.fillStyle = "#ff4444";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Orbitron";
    ctx.fillText("Press ENTER or swipe UP", 50, 200);
  }
}

function handleInput(e) {
  if (e.key === "Enter" && !gameStarted) {
    direction = { x: 0, y: -1 };
    gameStarted = true;
    return;
  }

  if (e.key.toLowerCase() === "r") {
    resetGame();
    return;
  }

  if (!gameStarted) return;

  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

document.addEventListener("keydown", handleInput);

// ✅ Swipe controls
let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", function (e) {
  if (e.changedTouches.length === 0) return;

  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && direction.x === 0) direction = { x: 1, y: 0 };
    else if (dx < -20 && direction.x === 0) direction = { x: -1, y: 0 };
  } else {
    if (dy > 20 && direction.y === 0) direction = { x: 0, y: 1 };
    else if (dy < -20 && direction.y === 0) {
      direction = { x: 0, y: -1 };
      if (!gameStarted) gameStarted = true;
    }
  }

  // If game is over, allow swipe to reset
  if (gameOver) resetGame();
}, { passive: true });

resetGame();
setInterval(draw, 100);
