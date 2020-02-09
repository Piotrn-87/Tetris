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
let gameBoardArrayHeight = 20;
let gameBoardArrayWidth = 12;
let startX = 7;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";
let tetrisLogo;

let coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);

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
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let stoppedShapeArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);

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
document.addEventListener("DOMContentLoaded", SetupCanvas);

function CreateCoordArray() {
  let i = 0,
    j = 0;
  for (let y = 4; y <= 462; y += 22) {
    for (let x = 140; x <= 484; x += 22) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}
function SetupCanvas() {
  canvas = document.querySelector(".canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 640;
  canvas.height = 556;

  // ctx.scale(2, 2);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.strokeRect(138, 2, 354, 542);

  tetrisLogo = new Image(160, 50);
  tetrisLogo.onload = DrawTetrisLogo;
  tetrisLogo.class = "logo";
  tetrisLogo.src = "../assets/img/indeks.jpg";

  ctx.fillStyle = "green";
  ctx.font = "1.3rem Arial";

  ctx.fillText("Score", 500, 100);
  // ctx.strokeRect(150, 100, 161, 24);

  ctx.fillText("Level", 500, 150);
  // ctx.strokeRect(180, 171, 161, 32);

  ctx.fillText("Win / Lose", 500, 200);
  // ctx.strokeRect(250, 282, 141, 85);

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
    console.log("COLOR", currentTetrominoColor);
  }
}

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
    MoveDown();
  } else if (key.keyCode === 87) {
    MoveUp();
  }
}

function MoveUp() {
  DeleteTetromino();
  startY--;
  DrawTetromino();
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
  DeleteTetromino();
  startY++;
  DrawTetromino();
}

function DeleteTetromino() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let x = currentTetromino[i][0] + startX;
    let y = currentTetromino[i][1] + startY;
    gameBoardArray[x][y] = 0;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = "white";
    ctx.fillRect(coorX, coorY, 20, 20);
  }
}

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
  console.log("Random", randomTetromino);
  console.log("Length", tetrominos.length);
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
