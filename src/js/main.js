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

console.log(`Hello Tetromino!`);

let canvas;
let ctx;
let gameBoardArrayHeight = 16;
let gameBoardArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";
let tetrisLogo;

let coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);
console.log(coordinateArray);
let currentTetromino = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1]
];

let tetrominos = [];
let shapesColors = [
  "violet",
  "cyan",
  "blue",
  "green",
  "red",
  "orange",
  "magenta"
];
let currentTetrominoColor;
let gameBoardArray = [...Array(16)].map(e => Array(12).fill(0));
let stoppedShapeArray = [...Array(16)].map(e => Array(12).fill(0));

let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
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
  tetrisLogo.src = "../assets/img/indeks.jpg";

  ctx.fillStyle = "green";
  ctx.font = "1.3rem Arial";

  ctx.fillText("Score", 500, 100);
  ctx.fillText(score.toString(), 570, 100);

  ctx.fillText("Level", 500, 150);
  ctx.fillText(level.toString(), 500, 180);

  ctx.fillText(winOrLose, 500, 200);

  ctx.fillText("CONTROLS", 500, 320);

  ctx.fillText("A: Move left", 500, 350);
  ctx.fillText("D: Move right", 500, 380);
  ctx.fillText("S: Move down", 500, 410);
  ctx.fillText("Space: rotate", 500, 440);

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
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    if (!HittingTheWall()) {
      MoveLeft();
    }
  } else if (key.keyCode === 68) {
    direction = DIRECTION.RIGHT;
    if (!HittingTheWall()) {
      MoveRight();
    }
  } else if (key.keyCode === 83) {
    direction = DIRECTION.DOWN;
    MoveDown();
  } else if (key.keyCode === 32) {
    RotateTetromino();
  }
}

function MoveLeft() {
  DeleteTetromino();
  startX--;
  DrawTetromino();
}

function MoveRight() {
  direction = DIRECTION.RIGHT;
  DeleteTetromino();
  startX++;
  DrawTetromino();
}

function MoveDown() {
  direction = DIRECTION.DOWN;
  if (!VerticalCollision()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

// window.setInterval(function() {
//   if (winOrLose != "Game Over") {
//     MoveDown();
//   }
// }, 1000);

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
    if (startY <= 2) {
      winOrLose = "Game Over";
      ctx.fillStyle = "red";
      ctx.fillText(winOrLose, 310, 100);
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
      startX = 4;
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
  return collison;
}

function CompletedRows() {
  let rowsToDelete = 0;
  let startOfDeletion = 0;

  for (let y = 0; y < gameBoardArrayHeight; y++) {
    let completed = true;
    for (let x = 0; x < gameBoardArrayWidth; x++) {
      let shape = stoppedShapeArray[x][y];
      if (shape === 0 || typeof shape === "undefined") {
        completed = false;
        break;
      }
    }
    if (completed) {
      if (startOfDeletion === 0) startOfDeletion = y;
      rowsToDelete++;
      for (let i = 0; i < gameBoardArrayWidth; i++) {
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coorX = coordinateArray[i][x].x;
        let coorY = coordinateArray[i][y].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 20, 20);
      }
    }
  }
  if (rowsToDelete > 0) {
    score += 10;
    ctx.fillStyle = "white";
    ctx.fillRect(310, 110, 140, 20);
    ctx.fillStyle = "black";
    ctx.fillText(score.toString(), 310, 130);
    MoveRowsDown(rowsToDelete, startOfDeletion);
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
        ctx.fillStyle = nextSquare;
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
