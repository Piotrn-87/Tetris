"use strict";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("serviceworker.js").then(
      function(registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        // registration failed
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

let canvas;
let ctx;
let gameBoardArrayHeight = 25;
let gameBoardArrayWidth = 16;
let highScore = 0;
let level = 1;
const levelUp = 20;
let pause = false;
let score = 0;
let speed = 1;
let startX = 6;
let startY = 0;
let tetrisLogo;
let time;
let winOrLose = "Playing";

localStorage.setItem("highScore", 0);
if (localStorage.getItem(highScore)) {
  highScore = localStorage.getItem("highScore");
} else {
  localStorage.setItem("highScore", 0);
}

let coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);
let gameBoardArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);
let stoppedShapeArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);

let currentTetromino = [
  // T Shape
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1]
];

//Create shapes
let tetrominos = [];
function CreateShapes() {
  // T Shape
  tetrominos.push([
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ]);
  // I Shape
  tetrominos.push([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ]);
  // J Shape
  tetrominos.push([
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ]);
  // Square Shape
  tetrominos.push([
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1]
  ]);
  // L Shape
  tetrominos.push([
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ]);
  // S Shape
  tetrominos.push([
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1]
  ]);
  // Z Shape
  tetrominos.push([
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1]
  ]);
}
let shapesColors = [
  "lime",
  "cyan",
  "blue",
  "green",
  "red",
  "orange",
  "magenta"
];
let currentTetrominoColor = "coral";

let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

let KEYS = {
  LEFT: 65,
  IDLE: 87,
  RIGHT: 68,
  DOWN: 83,
  PAUSE: 80,
  SPACE: 32
};

let direction;

class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function CreateCoordArray() {
  let i = 0,
    j = 0;
  for (let y = 4; y <= 550; y += 22) {
    for (let x = 140; x <= 470; x += 22) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}

document.addEventListener("DOMContentLoaded", SetupCanvas);

function SetupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 640;
  canvas.height = 558;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.strokeRect(138, 2, 354, 552);

  tetrisLogo = new Image(160, 50);
  tetrisLogo.onload = DrawTetrisLogo;
  tetrisLogo.src = "assets/img/indeks.jpg";

  ctx.font = "1.3rem Arial";

  ctx.fillStyle = "red";
  ctx.fillText("Score", 500, 100);
  ctx.fillText(score.toString(), 570, 100);

  ctx.fillStyle = "orange";
  ctx.fillText("Level", 500, 150);
  ctx.fillText(level.toString(), 570, 150);

  ctx.fillStyle = "green";
  ctx.fillText(winOrLose, 500, 200);

  ctx.fillStyle = "#0066cc";
  ctx.fillText("CONTROLS", 500, 320);
  ctx.fillText("A: Move left", 500, 350);
  ctx.fillText("D: Move right", 500, 380);
  ctx.fillText("S: Move down", 500, 410);
  ctx.fillText("P: Pasue", 500, 440);
  ctx.fillText("Space: Rotate", 500, 470);

  document.addEventListener("keydown", handleKeyPress);

  CreateShapes();
  CreateTetromino();
  CreateCoordArray();
  DrawTetromino();
}

function DrawTetrisLogo() {
  ctx.drawImage(tetrisLogo, 0, 50, 130, 70);
  ctx.drawImage(tetrisLogo, 0, 100, 130, 70);
  ctx.drawImage(tetrisLogo, 0, 150, 130, 70);
  ctx.drawImage(tetrisLogo, 0, 200, 130, 70);
}

function DrawTetromino() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let x = currentTetromino[i][0] + startX;
    let y = currentTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = currentTetrominoColor;
    ctx.fillRect(coorX, coorY, 20, 20);
  }
}
function DeleteTetromino() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let x = currentTetromino[i][0] + startX;
    let y = currentTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = "white";
    ctx.fillRect(coorX, coorY, 20, 20);
  }
}

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(key) {
  if (winOrLose != "Game Over") {
    if (key.keyCode === KEYS.LEFT && !pause) {
      MoveLeft();
    } else if (key.keyCode === KEYS.RIGHT && !pause) {
      MoveRight();
    } else if (key.keyCode === KEYS.DOWN && !pause) {
      MoveDown();
    } else if (key.keyCode === KEYS.SPACE && !pause) {
      RotateTetromino();
    } else if (key.keyCode === KEYS.PAUSE) {
      pause = !pause;
      if (pause === true) {
        ctx.fillStyle = "#9900cc";
        ctx.fillText("PAUSE", 500, 250);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(500, 225, 100, 30);
      }
    }
  }
}
function MoveLeft() {
  direction = DIRECTION.LEFT;
  if (!HittingTheWall() && !HorizontalCollision()) {
    DeleteTetromino();
    startX--;
    DrawTetromino();
  }
}

function MoveRight() {
  direction = DIRECTION.RIGHT;
  if (!HittingTheWall() && !HorizontalCollision()) {
    DeleteTetromino();
    startX++;
    DrawTetromino();
  }
}

function MoveDown() {
  direction = DIRECTION.DOWN;
  if (!VerticalCollision()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

function setSpeed(speed) {
  time = window.setInterval(() => {
    if (!pause) {
      if (winOrLose != "Game Over") {
        MoveDown();
        console.log(winOrLose);
      }
    }
  }, 1000 / speed);
}

setSpeed(speed);

function CreateTetromino() {
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  currentTetromino = tetrominos[randomTetromino];
  currentTetrominoColor = shapesColors[randomTetromino];
}

function HittingTheWall() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let newX = currentTetromino[i][0] + startX;
    if (newX <= 0 && direction === DIRECTION.LEFT) {
      return true;
    } else if (newX >= 15 && direction === DIRECTION.RIGHT) {
      return true;
    }
  }
  return false;
}

function VerticalCollision() {
  let copyTetromino = currentTetromino;
  let collision = false;
  for (let i = 0; i < copyTetromino.length; i++) {
    let shape = copyTetromino[i];
    let x = shape[0] + startX;
    let y = shape[1] + startY;
    if (direction === DIRECTION.DOWN) {
      y++;
    }

    if (typeof stoppedShapeArray[x][y + 1] === "string") {
      DeleteTetromino();
      startY++;
      DrawTetromino();
      collision = true;
      break;
    }
    if (y >= 25) {
      collision = true;
      break;
    }
  }
  if (collision) {
    if (startY <= 4) {
      winOrLose = "Game Over";
      ctx.fillStyle = "white";
      ctx.fillRect(500, 180, 100, 30);
      ctx.fillStyle = "black";
      ctx.fillText(winOrLose, 500, 200);
    } else {
      for (let i = 0; i < copyTetromino.length; i++) {
        let shape = copyTetromino[i];
        let x = shape[0] + startX;
        let y = shape[1] + startY;
        stoppedShapeArray[x][y] = currentTetrominoColor;
      }

      CompletedRows();
      CreateTetromino();
      direction = DIRECTION.IDLE;
      startX = 6;
      startY = 0;
      DrawTetromino();
    }
  }
}

function HorizontalCollision() {
  var copyTetromino = currentTetromino;
  var collision = false;
  for (var i = 0; i < copyTetromino.length; i++) {
    var shape = copyTetromino[i];
    var x = shape[0] + startX;
    var y = shape[1] + startY;

    if (direction === DIRECTION.LEFT) {
      x--;
    } else if (direction === DIRECTION.RIGHT) {
      x++;
    }
    var stoppedShapeValue = stoppedShapeArray[x][y];
    if (typeof stoppedShapeValue === "string") {
      collision = true;
      break;
    }
  }
  return collision;
}

function CompletedRows() {
  var rowsToDelete = 0;
  let startOfDeletion = 0;

  for (let y = 0; y < gameBoardArrayHeight; y++) {
    let completed = true;
    for (let x = 0; x < gameBoardArrayWidth; x++) {
      let shape = stoppedShapeArray[x][y];
      console.log("shape", shape);
      if (shape === 0 || typeof shape === "undefined") {
        completed = false;
        break;
      }
    }
    if (completed) {
      if (startOfDeletion === 0) startOfDeletion = y + 4;
      rowsToDelete++;
      for (let i = 0; i < gameBoardArrayWidth; i++) {
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coorX = coordinateArray[i][y].x;
        let coorY = coordinateArray[i][y].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 20, 20);
      }
    }
  }
  if (rowsToDelete > 0) {
    score += 10;
    if (score > localStorage.getItem("highScore")) {
      localStorage.setItem("highScore", score);
    }
    ctx.fillRect(570, 85, 40, 25);
    ctx.fillStyle = "green";
    ctx.fillText(score.toString(), 570, 100);
    MoveRowsDown(rowsToDelete, startOfDeletion);
    if (score % levelUp === 0) {
      speed = speed + 0.2;
      level++;
      ctx.fillRect(560, 130, 40, 25);
      ctx.fillStyle = "green";
      ctx.fillText(level.toString(), 570, 150);
      clearInterval(time);
      setSpeed(speed);
    }
  }
}

function MoveRowsDown(rowsToDelete, startOfDeletion) {
  for (var i = startOfDeletion - 1; i >= 0; i--) {
    for (var x = 0; x < gameBoardArrayWidth; x++) {
      var y2 = i + rowsToDelete;
      var shape = stoppedShapeArray[x][i];
      var nextShape = stoppedShapeArray[x][y2];
      if (typeof shape === "string") {
        nextShape = shape;
        gameBoardArray[x][y2] = 1;
        stoppedShapeArray[x][y2] = shape;
        let coorX = coordinateArray[x][y2].x;
        let coorY = coordinateArray[x][y2].y;
        ctx.fillStyle = nextShape;
        ctx.fillRect(coorX, coorY, 20, 20);
        shape = 0;
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coorX = coordinateArray[x][i].x;
        coorY = coordinateArray[x][i].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 20, 20);
      }
    }
  }
}

function RotateTetromino() {
  let newRotation = new Array();
  let tetrominoCopy = currentTetromino;
  let currentTetrominoBackUp;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    currentTetrominoBackUp = [...currentTetromino];
    let x = tetrominoCopy[i][0];
    let y = tetrominoCopy[i][1];
    let newX = GetLastSquareX() - y;
    let newY = x;
    newRotation.push([newX, newY]);
  }
  DeleteTetromino();
  try {
    currentTetromino = newRotation;
    DrawTetromino();
  } catch (e) {
    if (e instanceof TypeError) {
      currentTetromino = currentTetrominoBackUp;
      DeleteTetromino();
      DrawTetromino();
    }
  }
}
function GetLastSquareX() {
  let lastX = 0;
  for (let i = 0; i < currentTetromino.length; i++) {
    let square = currentTetromino[i];
    if (square[0] > lastX) lastX = square[0];
  }
  return lastX;
}

// Number of key
// function keyCode(e) {
//   console.log(e.keyCode);
// }
// window.addEventListener("keydown", keyCode);
