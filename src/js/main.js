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
let currentTetramino = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1]
];

let tetrominos = [];
let tetrominosColors = [
  "violet",
  "cyan",
  "blue",
  "green",
  "red",
  "orange",
  "yellow"
];
let currentTetrominoColor = "green";

let gameBoardArray = [...Array(gameBoardArrayHeight)].map(e =>
  Array(gameBoardArrayWidth).fill(0)
);

let DIRECTION = {
  IDEL: 0,
  DOWN: 0,
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
  for (let y = 9; y <= 446; y += 23) {
    for (let x = 11; x <= 264; x += 23) {
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
  canvas.width = 936;
  canvas.height = 956;

  ctx.scale(2, 2);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.strokeRect(8, 8, 280, 462);

  document.addEventListener("keydown", handleKeyPress);

  createTetramino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawTetromino() {
  for (let i = 0; i < currentTetramino.length; i++) {
    let x = currentTetramino[i][0] + startX;
    let y = currentTetramino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = (coorX = coordinateArray[x][y].x);
    let coorY = (coorY = coordinateArray[x][y].y);
    ctx.fillStyle = currentTetraminoColor;
    ctx.fillRect(coorX, coorY, 21, 21);
  }
}

function handleKeyPress(key) {
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    DeleteTetramino();
    startX--;
    DrawTetromino();
  } else if (key.keyCode === 68) {
    direction = DIRECTION.RIGHT;
    startX++;
    DrawTetromino();
  } else if (key.keyCode === 83) {
    direction = DIRECTION.DOWN;
    startY++;
    DrawTetromino();
  }
}

function DeleteTetramino() {
  for (let i = 0; i < currentTetramino.length; i++) {
    let x = currentTetramino[i][0] + startX;
    let y = currentTetramino[(1)[1]] + startY;
    gameBoardArrayHeight[x][y] = 0;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = "white";
    ctx.fillRect(coorX, coorY, 21, 21);
  }
}
