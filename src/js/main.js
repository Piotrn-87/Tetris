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
let startX = 4;
let startY = 0;

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
  "coral"
];
let currentTetrominoColor;
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));

let DIRECTION = {
  IDEL: 0,
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
  for (let y = 10; y <= 546; y += 12) {
    for (let x = 20; x <= 240; x += 12) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}
function SetupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 530;
  canvas.height = 556;

  // ctx.scale(2, 2);

  ctx.fillStyle = "white";
  ctx.fillRect(6, 6, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.strokeRect(4, 8, 520, 552);

  document.addEventListener("keydown", handleKeyPress);

  CreateShapes();
  CreateTetromino();
  CreateCoordArray();
  DrawTetromino();
}

function DrawTetromino() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let x = currentTetromino[i][0] + startX;
    let y = currentTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = currentTetrominoColor;
    ctx.fillRect(coorX, coorY, 10, 10);
    console.log("COLOR", currentTetrominoColor);
  }
}

function handleKeyPress(key) {
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    if (!HittingTheWall()) {
      DeleteTetromino();
      startX--;
      DrawTetromino();
    }
  } else if (key.keyCode === 68) {
    direction = DIRECTION.RIGHT;
    if (!HittingTheWall()) {
      DeleteTetromino();
      startX++;
      DrawTetromino();
    }
  } else if (key.keyCode === 83) {
    direction = DIRECTION.DOWN;
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
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
    } else if (newX >= 20 && direction === DIRECTION.RIGHT) {
      return true;
    }
  }
  return false;
}
