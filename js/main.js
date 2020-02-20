!function(c){var r={};function t(n){if(r[n])return r[n].exports;var l=r[n]={i:n,l:!1,exports:{}};return c[n].call(l.exports,l,l.exports,t),l.l=!0,l.exports}t.m=c,t.c=r,t.d=function(c,r,n){t.o(c,r)||Object.defineProperty(c,r,{enumerable:!0,get:n})},t.r=function(c){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(c,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(c,"__esModule",{value:!0})},t.t=function(c,r){if(1&r&&(c=t(c)),8&r)return c;if(4&r&&"object"==typeof c&&c&&c.__esModule)return c;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:c}),2&r&&"string"!=typeof c)for(var l in c)t.d(n,l,function(r){return c[r]}.bind(null,l));return n},t.n=function(c){var r=c&&c.__esModule?function(){return c.default}:function(){return c};return t.d(r,"a",r),r},t.o=function(c,r){return Object.prototype.hasOwnProperty.call(c,r)},t.p="",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        // Registration was successful\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        // registration failed\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\nlet canvas;\r\nlet ctx;\r\nlet gameBoardArrayHeight = 25;\r\nlet gameBoardArrayWidth = 16;\r\nlet highScore = 0;\r\nlet level = 1;\r\nconst levelUp = 20;\r\nlet pause = false;\r\nlet score = 0;\r\nlet speed = 1;\r\nlet startX = 6;\r\nlet startY = 0;\r\nlet tetrisLogo;\r\nlet time;\r\nlet winOrLose = "Playing";\r\n\r\nlocalStorage.setItem("highScore", 0);\r\nif (localStorage.getItem(highScore)) {\r\n  highScore = localStorage.getItem("highScore");\r\n} else {\r\n  localStorage.setItem("highScore", 0);\r\n}\r\n\r\nlet coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet gameBoardArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet stoppedShapeArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\n\r\nlet currentTetromino = [\r\n  // T Shape\r\n  [1, 0],\r\n  [0, 1],\r\n  [1, 1],\r\n  [2, 1]\r\n];\r\n\r\n//Create shapes\r\nlet tetrominos = [];\r\nfunction CreateShapes() {\r\n  // T Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // I Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [2, 0],\r\n    [3, 0]\r\n  ]);\r\n  // J Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // Square Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // L Shape\r\n  tetrominos.push([\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // S Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // Z Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n}\r\nlet shapesColors = [\r\n  "lime",\r\n  "cyan",\r\n  "blue",\r\n  "green",\r\n  "red",\r\n  "orange",\r\n  "magenta"\r\n];\r\nlet currentTetrominoColor = "coral";\r\n\r\nlet DIRECTION = {\r\n  IDLE: 0,\r\n  DOWN: 1,\r\n  LEFT: 2,\r\n  RIGHT: 3\r\n};\r\n\r\nlet KEYS = {\r\n  LEFT: 65,\r\n  IDLE: 87,\r\n  RIGHT: 68,\r\n  DOWN: 83,\r\n  PAUSE: 80\r\n};\r\n\r\nlet direction;\r\n\r\nclass Coordinates {\r\n  constructor(x, y) {\r\n    this.x = x;\r\n    this.y = y;\r\n  }\r\n}\r\n\r\nfunction CreateCoordArray() {\r\n  let i = 0,\r\n    j = 0;\r\n  for (let y = 4; y <= 550; y += 22) {\r\n    for (let x = 140; x <= 470; x += 22) {\r\n      coordinateArray[i][j] = new Coordinates(x, y);\r\n      i++;\r\n    }\r\n    j++;\r\n    i = 0;\r\n  }\r\n}\r\n\r\ndocument.addEventListener("DOMContentLoaded", SetupCanvas);\r\n\r\nfunction SetupCanvas() {\r\n  canvas = document.getElementById("canvas");\r\n  ctx = canvas.getContext("2d");\r\n  canvas.width = 640;\r\n  canvas.height = 558;\r\n\r\n  ctx.fillStyle = "white";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  ctx.strokeStyle = "black";\r\n  ctx.strokeRect(138, 2, 354, 552);\r\n\r\n  tetrisLogo = new Image(160, 50);\r\n  tetrisLogo.onload = DrawTetrisLogo;\r\n  tetrisLogo.src = "../assets/img/indeks.jpg";\r\n\r\n  ctx.fillStyle = "green";\r\n  ctx.font = "1.3rem Arial";\r\n\r\n  ctx.fillText("Score", 500, 100);\r\n\r\n  ctx.fillText(score.toString(), 570, 100);\r\n\r\n  ctx.fillText("Level", 500, 150);\r\n  ctx.fillText(level.toString(), 570, 150);\r\n\r\n  ctx.fillText(winOrLose, 500, 200);\r\n\r\n  ctx.fillText("CONTROLS", 500, 320);\r\n\r\n  ctx.fillText("A: Move left", 500, 350);\r\n  ctx.fillText("D: Move right", 500, 380);\r\n  ctx.fillText("S: Move down", 500, 410);\r\n  ctx.fillText("Space: rotate", 500, 440);\r\n\r\n  document.addEventListener("keydown", handleKeyPress);\r\n\r\n  CreateShapes();\r\n  CreateTetromino();\r\n  CreateCoordArray();\r\n  DrawTetromino();\r\n}\r\n\r\nfunction DrawTetrisLogo() {\r\n  ctx.drawImage(tetrisLogo, 0, 50, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 100, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 150, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 200, 130, 70);\r\n}\r\n\r\nfunction DrawTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = currentTetrominoColor;\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n  }\r\n}\r\nfunction DeleteTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = "white";\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n  }\r\n}\r\n\r\ndocument.addEventListener("keydown", handleKeyPress);\r\n\r\nfunction handleKeyPress(key) {\r\n  if (key.keyCode === KEYS.LEFT && !pause) {\r\n    direction = DIRECTION.LEFT;\r\n    if (!HittingTheWall()) {\r\n      MoveLeft();\r\n    }\r\n  } else if (key.keyCode === KEYS.RIGHT && !pause) {\r\n    direction = DIRECTION.RIGHT;\r\n    if (!HittingTheWall()) {\r\n      MoveRight();\r\n    }\r\n  } else if (key.keyCode === KEYS.DOWN && !pause) {\r\n    direction = DIRECTION.DOWN;\r\n    MoveDown();\r\n  } else if (key.keyCode === 32) {\r\n    RotateTetromino();\r\n  } else if (key.keyCode === KEYS.PAUSE) {\r\n    pause = !pause;\r\n  }\r\n}\r\n\r\nfunction MoveLeft() {\r\n  DeleteTetromino();\r\n  startX--;\r\n  DrawTetromino();\r\n}\r\n\r\nfunction MoveRight() {\r\n  DeleteTetromino();\r\n  startX++;\r\n  DrawTetromino();\r\n}\r\n\r\nfunction MoveDown() {\r\n  if (!VerticalCollision()) {\r\n    DeleteTetromino();\r\n    startY++;\r\n    DrawTetromino();\r\n  }\r\n}\r\n\r\nfunction setSpeed(speed) {\r\n  time = window.setInterval(() => {\r\n    if (!pause) {\r\n      if (winOrLose != "Game over") {\r\n        MoveDown();\r\n      }\r\n    }\r\n  }, 1000 / speed);\r\n}\r\n\r\n// setSpeed(speed);\r\n\r\nfunction CreateTetromino() {\r\n  let randomTetromino = Math.floor(Math.random() * tetrominos.length);\r\n  currentTetromino = tetrominos[randomTetromino];\r\n  currentTetrominoColor = shapesColors[randomTetromino];\r\n}\r\n\r\nfunction HittingTheWall() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let newX = currentTetromino[i][0] + startX;\r\n    if (newX <= 0 && direction === DIRECTION.LEFT) {\r\n      return true;\r\n    } else if (newX >= 15 && direction === DIRECTION.RIGHT) {\r\n      return true;\r\n    }\r\n  }\r\n  return false;\r\n}\r\n\r\nfunction VerticalCollision() {\r\n  let copyTetromino = currentTetromino;\r\n  let collision = false;\r\n  for (let i = 0; i < copyTetromino.length; i++) {\r\n    let shape = copyTetromino[i];\r\n    let x = shape[0] + startX;\r\n    let y = shape[1] + startY;\r\n    if (direction === DIRECTION.DOWN) {\r\n      y++;\r\n    }\r\n\r\n    if (typeof stoppedShapeArray[x][y + 1] === "string") {\r\n      DeleteTetromino();\r\n      startY++;\r\n      DrawTetromino();\r\n      collision = true;\r\n      break;\r\n    }\r\n    if (y >= 25) {\r\n      collision = true;\r\n      break;\r\n    }\r\n  }\r\n  if (collision) {\r\n    if (startY <= 4) {\r\n      winOrLose = "Game Over";\r\n      ctx.fillStyle = "red";\r\n      ctx.fillText(winOrLose, 310, 100);\r\n    } else {\r\n      for (let i = 0; i < copyTetromino.length; i++) {\r\n        let shape = copyTetromino[i];\r\n        let x = shape[0] + startX;\r\n        let y = shape[1] + startY;\r\n        stoppedShapeArray[x][y] = currentTetrominoColor;\r\n      }\r\n\r\n      CompletedRows();\r\n      CreateTetromino();\r\n      direction = DIRECTION.IDLE;\r\n      startX = 6;\r\n      startY = 0;\r\n      DrawTetromino();\r\n    }\r\n  }\r\n}\r\n\r\nfunction HorizontalCollision() {\r\n  var copyTetromino = currentTetromino;\r\n  var collision = false;\r\n  for (var i = 0; i < copyTetromino.length; i++) {\r\n    var shape = copyTetromino[i];\r\n    var x = shape[0] + startX;\r\n    var y = shape[1] + startY;\r\n\r\n    if (direction === DIRECTION.LEFT) {\r\n      x--;\r\n    } else if (direction === DIRECTION.RIGHT) {\r\n      x++;\r\n    }\r\n    var stoppedShapeValue = stoppedShapeArray[x][y];\r\n    if (typeof stoppedShapeValue === "string") {\r\n      collision = true;\r\n      break;\r\n    }\r\n  }\r\n  return collision;\r\n}\r\n\r\nfunction CompletedRows() {\r\n  var rowsToDelete = 0;\r\n  let startOfDeletion = 0;\r\n\r\n  for (let y = 0; y < gameBoardArrayHeight; y++) {\r\n    let completed = true;\r\n    for (let x = 0; x < gameBoardArrayWidth; x++) {\r\n      let shape = stoppedShapeArray[x][y];\r\n      console.log("shape", shape);\r\n      if (shape === 0 || typeof shape === "undefined") {\r\n        completed = false;\r\n        break;\r\n      }\r\n    }\r\n    if (completed) {\r\n      if (startOfDeletion === 0) startOfDeletion = y + 4;\r\n      rowsToDelete++;\r\n      for (let i = 0; i < gameBoardArrayWidth; i++) {\r\n        stoppedShapeArray[i][y] = 0;\r\n        gameBoardArray[i][y] = 0;\r\n        let coorX = coordinateArray[i][y].x;\r\n        let coorY = coordinateArray[i][y].y;\r\n        ctx.fillStyle = "white";\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n      }\r\n    }\r\n  }\r\n  if (rowsToDelete > 0) {\r\n    score += 10;\r\n    if (score > localStorage.getItem(highScore)) {\r\n      localStorage.setItem(highScore, score);\r\n    }\r\n    ctx.fillRect(570, 85, 40, 25);\r\n    ctx.fillStyle = "green";\r\n    ctx.fillText(score.toString(), 570, 100);\r\n    MoveRowsDown(rowsToDelete, startOfDeletion);\r\n    if (score % levelUp === 0) {\r\n      speed = speed + 0.2;\r\n      level++;\r\n      ctx.fillRect(560, 130, 40, 25);\r\n      ctx.fillStyle = "green";\r\n      ctx.fillText(level.toString(), 570, 150);\r\n      clearInterval(time);\r\n      setSpeed(speed);\r\n    }\r\n  }\r\n}\r\n\r\nfunction MoveRowsDown(rowsToDelete, startOfDeletion) {\r\n  for (let i = startOfDeletion - 1; i >= 0; i--) {\r\n    for (let x = 0; x < gameBoardArrayWidth; x++) {\r\n      let y2 = i + rowsToDelete;\r\n      let shape = stoppedShapeArray[x][i];\r\n      let nextShape = stoppedShapeArray[x][y2];\r\n      if (typeof shape === "string") {\r\n        nextShape = shape;\r\n        gameBoardArray[x][y2] = 1;\r\n        stoppedShapeArray[x][y2] = shape;\r\n        let coorX = coordinateArray[x][y2].x;\r\n        let coorY = coordinateArray[x][y2].y;\r\n        ctx.fillStyle = nextShape;\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n        shape = 0;\r\n        gameBoardArray[x][i] = 0;\r\n        stoppedShapeArray[x][i] = 0;\r\n        coorX = coordinateArray[x][i].x;\r\n        coorY = coordinateArray[x][i].y;\r\n        ctx.fillStyle = "white";\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nfunction RotateTetromino() {\r\n  let newRotation = new Array();\r\n  let tetrominoCopy = currentTetromino;\r\n  let currentTetrominoBackUp;\r\n  for (let i = 0; i < tetrominoCopy.length; i++) {\r\n    currentTetrominoBackUp = [...currentTetromino];\r\n    let x = tetrominoCopy[i][0];\r\n    let y = tetrominoCopy[i][1];\r\n    let newX = GetLastSquareX() - y;\r\n    let newY = x;\r\n    newRotation.push([newX, newY]);\r\n  }\r\n  DeleteTetromino();\r\n  try {\r\n    currentTetromino = newRotation;\r\n    DrawTetromino();\r\n  } catch (e) {\r\n    if (e instanceof TypeError) {\r\n      currentTetromino = currentTetrominoBackUp;\r\n      DeleteTetromino();\r\n      DrawTetromino();\r\n    }\r\n  }\r\n}\r\nfunction GetLastSquareX() {\r\n  let lastX = 0;\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let square = currentTetromino[i];\r\n    if (square[0] > lastX) lastX = square[0];\r\n  }\r\n  return lastX;\r\n}\r\n\r\n// Number of key\r\n// function keyCode(e) {\r\n//   console.log(e.keyCode);\r\n// }\r\n// window.addEventListener("keydown", keyCode);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFVBQVU7QUFDM0IscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQiw2QkFBNkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaWYgKFwic2VydmljZVdvcmtlclwiIGluIG5hdmlnYXRvcikge1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKFwic2VydmljZXdvcmtlci5qc1wiKS50aGVuKFxyXG4gICAgICBmdW5jdGlvbihyZWdpc3RyYXRpb24pIHtcclxuICAgICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgIFwiU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlOiBcIixcclxuICAgICAgICAgIHJlZ2lzdHJhdGlvbi5zY29wZVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWRcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogXCIsIGVycik7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmxldCBjYW52YXM7XHJcbmxldCBjdHg7XHJcbmxldCBnYW1lQm9hcmRBcnJheUhlaWdodCA9IDI1O1xyXG5sZXQgZ2FtZUJvYXJkQXJyYXlXaWR0aCA9IDE2O1xyXG5sZXQgaGlnaFNjb3JlID0gMDtcclxubGV0IGxldmVsID0gMTtcclxuY29uc3QgbGV2ZWxVcCA9IDIwO1xyXG5sZXQgcGF1c2UgPSBmYWxzZTtcclxubGV0IHNjb3JlID0gMDtcclxubGV0IHNwZWVkID0gMTtcclxubGV0IHN0YXJ0WCA9IDY7XHJcbmxldCBzdGFydFkgPSAwO1xyXG5sZXQgdGV0cmlzTG9nbztcclxubGV0IHRpbWU7XHJcbmxldCB3aW5Pckxvc2UgPSBcIlBsYXlpbmdcIjtcclxuXHJcbmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaGlnaFNjb3JlXCIsIDApO1xyXG5pZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGlnaFNjb3JlKSkge1xyXG4gIGhpZ2hTY29yZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaGlnaFNjb3JlXCIpO1xyXG59IGVsc2Uge1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaGlnaFNjb3JlXCIsIDApO1xyXG59XHJcblxyXG5sZXQgY29vcmRpbmF0ZUFycmF5ID0gWy4uLkFycmF5KGdhbWVCb2FyZEFycmF5SGVpZ2h0KV0ubWFwKGUgPT5cclxuICBBcnJheShnYW1lQm9hcmRBcnJheVdpZHRoKS5maWxsKDApXHJcbik7XHJcbmxldCBnYW1lQm9hcmRBcnJheSA9IFsuLi5BcnJheShnYW1lQm9hcmRBcnJheUhlaWdodCldLm1hcChlID0+XHJcbiAgQXJyYXkoZ2FtZUJvYXJkQXJyYXlXaWR0aCkuZmlsbCgwKVxyXG4pO1xyXG5sZXQgc3RvcHBlZFNoYXBlQXJyYXkgPSBbLi4uQXJyYXkoZ2FtZUJvYXJkQXJyYXlIZWlnaHQpXS5tYXAoZSA9PlxyXG4gIEFycmF5KGdhbWVCb2FyZEFycmF5V2lkdGgpLmZpbGwoMClcclxuKTtcclxuXHJcbmxldCBjdXJyZW50VGV0cm9taW5vID0gW1xyXG4gIC8vIFQgU2hhcGVcclxuICBbMSwgMF0sXHJcbiAgWzAsIDFdLFxyXG4gIFsxLCAxXSxcclxuICBbMiwgMV1cclxuXTtcclxuXHJcbi8vQ3JlYXRlIHNoYXBlc1xyXG5sZXQgdGV0cm9taW5vcyA9IFtdO1xyXG5mdW5jdGlvbiBDcmVhdGVTaGFwZXMoKSB7XHJcbiAgLy8gVCBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxuICAvLyBJIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFswLCAwXSxcclxuICAgIFsxLCAwXSxcclxuICAgIFsyLCAwXSxcclxuICAgIFszLCAwXVxyXG4gIF0pO1xyXG4gIC8vIEogU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzAsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdLFxyXG4gICAgWzIsIDFdXHJcbiAgXSk7XHJcbiAgLy8gU3F1YXJlIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFswLCAwXSxcclxuICAgIFsxLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXVxyXG4gIF0pO1xyXG4gIC8vIEwgU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzIsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdLFxyXG4gICAgWzIsIDFdXHJcbiAgXSk7XHJcbiAgLy8gUyBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMiwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV1cclxuICBdKTtcclxuICAvLyBaIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFswLCAwXSxcclxuICAgIFsxLCAwXSxcclxuICAgIFsxLCAxXSxcclxuICAgIFsyLCAxXVxyXG4gIF0pO1xyXG59XHJcbmxldCBzaGFwZXNDb2xvcnMgPSBbXHJcbiAgXCJsaW1lXCIsXHJcbiAgXCJjeWFuXCIsXHJcbiAgXCJibHVlXCIsXHJcbiAgXCJncmVlblwiLFxyXG4gIFwicmVkXCIsXHJcbiAgXCJvcmFuZ2VcIixcclxuICBcIm1hZ2VudGFcIlxyXG5dO1xyXG5sZXQgY3VycmVudFRldHJvbWlub0NvbG9yID0gXCJjb3JhbFwiO1xyXG5cclxubGV0IERJUkVDVElPTiA9IHtcclxuICBJRExFOiAwLFxyXG4gIERPV046IDEsXHJcbiAgTEVGVDogMixcclxuICBSSUdIVDogM1xyXG59O1xyXG5cclxubGV0IEtFWVMgPSB7XHJcbiAgTEVGVDogNjUsXHJcbiAgSURMRTogODcsXHJcbiAgUklHSFQ6IDY4LFxyXG4gIERPV046IDgzLFxyXG4gIFBBVVNFOiA4MFxyXG59O1xyXG5cclxubGV0IGRpcmVjdGlvbjtcclxuXHJcbmNsYXNzIENvb3JkaW5hdGVzIHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUNvb3JkQXJyYXkoKSB7XHJcbiAgbGV0IGkgPSAwLFxyXG4gICAgaiA9IDA7XHJcbiAgZm9yIChsZXQgeSA9IDQ7IHkgPD0gNTUwOyB5ICs9IDIyKSB7XHJcbiAgICBmb3IgKGxldCB4ID0gMTQwOyB4IDw9IDQ3MDsgeCArPSAyMikge1xyXG4gICAgICBjb29yZGluYXRlQXJyYXlbaV1bal0gPSBuZXcgQ29vcmRpbmF0ZXMoeCwgeSk7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuICAgIGorKztcclxuICAgIGkgPSAwO1xyXG4gIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgU2V0dXBDYW52YXMpO1xyXG5cclxuZnVuY3Rpb24gU2V0dXBDYW52YXMoKSB7XHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XHJcbiAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICBjYW52YXMud2lkdGggPSA2NDA7XHJcbiAgY2FudmFzLmhlaWdodCA9IDU1ODtcclxuXHJcbiAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gIGN0eC5zdHJva2VSZWN0KDEzOCwgMiwgMzU0LCA1NTIpO1xyXG5cclxuICB0ZXRyaXNMb2dvID0gbmV3IEltYWdlKDE2MCwgNTApO1xyXG4gIHRldHJpc0xvZ28ub25sb2FkID0gRHJhd1RldHJpc0xvZ287XHJcbiAgdGV0cmlzTG9nby5zcmMgPSBcIi4uL2Fzc2V0cy9pbWcvaW5kZWtzLmpwZ1wiO1xyXG5cclxuICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG4gIGN0eC5mb250ID0gXCIxLjNyZW0gQXJpYWxcIjtcclxuXHJcbiAgY3R4LmZpbGxUZXh0KFwiU2NvcmVcIiwgNTAwLCAxMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoc2NvcmUudG9TdHJpbmcoKSwgNTcwLCAxMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoXCJMZXZlbFwiLCA1MDAsIDE1MCk7XHJcbiAgY3R4LmZpbGxUZXh0KGxldmVsLnRvU3RyaW5nKCksIDU3MCwgMTUwKTtcclxuXHJcbiAgY3R4LmZpbGxUZXh0KHdpbk9yTG9zZSwgNTAwLCAyMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoXCJDT05UUk9MU1wiLCA1MDAsIDMyMCk7XHJcblxyXG4gIGN0eC5maWxsVGV4dChcIkE6IE1vdmUgbGVmdFwiLCA1MDAsIDM1MCk7XHJcbiAgY3R4LmZpbGxUZXh0KFwiRDogTW92ZSByaWdodFwiLCA1MDAsIDM4MCk7XHJcbiAgY3R4LmZpbGxUZXh0KFwiUzogTW92ZSBkb3duXCIsIDUwMCwgNDEwKTtcclxuICBjdHguZmlsbFRleHQoXCJTcGFjZTogcm90YXRlXCIsIDUwMCwgNDQwKTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlS2V5UHJlc3MpO1xyXG5cclxuICBDcmVhdGVTaGFwZXMoKTtcclxuICBDcmVhdGVUZXRyb21pbm8oKTtcclxuICBDcmVhdGVDb29yZEFycmF5KCk7XHJcbiAgRHJhd1RldHJvbWlubygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBEcmF3VGV0cmlzTG9nbygpIHtcclxuICBjdHguZHJhd0ltYWdlKHRldHJpc0xvZ28sIDAsIDUwLCAxMzAsIDcwKTtcclxuICBjdHguZHJhd0ltYWdlKHRldHJpc0xvZ28sIDAsIDEwMCwgMTMwLCA3MCk7XHJcbiAgY3R4LmRyYXdJbWFnZSh0ZXRyaXNMb2dvLCAwLCAxNTAsIDEzMCwgNzApO1xyXG4gIGN0eC5kcmF3SW1hZ2UodGV0cmlzTG9nbywgMCwgMjAwLCAxMzAsIDcwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gRHJhd1RldHJvbWlubygpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCB4ID0gY3VycmVudFRldHJvbWlub1tpXVswXSArIHN0YXJ0WDtcclxuICAgIGxldCB5ID0gY3VycmVudFRldHJvbWlub1tpXVsxXSArIHN0YXJ0WTtcclxuICAgIGdhbWVCb2FyZEFycmF5W3hdW3ldID0gMTtcclxuICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS54O1xyXG4gICAgbGV0IGNvb3JZID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLnk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY3VycmVudFRldHJvbWlub0NvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KGNvb3JYLCBjb29yWSwgMjAsIDIwKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gRGVsZXRlVGV0cm9taW5vKCkge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHggPSBjdXJyZW50VGV0cm9taW5vW2ldWzBdICsgc3RhcnRYO1xyXG4gICAgbGV0IHkgPSBjdXJyZW50VGV0cm9taW5vW2ldWzFdICsgc3RhcnRZO1xyXG4gICAgZ2FtZUJvYXJkQXJyYXlbeF1beV0gPSAxO1xyXG4gICAgbGV0IGNvb3JYID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLng7XHJcbiAgICBsZXQgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1beV0ueTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMCwgMjApO1xyXG4gIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlS2V5UHJlc3MpO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlS2V5UHJlc3Moa2V5KSB7XHJcbiAgaWYgKGtleS5rZXlDb2RlID09PSBLRVlTLkxFRlQgJiYgIXBhdXNlKSB7XHJcbiAgICBkaXJlY3Rpb24gPSBESVJFQ1RJT04uTEVGVDtcclxuICAgIGlmICghSGl0dGluZ1RoZVdhbGwoKSkge1xyXG4gICAgICBNb3ZlTGVmdCgpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IEtFWVMuUklHSFQgJiYgIXBhdXNlKSB7XHJcbiAgICBkaXJlY3Rpb24gPSBESVJFQ1RJT04uUklHSFQ7XHJcbiAgICBpZiAoIUhpdHRpbmdUaGVXYWxsKCkpIHtcclxuICAgICAgTW92ZVJpZ2h0KCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChrZXkua2V5Q29kZSA9PT0gS0VZUy5ET1dOICYmICFwYXVzZSkge1xyXG4gICAgZGlyZWN0aW9uID0gRElSRUNUSU9OLkRPV047XHJcbiAgICBNb3ZlRG93bigpO1xyXG4gIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IDMyKSB7XHJcbiAgICBSb3RhdGVUZXRyb21pbm8oKTtcclxuICB9IGVsc2UgaWYgKGtleS5rZXlDb2RlID09PSBLRVlTLlBBVVNFKSB7XHJcbiAgICBwYXVzZSA9ICFwYXVzZTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1vdmVMZWZ0KCkge1xyXG4gIERlbGV0ZVRldHJvbWlubygpO1xyXG4gIHN0YXJ0WC0tO1xyXG4gIERyYXdUZXRyb21pbm8oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gTW92ZVJpZ2h0KCkge1xyXG4gIERlbGV0ZVRldHJvbWlubygpO1xyXG4gIHN0YXJ0WCsrO1xyXG4gIERyYXdUZXRyb21pbm8oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gTW92ZURvd24oKSB7XHJcbiAgaWYgKCFWZXJ0aWNhbENvbGxpc2lvbigpKSB7XHJcbiAgICBEZWxldGVUZXRyb21pbm8oKTtcclxuICAgIHN0YXJ0WSsrO1xyXG4gICAgRHJhd1RldHJvbWlubygpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U3BlZWQoc3BlZWQpIHtcclxuICB0aW1lID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgIGlmICghcGF1c2UpIHtcclxuICAgICAgaWYgKHdpbk9yTG9zZSAhPSBcIkdhbWUgb3ZlclwiKSB7XHJcbiAgICAgICAgTW92ZURvd24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIDEwMDAgLyBzcGVlZCk7XHJcbn1cclxuXHJcbi8vIHNldFNwZWVkKHNwZWVkKTtcclxuXHJcbmZ1bmN0aW9uIENyZWF0ZVRldHJvbWlubygpIHtcclxuICBsZXQgcmFuZG9tVGV0cm9taW5vID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGV0cm9taW5vcy5sZW5ndGgpO1xyXG4gIGN1cnJlbnRUZXRyb21pbm8gPSB0ZXRyb21pbm9zW3JhbmRvbVRldHJvbWlub107XHJcbiAgY3VycmVudFRldHJvbWlub0NvbG9yID0gc2hhcGVzQ29sb3JzW3JhbmRvbVRldHJvbWlub107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEhpdHRpbmdUaGVXYWxsKCkge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IG5ld1ggPSBjdXJyZW50VGV0cm9taW5vW2ldWzBdICsgc3RhcnRYO1xyXG4gICAgaWYgKG5ld1ggPD0gMCAmJiBkaXJlY3Rpb24gPT09IERJUkVDVElPTi5MRUZUKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChuZXdYID49IDE1ICYmIGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLlJJR0hUKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFZlcnRpY2FsQ29sbGlzaW9uKCkge1xyXG4gIGxldCBjb3B5VGV0cm9taW5vID0gY3VycmVudFRldHJvbWlubztcclxuICBsZXQgY29sbGlzaW9uID0gZmFsc2U7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgc2hhcGUgPSBjb3B5VGV0cm9taW5vW2ldO1xyXG4gICAgbGV0IHggPSBzaGFwZVswXSArIHN0YXJ0WDtcclxuICAgIGxldCB5ID0gc2hhcGVbMV0gKyBzdGFydFk7XHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uRE9XTikge1xyXG4gICAgICB5Kys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzdG9wcGVkU2hhcGVBcnJheVt4XVt5ICsgMV0gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgICAgIHN0YXJ0WSsrO1xyXG4gICAgICBEcmF3VGV0cm9taW5vKCk7XHJcbiAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYgKHkgPj0gMjUpIHtcclxuICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChjb2xsaXNpb24pIHtcclxuICAgIGlmIChzdGFydFkgPD0gNCkge1xyXG4gICAgICB3aW5Pckxvc2UgPSBcIkdhbWUgT3ZlclwiO1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgY3R4LmZpbGxUZXh0KHdpbk9yTG9zZSwgMzEwLCAxMDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHNoYXBlID0gY29weVRldHJvbWlub1tpXTtcclxuICAgICAgICBsZXQgeCA9IHNoYXBlWzBdICsgc3RhcnRYO1xyXG4gICAgICAgIGxldCB5ID0gc2hhcGVbMV0gKyBzdGFydFk7XHJcbiAgICAgICAgc3RvcHBlZFNoYXBlQXJyYXlbeF1beV0gPSBjdXJyZW50VGV0cm9taW5vQ29sb3I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIENvbXBsZXRlZFJvd3MoKTtcclxuICAgICAgQ3JlYXRlVGV0cm9taW5vKCk7XHJcbiAgICAgIGRpcmVjdGlvbiA9IERJUkVDVElPTi5JRExFO1xyXG4gICAgICBzdGFydFggPSA2O1xyXG4gICAgICBzdGFydFkgPSAwO1xyXG4gICAgICBEcmF3VGV0cm9taW5vKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBIb3Jpem9udGFsQ29sbGlzaW9uKCkge1xyXG4gIHZhciBjb3B5VGV0cm9taW5vID0gY3VycmVudFRldHJvbWlubztcclxuICB2YXIgY29sbGlzaW9uID0gZmFsc2U7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3B5VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc2hhcGUgPSBjb3B5VGV0cm9taW5vW2ldO1xyXG4gICAgdmFyIHggPSBzaGFwZVswXSArIHN0YXJ0WDtcclxuICAgIHZhciB5ID0gc2hhcGVbMV0gKyBzdGFydFk7XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQpIHtcclxuICAgICAgeC0tO1xyXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5SSUdIVCkge1xyXG4gICAgICB4Kys7XHJcbiAgICB9XHJcbiAgICB2YXIgc3RvcHBlZFNoYXBlVmFsdWUgPSBzdG9wcGVkU2hhcGVBcnJheVt4XVt5XTtcclxuICAgIGlmICh0eXBlb2Ygc3RvcHBlZFNoYXBlVmFsdWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjb2xsaXNpb247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbXBsZXRlZFJvd3MoKSB7XHJcbiAgdmFyIHJvd3NUb0RlbGV0ZSA9IDA7XHJcbiAgbGV0IHN0YXJ0T2ZEZWxldGlvbiA9IDA7XHJcblxyXG4gIGZvciAobGV0IHkgPSAwOyB5IDwgZ2FtZUJvYXJkQXJyYXlIZWlnaHQ7IHkrKykge1xyXG4gICAgbGV0IGNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGdhbWVCb2FyZEFycmF5V2lkdGg7IHgrKykge1xyXG4gICAgICBsZXQgc2hhcGUgPSBzdG9wcGVkU2hhcGVBcnJheVt4XVt5XTtcclxuICAgICAgY29uc29sZS5sb2coXCJzaGFwZVwiLCBzaGFwZSk7XHJcbiAgICAgIGlmIChzaGFwZSA9PT0gMCB8fCB0eXBlb2Ygc2hhcGUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNvbXBsZXRlZCkge1xyXG4gICAgICBpZiAoc3RhcnRPZkRlbGV0aW9uID09PSAwKSBzdGFydE9mRGVsZXRpb24gPSB5ICsgNDtcclxuICAgICAgcm93c1RvRGVsZXRlKys7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZUJvYXJkQXJyYXlXaWR0aDsgaSsrKSB7XHJcbiAgICAgICAgc3RvcHBlZFNoYXBlQXJyYXlbaV1beV0gPSAwO1xyXG4gICAgICAgIGdhbWVCb2FyZEFycmF5W2ldW3ldID0gMDtcclxuICAgICAgICBsZXQgY29vclggPSBjb29yZGluYXRlQXJyYXlbaV1beV0ueDtcclxuICAgICAgICBsZXQgY29vclkgPSBjb29yZGluYXRlQXJyYXlbaV1beV0ueTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdChjb29yWCwgY29vclksIDIwLCAyMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHJvd3NUb0RlbGV0ZSA+IDApIHtcclxuICAgIHNjb3JlICs9IDEwO1xyXG4gICAgaWYgKHNjb3JlID4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oaGlnaFNjb3JlKSkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoaWdoU2NvcmUsIHNjb3JlKTtcclxuICAgIH1cclxuICAgIGN0eC5maWxsUmVjdCg1NzAsIDg1LCA0MCwgMjUpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgIGN0eC5maWxsVGV4dChzY29yZS50b1N0cmluZygpLCA1NzAsIDEwMCk7XHJcbiAgICBNb3ZlUm93c0Rvd24ocm93c1RvRGVsZXRlLCBzdGFydE9mRGVsZXRpb24pO1xyXG4gICAgaWYgKHNjb3JlICUgbGV2ZWxVcCA9PT0gMCkge1xyXG4gICAgICBzcGVlZCA9IHNwZWVkICsgMC4yO1xyXG4gICAgICBsZXZlbCsrO1xyXG4gICAgICBjdHguZmlsbFJlY3QoNTYwLCAxMzAsIDQwLCAyNSk7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgIGN0eC5maWxsVGV4dChsZXZlbC50b1N0cmluZygpLCA1NzAsIDE1MCk7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZSk7XHJcbiAgICAgIHNldFNwZWVkKHNwZWVkKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1vdmVSb3dzRG93bihyb3dzVG9EZWxldGUsIHN0YXJ0T2ZEZWxldGlvbikge1xyXG4gIGZvciAobGV0IGkgPSBzdGFydE9mRGVsZXRpb24gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBnYW1lQm9hcmRBcnJheVdpZHRoOyB4KyspIHtcclxuICAgICAgbGV0IHkyID0gaSArIHJvd3NUb0RlbGV0ZTtcclxuICAgICAgbGV0IHNoYXBlID0gc3RvcHBlZFNoYXBlQXJyYXlbeF1baV07XHJcbiAgICAgIGxldCBuZXh0U2hhcGUgPSBzdG9wcGVkU2hhcGVBcnJheVt4XVt5Ml07XHJcbiAgICAgIGlmICh0eXBlb2Ygc2hhcGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBuZXh0U2hhcGUgPSBzaGFwZTtcclxuICAgICAgICBnYW1lQm9hcmRBcnJheVt4XVt5Ml0gPSAxO1xyXG4gICAgICAgIHN0b3BwZWRTaGFwZUFycmF5W3hdW3kyXSA9IHNoYXBlO1xyXG4gICAgICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5Ml0ueDtcclxuICAgICAgICBsZXQgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1beTJdLnk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IG5leHRTaGFwZTtcclxuICAgICAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMCwgMjApO1xyXG4gICAgICAgIHNoYXBlID0gMDtcclxuICAgICAgICBnYW1lQm9hcmRBcnJheVt4XVtpXSA9IDA7XHJcbiAgICAgICAgc3RvcHBlZFNoYXBlQXJyYXlbeF1baV0gPSAwO1xyXG4gICAgICAgIGNvb3JYID0gY29vcmRpbmF0ZUFycmF5W3hdW2ldLng7XHJcbiAgICAgICAgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1baV0ueTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdChjb29yWCwgY29vclksIDIwLCAyMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJvdGF0ZVRldHJvbWlubygpIHtcclxuICBsZXQgbmV3Um90YXRpb24gPSBuZXcgQXJyYXkoKTtcclxuICBsZXQgdGV0cm9taW5vQ29weSA9IGN1cnJlbnRUZXRyb21pbm87XHJcbiAgbGV0IGN1cnJlbnRUZXRyb21pbm9CYWNrVXA7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXRyb21pbm9Db3B5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjdXJyZW50VGV0cm9taW5vQmFja1VwID0gWy4uLmN1cnJlbnRUZXRyb21pbm9dO1xyXG4gICAgbGV0IHggPSB0ZXRyb21pbm9Db3B5W2ldWzBdO1xyXG4gICAgbGV0IHkgPSB0ZXRyb21pbm9Db3B5W2ldWzFdO1xyXG4gICAgbGV0IG5ld1ggPSBHZXRMYXN0U3F1YXJlWCgpIC0geTtcclxuICAgIGxldCBuZXdZID0geDtcclxuICAgIG5ld1JvdGF0aW9uLnB1c2goW25ld1gsIG5ld1ldKTtcclxuICB9XHJcbiAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgdHJ5IHtcclxuICAgIGN1cnJlbnRUZXRyb21pbm8gPSBuZXdSb3RhdGlvbjtcclxuICAgIERyYXdUZXRyb21pbm8oKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xyXG4gICAgICBjdXJyZW50VGV0cm9taW5vID0gY3VycmVudFRldHJvbWlub0JhY2tVcDtcclxuICAgICAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgICAgIERyYXdUZXRyb21pbm8oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuZnVuY3Rpb24gR2V0TGFzdFNxdWFyZVgoKSB7XHJcbiAgbGV0IGxhc3RYID0gMDtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBzcXVhcmUgPSBjdXJyZW50VGV0cm9taW5vW2ldO1xyXG4gICAgaWYgKHNxdWFyZVswXSA+IGxhc3RYKSBsYXN0WCA9IHNxdWFyZVswXTtcclxuICB9XHJcbiAgcmV0dXJuIGxhc3RYO1xyXG59XHJcblxyXG4vLyBOdW1iZXIgb2Yga2V5XHJcbi8vIGZ1bmN0aW9uIGtleUNvZGUoZSkge1xyXG4vLyAgIGNvbnNvbGUubG9nKGUua2V5Q29kZSk7XHJcbi8vIH1cclxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGtleUNvZGUpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);