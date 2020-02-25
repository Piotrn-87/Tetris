!function(r){var c={};function n(t){if(c[t])return c[t].exports;var l=c[t]={i:t,l:!1,exports:{}};return r[t].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=r,n.c=c,n.d=function(r,c,t){n.o(r,c)||Object.defineProperty(r,c,{enumerable:!0,get:t})},n.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},n.t=function(r,c){if(1&c&&(r=n(r)),8&c)return r;if(4&c&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(n.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&c&&"string"!=typeof r)for(var l in r)n.d(t,l,function(c){return r[c]}.bind(null,l));return t},n.n=function(r){var c=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(c,"a",c),c},n.o=function(r,c){return Object.prototype.hasOwnProperty.call(r,c)},n.p="",n(n.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        // Registration was successful\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        // registration failed\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\nlet canvas;\r\nlet ctx;\r\nlet gameBoardArrayHeight = 25;\r\nlet gameBoardArrayWidth = 16;\r\nlet highScore = 0;\r\nlet level = 1;\r\nconst levelUp = 20;\r\nlet pause = false;\r\nlet score = 0;\r\nlet speed = 1;\r\nlet startX = 6;\r\nlet startY = 0;\r\nlet tetrisLogo;\r\nlet time;\r\nlet winOrLose = "Playing";\r\n\r\nlocalStorage.setItem("highScore", 0);\r\nif (localStorage.getItem(highScore)) {\r\n  highScore = localStorage.getItem("highScore");\r\n} else {\r\n  localStorage.setItem("highScore", 0);\r\n}\r\n\r\nlet coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet gameBoardArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet stoppedShapeArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\n\r\nlet currentTetromino = [\r\n  // T Shape\r\n  [1, 0],\r\n  [0, 1],\r\n  [1, 1],\r\n  [2, 1]\r\n];\r\n\r\n//Create shapes\r\nlet tetrominos = [];\r\nfunction CreateShapes() {\r\n  // T Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // I Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [2, 0],\r\n    [3, 0]\r\n  ]);\r\n  // J Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // Square Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // L Shape\r\n  tetrominos.push([\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // S Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // Z Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n}\r\nlet shapesColors = [\r\n  "lime",\r\n  "cyan",\r\n  "blue",\r\n  "green",\r\n  "red",\r\n  "orange",\r\n  "magenta"\r\n];\r\nlet currentTetrominoColor = "coral";\r\n\r\nlet DIRECTION = {\r\n  IDLE: 0,\r\n  DOWN: 1,\r\n  LEFT: 2,\r\n  RIGHT: 3\r\n};\r\n\r\nlet KEYS = {\r\n  LEFT: 65,\r\n  IDLE: 87,\r\n  RIGHT: 68,\r\n  DOWN: 83,\r\n  PAUSE: 80,\r\n  SPACE: 32\r\n};\r\n\r\nlet direction;\r\n\r\nclass Coordinates {\r\n  constructor(x, y) {\r\n    this.x = x;\r\n    this.y = y;\r\n  }\r\n}\r\n\r\nfunction CreateCoordArray() {\r\n  let i = 0,\r\n    j = 0;\r\n  for (let y = 4; y <= 550; y += 22) {\r\n    for (let x = 140; x <= 470; x += 22) {\r\n      coordinateArray[i][j] = new Coordinates(x, y);\r\n      i++;\r\n    }\r\n    j++;\r\n    i = 0;\r\n  }\r\n}\r\n\r\ndocument.addEventListener("DOMContentLoaded", SetupCanvas);\r\n\r\nfunction SetupCanvas() {\r\n  canvas = document.getElementById("canvas");\r\n  ctx = canvas.getContext("2d");\r\n  canvas.width = 640;\r\n  canvas.height = 558;\r\n\r\n  ctx.fillStyle = "white";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  ctx.strokeStyle = "black";\r\n  ctx.strokeRect(138, 2, 354, 552);\r\n\r\n  tetrisLogo = new Image(160, 50);\r\n  tetrisLogo.onload = DrawTetrisLogo;\r\n  tetrisLogo.src = "assets/img/indeks.jpg";\r\n\r\n  ctx.fillStyle = "green";\r\n  ctx.font = "1.3rem Arial";\r\n\r\n  ctx.fillText("Score", 500, 100);\r\n\r\n  ctx.fillText(score.toString(), 570, 100);\r\n\r\n  ctx.fillText("Level", 500, 150);\r\n  ctx.fillText(level.toString(), 570, 150);\r\n\r\n  ctx.fillText(winOrLose, 500, 200);\r\n\r\n  ctx.fillText("CONTROLS", 500, 320);\r\n\r\n  ctx.fillText("A: Move left", 500, 350);\r\n  ctx.fillText("D: Move right", 500, 380);\r\n  ctx.fillText("S: Move down", 500, 410);\r\n  ctx.fillText("P: Pasue", 500, 440);\r\n  ctx.fillText("Space: Rotate", 500, 470);\r\n\r\n  document.addEventListener("keydown", handleKeyPress);\r\n\r\n  CreateShapes();\r\n  CreateTetromino();\r\n  CreateCoordArray();\r\n  DrawTetromino();\r\n}\r\n\r\nfunction DrawTetrisLogo() {\r\n  ctx.drawImage(tetrisLogo, 0, 50, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 100, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 150, 130, 70);\r\n  ctx.drawImage(tetrisLogo, 0, 200, 130, 70);\r\n}\r\n\r\nfunction DrawTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = currentTetrominoColor;\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n  }\r\n}\r\nfunction DeleteTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = "white";\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n  }\r\n}\r\n\r\ndocument.addEventListener("keydown", handleKeyPress);\r\n\r\nfunction handleKeyPress(key) {\r\n  if (winOrLose != "Game Over") {\r\n    if (key.keyCode === KEYS.LEFT && !pause) {\r\n      MoveLeft();\r\n    } else if (key.keyCode === KEYS.RIGHT && !pause) {\r\n      MoveRight();\r\n    } else if (key.keyCode === KEYS.DOWN && !pause) {\r\n      MoveDown();\r\n    } else if (key.keyCode === KEYS.SPACE && !pause) {\r\n      RotateTetromino();\r\n    } else if (key.keyCode === KEYS.PAUSE) {\r\n      pause = !pause;\r\n      if (pause === true) {\r\n        ctx.fillStyle = "magenta";\r\n        ctx.fillText("PAUSE", 500, 250);\r\n      } else {\r\n        ctx.fillStyle = "white";\r\n        ctx.fillRect(500, 225, 100, 30);\r\n      }\r\n    }\r\n  }\r\n}\r\nfunction MoveLeft() {\r\n  direction = DIRECTION.LEFT;\r\n  if (!HittingTheWall() && !HorizontalCollision()) {\r\n    DeleteTetromino();\r\n    startX--;\r\n    DrawTetromino();\r\n  }\r\n}\r\n\r\nfunction MoveRight() {\r\n  direction = DIRECTION.RIGHT;\r\n  if (!HittingTheWall() && !HorizontalCollision()) {\r\n    DeleteTetromino();\r\n    startX++;\r\n    DrawTetromino();\r\n  }\r\n}\r\n\r\nfunction MoveDown() {\r\n  direction = DIRECTION.DOWN;\r\n  if (!VerticalCollision()) {\r\n    DeleteTetromino();\r\n    startY++;\r\n    DrawTetromino();\r\n  }\r\n}\r\n\r\nfunction setSpeed(speed) {\r\n  time = window.setInterval(() => {\r\n    if (!pause) {\r\n      if (winOrLose != "Game Over") {\r\n        MoveDown();\r\n        console.log(winOrLose);\r\n      }\r\n    }\r\n  }, 1000 / speed);\r\n}\r\n\r\nsetSpeed(speed);\r\n\r\nfunction CreateTetromino() {\r\n  let randomTetromino = Math.floor(Math.random() * tetrominos.length);\r\n  currentTetromino = tetrominos[randomTetromino];\r\n  currentTetrominoColor = shapesColors[randomTetromino];\r\n}\r\n\r\nfunction HittingTheWall() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let newX = currentTetromino[i][0] + startX;\r\n    if (newX <= 0 && direction === DIRECTION.LEFT) {\r\n      return true;\r\n    } else if (newX >= 15 && direction === DIRECTION.RIGHT) {\r\n      return true;\r\n    }\r\n  }\r\n  return false;\r\n}\r\n\r\nfunction VerticalCollision() {\r\n  let copyTetromino = currentTetromino;\r\n  let collision = false;\r\n  for (let i = 0; i < copyTetromino.length; i++) {\r\n    let shape = copyTetromino[i];\r\n    let x = shape[0] + startX;\r\n    let y = shape[1] + startY;\r\n    if (direction === DIRECTION.DOWN) {\r\n      y++;\r\n    }\r\n\r\n    if (typeof stoppedShapeArray[x][y + 1] === "string") {\r\n      DeleteTetromino();\r\n      startY++;\r\n      DrawTetromino();\r\n      collision = true;\r\n      break;\r\n    }\r\n    if (y >= 25) {\r\n      collision = true;\r\n      break;\r\n    }\r\n  }\r\n  if (collision) {\r\n    if (startY <= 4) {\r\n      winOrLose = "Game Over";\r\n      ctx.fillStyle = "white";\r\n      ctx.fillRect(500, 180, 100, 30);\r\n      ctx.fillStyle = "black";\r\n      ctx.fillText(winOrLose, 500, 200);\r\n    } else {\r\n      for (let i = 0; i < copyTetromino.length; i++) {\r\n        let shape = copyTetromino[i];\r\n        let x = shape[0] + startX;\r\n        let y = shape[1] + startY;\r\n        stoppedShapeArray[x][y] = currentTetrominoColor;\r\n      }\r\n\r\n      CompletedRows();\r\n      CreateTetromino();\r\n      direction = DIRECTION.IDLE;\r\n      startX = 6;\r\n      startY = 0;\r\n      DrawTetromino();\r\n    }\r\n  }\r\n}\r\n\r\nfunction HorizontalCollision() {\r\n  var copyTetromino = currentTetromino;\r\n  var collision = false;\r\n  for (var i = 0; i < copyTetromino.length; i++) {\r\n    var shape = copyTetromino[i];\r\n    var x = shape[0] + startX;\r\n    var y = shape[1] + startY;\r\n\r\n    if (direction === DIRECTION.LEFT) {\r\n      x--;\r\n    } else if (direction === DIRECTION.RIGHT) {\r\n      x++;\r\n    }\r\n    var stoppedShapeValue = stoppedShapeArray[x][y];\r\n    if (typeof stoppedShapeValue === "string") {\r\n      collision = true;\r\n      break;\r\n    }\r\n  }\r\n  return collision;\r\n}\r\n\r\nfunction CompletedRows() {\r\n  var rowsToDelete = 0;\r\n  let startOfDeletion = 0;\r\n\r\n  for (let y = 0; y < gameBoardArrayHeight; y++) {\r\n    let completed = true;\r\n    for (let x = 0; x < gameBoardArrayWidth; x++) {\r\n      let shape = stoppedShapeArray[x][y];\r\n      console.log("shape", shape);\r\n      if (shape === 0 || typeof shape === "undefined") {\r\n        completed = false;\r\n        break;\r\n      }\r\n    }\r\n    if (completed) {\r\n      if (startOfDeletion === 0) startOfDeletion = y + 4;\r\n      rowsToDelete++;\r\n      for (let i = 0; i < gameBoardArrayWidth; i++) {\r\n        stoppedShapeArray[i][y] = 0;\r\n        gameBoardArray[i][y] = 0;\r\n        let coorX = coordinateArray[i][y].x;\r\n        let coorY = coordinateArray[i][y].y;\r\n        ctx.fillStyle = "white";\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n      }\r\n    }\r\n  }\r\n  if (rowsToDelete > 0) {\r\n    score += 10;\r\n    if (score > localStorage.getItem("highScore")) {\r\n      localStorage.setItem("highScore", score);\r\n    }\r\n    ctx.fillRect(570, 85, 40, 25);\r\n    ctx.fillStyle = "green";\r\n    ctx.fillText(score.toString(), 570, 100);\r\n    MoveRowsDown(rowsToDelete, startOfDeletion);\r\n    if (score % levelUp === 0) {\r\n      speed = speed + 0.2;\r\n      level++;\r\n      ctx.fillRect(560, 130, 40, 25);\r\n      ctx.fillStyle = "green";\r\n      ctx.fillText(level.toString(), 570, 150);\r\n      clearInterval(time);\r\n      setSpeed(speed);\r\n    }\r\n  }\r\n}\r\n\r\nfunction MoveRowsDown(rowsToDelete, startOfDeletion) {\r\n  for (var i = startOfDeletion - 1; i >= 0; i--) {\r\n    for (var x = 0; x < gameBoardArrayWidth; x++) {\r\n      var y2 = i + rowsToDelete;\r\n      var shape = stoppedShapeArray[x][i];\r\n      var nextShape = stoppedShapeArray[x][y2];\r\n      if (typeof shape === "string") {\r\n        nextShape = shape;\r\n        gameBoardArray[x][y2] = 1;\r\n        stoppedShapeArray[x][y2] = shape;\r\n        let coorX = coordinateArray[x][y2].x;\r\n        let coorY = coordinateArray[x][y2].y;\r\n        ctx.fillStyle = nextShape;\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n        shape = 0;\r\n        gameBoardArray[x][i] = 0;\r\n        stoppedShapeArray[x][i] = 0;\r\n        coorX = coordinateArray[x][i].x;\r\n        coorY = coordinateArray[x][i].y;\r\n        ctx.fillStyle = "white";\r\n        ctx.fillRect(coorX, coorY, 20, 20);\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nfunction RotateTetromino() {\r\n  let newRotation = new Array();\r\n  let tetrominoCopy = currentTetromino;\r\n  let currentTetrominoBackUp;\r\n  for (let i = 0; i < tetrominoCopy.length; i++) {\r\n    currentTetrominoBackUp = [...currentTetromino];\r\n    let x = tetrominoCopy[i][0];\r\n    let y = tetrominoCopy[i][1];\r\n    let newX = GetLastSquareX() - y;\r\n    let newY = x;\r\n    newRotation.push([newX, newY]);\r\n  }\r\n  DeleteTetromino();\r\n  try {\r\n    currentTetromino = newRotation;\r\n    DrawTetromino();\r\n  } catch (e) {\r\n    if (e instanceof TypeError) {\r\n      currentTetromino = currentTetrominoBackUp;\r\n      DeleteTetromino();\r\n      DrawTetromino();\r\n    }\r\n  }\r\n}\r\nfunction GetLastSquareX() {\r\n  let lastX = 0;\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let square = currentTetromino[i];\r\n    if (square[0] > lastX) lastX = square[0];\r\n  }\r\n  return lastX;\r\n}\r\n\r\n// Number of key\r\n// function keyCode(e) {\r\n//   console.log(e.keyCode);\r\n// }\r\n// window.addEventListener("keydown", keyCode);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVTtBQUMzQixxQkFBcUIsVUFBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQSxtQkFBbUIseUJBQXlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0MsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoXCJzZXJ2aWNld29ya2VyLmpzXCIpLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGU6IFwiLFxyXG4gICAgICAgICAgcmVnaXN0cmF0aW9uLnNjb3BlXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiBcIiwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KTtcclxufVxyXG5cclxubGV0IGNhbnZhcztcclxubGV0IGN0eDtcclxubGV0IGdhbWVCb2FyZEFycmF5SGVpZ2h0ID0gMjU7XHJcbmxldCBnYW1lQm9hcmRBcnJheVdpZHRoID0gMTY7XHJcbmxldCBoaWdoU2NvcmUgPSAwO1xyXG5sZXQgbGV2ZWwgPSAxO1xyXG5jb25zdCBsZXZlbFVwID0gMjA7XHJcbmxldCBwYXVzZSA9IGZhbHNlO1xyXG5sZXQgc2NvcmUgPSAwO1xyXG5sZXQgc3BlZWQgPSAxO1xyXG5sZXQgc3RhcnRYID0gNjtcclxubGV0IHN0YXJ0WSA9IDA7XHJcbmxldCB0ZXRyaXNMb2dvO1xyXG5sZXQgdGltZTtcclxubGV0IHdpbk9yTG9zZSA9IFwiUGxheWluZ1wiO1xyXG5cclxubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJoaWdoU2NvcmVcIiwgMCk7XHJcbmlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoaWdoU2NvcmUpKSB7XHJcbiAgaGlnaFNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJoaWdoU2NvcmVcIik7XHJcbn0gZWxzZSB7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJoaWdoU2NvcmVcIiwgMCk7XHJcbn1cclxuXHJcbmxldCBjb29yZGluYXRlQXJyYXkgPSBbLi4uQXJyYXkoZ2FtZUJvYXJkQXJyYXlIZWlnaHQpXS5tYXAoZSA9PlxyXG4gIEFycmF5KGdhbWVCb2FyZEFycmF5V2lkdGgpLmZpbGwoMClcclxuKTtcclxubGV0IGdhbWVCb2FyZEFycmF5ID0gWy4uLkFycmF5KGdhbWVCb2FyZEFycmF5SGVpZ2h0KV0ubWFwKGUgPT5cclxuICBBcnJheShnYW1lQm9hcmRBcnJheVdpZHRoKS5maWxsKDApXHJcbik7XHJcbmxldCBzdG9wcGVkU2hhcGVBcnJheSA9IFsuLi5BcnJheShnYW1lQm9hcmRBcnJheUhlaWdodCldLm1hcChlID0+XHJcbiAgQXJyYXkoZ2FtZUJvYXJkQXJyYXlXaWR0aCkuZmlsbCgwKVxyXG4pO1xyXG5cclxubGV0IGN1cnJlbnRUZXRyb21pbm8gPSBbXHJcbiAgLy8gVCBTaGFwZVxyXG4gIFsxLCAwXSxcclxuICBbMCwgMV0sXHJcbiAgWzEsIDFdLFxyXG4gIFsyLCAxXVxyXG5dO1xyXG5cclxuLy9DcmVhdGUgc2hhcGVzXHJcbmxldCB0ZXRyb21pbm9zID0gW107XHJcbmZ1bmN0aW9uIENyZWF0ZVNoYXBlcygpIHtcclxuICAvLyBUIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFsxLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXSxcclxuICAgIFsyLCAxXVxyXG4gIF0pO1xyXG4gIC8vIEkgU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzAsIDBdLFxyXG4gICAgWzEsIDBdLFxyXG4gICAgWzIsIDBdLFxyXG4gICAgWzMsIDBdXHJcbiAgXSk7XHJcbiAgLy8gSiBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxuICAvLyBTcXVhcmUgU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzAsIDBdLFxyXG4gICAgWzEsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdXHJcbiAgXSk7XHJcbiAgLy8gTCBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMiwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxuICAvLyBTIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFsxLCAwXSxcclxuICAgIFsyLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXVxyXG4gIF0pO1xyXG4gIC8vIFogU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzAsIDBdLFxyXG4gICAgWzEsIDBdLFxyXG4gICAgWzEsIDFdLFxyXG4gICAgWzIsIDFdXHJcbiAgXSk7XHJcbn1cclxubGV0IHNoYXBlc0NvbG9ycyA9IFtcclxuICBcImxpbWVcIixcclxuICBcImN5YW5cIixcclxuICBcImJsdWVcIixcclxuICBcImdyZWVuXCIsXHJcbiAgXCJyZWRcIixcclxuICBcIm9yYW5nZVwiLFxyXG4gIFwibWFnZW50YVwiXHJcbl07XHJcbmxldCBjdXJyZW50VGV0cm9taW5vQ29sb3IgPSBcImNvcmFsXCI7XHJcblxyXG5sZXQgRElSRUNUSU9OID0ge1xyXG4gIElETEU6IDAsXHJcbiAgRE9XTjogMSxcclxuICBMRUZUOiAyLFxyXG4gIFJJR0hUOiAzXHJcbn07XHJcblxyXG5sZXQgS0VZUyA9IHtcclxuICBMRUZUOiA2NSxcclxuICBJRExFOiA4NyxcclxuICBSSUdIVDogNjgsXHJcbiAgRE9XTjogODMsXHJcbiAgUEFVU0U6IDgwLFxyXG4gIFNQQUNFOiAzMlxyXG59O1xyXG5cclxubGV0IGRpcmVjdGlvbjtcclxuXHJcbmNsYXNzIENvb3JkaW5hdGVzIHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUNvb3JkQXJyYXkoKSB7XHJcbiAgbGV0IGkgPSAwLFxyXG4gICAgaiA9IDA7XHJcbiAgZm9yIChsZXQgeSA9IDQ7IHkgPD0gNTUwOyB5ICs9IDIyKSB7XHJcbiAgICBmb3IgKGxldCB4ID0gMTQwOyB4IDw9IDQ3MDsgeCArPSAyMikge1xyXG4gICAgICBjb29yZGluYXRlQXJyYXlbaV1bal0gPSBuZXcgQ29vcmRpbmF0ZXMoeCwgeSk7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuICAgIGorKztcclxuICAgIGkgPSAwO1xyXG4gIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgU2V0dXBDYW52YXMpO1xyXG5cclxuZnVuY3Rpb24gU2V0dXBDYW52YXMoKSB7XHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XHJcbiAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICBjYW52YXMud2lkdGggPSA2NDA7XHJcbiAgY2FudmFzLmhlaWdodCA9IDU1ODtcclxuXHJcbiAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gIGN0eC5zdHJva2VSZWN0KDEzOCwgMiwgMzU0LCA1NTIpO1xyXG5cclxuICB0ZXRyaXNMb2dvID0gbmV3IEltYWdlKDE2MCwgNTApO1xyXG4gIHRldHJpc0xvZ28ub25sb2FkID0gRHJhd1RldHJpc0xvZ287XHJcbiAgdGV0cmlzTG9nby5zcmMgPSBcImFzc2V0cy9pbWcvaW5kZWtzLmpwZ1wiO1xyXG5cclxuICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG4gIGN0eC5mb250ID0gXCIxLjNyZW0gQXJpYWxcIjtcclxuXHJcbiAgY3R4LmZpbGxUZXh0KFwiU2NvcmVcIiwgNTAwLCAxMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoc2NvcmUudG9TdHJpbmcoKSwgNTcwLCAxMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoXCJMZXZlbFwiLCA1MDAsIDE1MCk7XHJcbiAgY3R4LmZpbGxUZXh0KGxldmVsLnRvU3RyaW5nKCksIDU3MCwgMTUwKTtcclxuXHJcbiAgY3R4LmZpbGxUZXh0KHdpbk9yTG9zZSwgNTAwLCAyMDApO1xyXG5cclxuICBjdHguZmlsbFRleHQoXCJDT05UUk9MU1wiLCA1MDAsIDMyMCk7XHJcblxyXG4gIGN0eC5maWxsVGV4dChcIkE6IE1vdmUgbGVmdFwiLCA1MDAsIDM1MCk7XHJcbiAgY3R4LmZpbGxUZXh0KFwiRDogTW92ZSByaWdodFwiLCA1MDAsIDM4MCk7XHJcbiAgY3R4LmZpbGxUZXh0KFwiUzogTW92ZSBkb3duXCIsIDUwMCwgNDEwKTtcclxuICBjdHguZmlsbFRleHQoXCJQOiBQYXN1ZVwiLCA1MDAsIDQ0MCk7XHJcbiAgY3R4LmZpbGxUZXh0KFwiU3BhY2U6IFJvdGF0ZVwiLCA1MDAsIDQ3MCk7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGhhbmRsZUtleVByZXNzKTtcclxuXHJcbiAgQ3JlYXRlU2hhcGVzKCk7XHJcbiAgQ3JlYXRlVGV0cm9taW5vKCk7XHJcbiAgQ3JlYXRlQ29vcmRBcnJheSgpO1xyXG4gIERyYXdUZXRyb21pbm8oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gRHJhd1RldHJpc0xvZ28oKSB7XHJcbiAgY3R4LmRyYXdJbWFnZSh0ZXRyaXNMb2dvLCAwLCA1MCwgMTMwLCA3MCk7XHJcbiAgY3R4LmRyYXdJbWFnZSh0ZXRyaXNMb2dvLCAwLCAxMDAsIDEzMCwgNzApO1xyXG4gIGN0eC5kcmF3SW1hZ2UodGV0cmlzTG9nbywgMCwgMTUwLCAxMzAsIDcwKTtcclxuICBjdHguZHJhd0ltYWdlKHRldHJpc0xvZ28sIDAsIDIwMCwgMTMwLCA3MCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIERyYXdUZXRyb21pbm8oKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgeCA9IGN1cnJlbnRUZXRyb21pbm9baV1bMF0gKyBzdGFydFg7XHJcbiAgICBsZXQgeSA9IGN1cnJlbnRUZXRyb21pbm9baV1bMV0gKyBzdGFydFk7XHJcbiAgICBnYW1lQm9hcmRBcnJheVt4XVt5XSA9IDE7XHJcbiAgICBsZXQgY29vclggPSBjb29yZGluYXRlQXJyYXlbeF1beV0ueDtcclxuICAgIGxldCBjb29yWSA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS55O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGN1cnJlbnRUZXRyb21pbm9Db2xvcjtcclxuICAgIGN0eC5maWxsUmVjdChjb29yWCwgY29vclksIDIwLCAyMCk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIERlbGV0ZVRldHJvbWlubygpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCB4ID0gY3VycmVudFRldHJvbWlub1tpXVswXSArIHN0YXJ0WDtcclxuICAgIGxldCB5ID0gY3VycmVudFRldHJvbWlub1tpXVsxXSArIHN0YXJ0WTtcclxuICAgIGdhbWVCb2FyZEFycmF5W3hdW3ldID0gMTtcclxuICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS54O1xyXG4gICAgbGV0IGNvb3JZID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLnk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGNvb3JYLCBjb29yWSwgMjAsIDIwKTtcclxuICB9XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGhhbmRsZUtleVByZXNzKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUtleVByZXNzKGtleSkge1xyXG4gIGlmICh3aW5Pckxvc2UgIT0gXCJHYW1lIE92ZXJcIikge1xyXG4gICAgaWYgKGtleS5rZXlDb2RlID09PSBLRVlTLkxFRlQgJiYgIXBhdXNlKSB7XHJcbiAgICAgIE1vdmVMZWZ0KCk7XHJcbiAgICB9IGVsc2UgaWYgKGtleS5rZXlDb2RlID09PSBLRVlTLlJJR0hUICYmICFwYXVzZSkge1xyXG4gICAgICBNb3ZlUmlnaHQoKTtcclxuICAgIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IEtFWVMuRE9XTiAmJiAhcGF1c2UpIHtcclxuICAgICAgTW92ZURvd24oKTtcclxuICAgIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IEtFWVMuU1BBQ0UgJiYgIXBhdXNlKSB7XHJcbiAgICAgIFJvdGF0ZVRldHJvbWlubygpO1xyXG4gICAgfSBlbHNlIGlmIChrZXkua2V5Q29kZSA9PT0gS0VZUy5QQVVTRSkge1xyXG4gICAgICBwYXVzZSA9ICFwYXVzZTtcclxuICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwibWFnZW50YVwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChcIlBBVVNFXCIsIDUwMCwgMjUwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCg1MDAsIDIyNSwgMTAwLCAzMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuZnVuY3Rpb24gTW92ZUxlZnQoKSB7XHJcbiAgZGlyZWN0aW9uID0gRElSRUNUSU9OLkxFRlQ7XHJcbiAgaWYgKCFIaXR0aW5nVGhlV2FsbCgpICYmICFIb3Jpem9udGFsQ29sbGlzaW9uKCkpIHtcclxuICAgIERlbGV0ZVRldHJvbWlubygpO1xyXG4gICAgc3RhcnRYLS07XHJcbiAgICBEcmF3VGV0cm9taW5vKCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBNb3ZlUmlnaHQoKSB7XHJcbiAgZGlyZWN0aW9uID0gRElSRUNUSU9OLlJJR0hUO1xyXG4gIGlmICghSGl0dGluZ1RoZVdhbGwoKSAmJiAhSG9yaXpvbnRhbENvbGxpc2lvbigpKSB7XHJcbiAgICBEZWxldGVUZXRyb21pbm8oKTtcclxuICAgIHN0YXJ0WCsrO1xyXG4gICAgRHJhd1RldHJvbWlubygpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gTW92ZURvd24oKSB7XHJcbiAgZGlyZWN0aW9uID0gRElSRUNUSU9OLkRPV047XHJcbiAgaWYgKCFWZXJ0aWNhbENvbGxpc2lvbigpKSB7XHJcbiAgICBEZWxldGVUZXRyb21pbm8oKTtcclxuICAgIHN0YXJ0WSsrO1xyXG4gICAgRHJhd1RldHJvbWlubygpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U3BlZWQoc3BlZWQpIHtcclxuICB0aW1lID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgIGlmICghcGF1c2UpIHtcclxuICAgICAgaWYgKHdpbk9yTG9zZSAhPSBcIkdhbWUgT3ZlclwiKSB7XHJcbiAgICAgICAgTW92ZURvd24oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3aW5Pckxvc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgMTAwMCAvIHNwZWVkKTtcclxufVxyXG5cclxuc2V0U3BlZWQoc3BlZWQpO1xyXG5cclxuZnVuY3Rpb24gQ3JlYXRlVGV0cm9taW5vKCkge1xyXG4gIGxldCByYW5kb21UZXRyb21pbm8gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXRyb21pbm9zLmxlbmd0aCk7XHJcbiAgY3VycmVudFRldHJvbWlubyA9IHRldHJvbWlub3NbcmFuZG9tVGV0cm9taW5vXTtcclxuICBjdXJyZW50VGV0cm9taW5vQ29sb3IgPSBzaGFwZXNDb2xvcnNbcmFuZG9tVGV0cm9taW5vXTtcclxufVxyXG5cclxuZnVuY3Rpb24gSGl0dGluZ1RoZVdhbGwoKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgbmV3WCA9IGN1cnJlbnRUZXRyb21pbm9baV1bMF0gKyBzdGFydFg7XHJcbiAgICBpZiAobmV3WCA8PSAwICYmIGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKG5ld1ggPj0gMTUgJiYgZGlyZWN0aW9uID09PSBESVJFQ1RJT04uUklHSFQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gVmVydGljYWxDb2xsaXNpb24oKSB7XHJcbiAgbGV0IGNvcHlUZXRyb21pbm8gPSBjdXJyZW50VGV0cm9taW5vO1xyXG4gIGxldCBjb2xsaXNpb24gPSBmYWxzZTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHlUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBzaGFwZSA9IGNvcHlUZXRyb21pbm9baV07XHJcbiAgICBsZXQgeCA9IHNoYXBlWzBdICsgc3RhcnRYO1xyXG4gICAgbGV0IHkgPSBzaGFwZVsxXSArIHN0YXJ0WTtcclxuICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5ET1dOKSB7XHJcbiAgICAgIHkrKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHN0b3BwZWRTaGFwZUFycmF5W3hdW3kgKyAxXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBEZWxldGVUZXRyb21pbm8oKTtcclxuICAgICAgc3RhcnRZKys7XHJcbiAgICAgIERyYXdUZXRyb21pbm8oKTtcclxuICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBpZiAoeSA+PSAyNSkge1xyXG4gICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGNvbGxpc2lvbikge1xyXG4gICAgaWYgKHN0YXJ0WSA8PSA0KSB7XHJcbiAgICAgIHdpbk9yTG9zZSA9IFwiR2FtZSBPdmVyXCI7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICAgIGN0eC5maWxsUmVjdCg1MDAsIDE4MCwgMTAwLCAzMCk7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgIGN0eC5maWxsVGV4dCh3aW5Pckxvc2UsIDUwMCwgMjAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29weVRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzaGFwZSA9IGNvcHlUZXRyb21pbm9baV07XHJcbiAgICAgICAgbGV0IHggPSBzaGFwZVswXSArIHN0YXJ0WDtcclxuICAgICAgICBsZXQgeSA9IHNoYXBlWzFdICsgc3RhcnRZO1xyXG4gICAgICAgIHN0b3BwZWRTaGFwZUFycmF5W3hdW3ldID0gY3VycmVudFRldHJvbWlub0NvbG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBDb21wbGV0ZWRSb3dzKCk7XHJcbiAgICAgIENyZWF0ZVRldHJvbWlubygpO1xyXG4gICAgICBkaXJlY3Rpb24gPSBESVJFQ1RJT04uSURMRTtcclxuICAgICAgc3RhcnRYID0gNjtcclxuICAgICAgc3RhcnRZID0gMDtcclxuICAgICAgRHJhd1RldHJvbWlubygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gSG9yaXpvbnRhbENvbGxpc2lvbigpIHtcclxuICB2YXIgY29weVRldHJvbWlubyA9IGN1cnJlbnRUZXRyb21pbm87XHJcbiAgdmFyIGNvbGxpc2lvbiA9IGZhbHNlO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29weVRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHNoYXBlID0gY29weVRldHJvbWlub1tpXTtcclxuICAgIHZhciB4ID0gc2hhcGVbMF0gKyBzdGFydFg7XHJcbiAgICB2YXIgeSA9IHNoYXBlWzFdICsgc3RhcnRZO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTi5MRUZUKSB7XHJcbiAgICAgIHgtLTtcclxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBESVJFQ1RJT04uUklHSFQpIHtcclxuICAgICAgeCsrO1xyXG4gICAgfVxyXG4gICAgdmFyIHN0b3BwZWRTaGFwZVZhbHVlID0gc3RvcHBlZFNoYXBlQXJyYXlbeF1beV07XHJcbiAgICBpZiAodHlwZW9mIHN0b3BwZWRTaGFwZVZhbHVlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY29sbGlzaW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDb21wbGV0ZWRSb3dzKCkge1xyXG4gIHZhciByb3dzVG9EZWxldGUgPSAwO1xyXG4gIGxldCBzdGFydE9mRGVsZXRpb24gPSAwO1xyXG5cclxuICBmb3IgKGxldCB5ID0gMDsgeSA8IGdhbWVCb2FyZEFycmF5SGVpZ2h0OyB5KyspIHtcclxuICAgIGxldCBjb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBnYW1lQm9hcmRBcnJheVdpZHRoOyB4KyspIHtcclxuICAgICAgbGV0IHNoYXBlID0gc3RvcHBlZFNoYXBlQXJyYXlbeF1beV07XHJcbiAgICAgIGNvbnNvbGUubG9nKFwic2hhcGVcIiwgc2hhcGUpO1xyXG4gICAgICBpZiAoc2hhcGUgPT09IDAgfHwgdHlwZW9mIHNoYXBlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgY29tcGxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChjb21wbGV0ZWQpIHtcclxuICAgICAgaWYgKHN0YXJ0T2ZEZWxldGlvbiA9PT0gMCkgc3RhcnRPZkRlbGV0aW9uID0geSArIDQ7XHJcbiAgICAgIHJvd3NUb0RlbGV0ZSsrO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdhbWVCb2FyZEFycmF5V2lkdGg7IGkrKykge1xyXG4gICAgICAgIHN0b3BwZWRTaGFwZUFycmF5W2ldW3ldID0gMDtcclxuICAgICAgICBnYW1lQm9hcmRBcnJheVtpXVt5XSA9IDA7XHJcbiAgICAgICAgbGV0IGNvb3JYID0gY29vcmRpbmF0ZUFycmF5W2ldW3ldLng7XHJcbiAgICAgICAgbGV0IGNvb3JZID0gY29vcmRpbmF0ZUFycmF5W2ldW3ldLnk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgICAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMCwgMjApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChyb3dzVG9EZWxldGUgPiAwKSB7XHJcbiAgICBzY29yZSArPSAxMDtcclxuICAgIGlmIChzY29yZSA+IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaGlnaFNjb3JlXCIpKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaGlnaFNjb3JlXCIsIHNjb3JlKTtcclxuICAgIH1cclxuICAgIGN0eC5maWxsUmVjdCg1NzAsIDg1LCA0MCwgMjUpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgIGN0eC5maWxsVGV4dChzY29yZS50b1N0cmluZygpLCA1NzAsIDEwMCk7XHJcbiAgICBNb3ZlUm93c0Rvd24ocm93c1RvRGVsZXRlLCBzdGFydE9mRGVsZXRpb24pO1xyXG4gICAgaWYgKHNjb3JlICUgbGV2ZWxVcCA9PT0gMCkge1xyXG4gICAgICBzcGVlZCA9IHNwZWVkICsgMC4yO1xyXG4gICAgICBsZXZlbCsrO1xyXG4gICAgICBjdHguZmlsbFJlY3QoNTYwLCAxMzAsIDQwLCAyNSk7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgIGN0eC5maWxsVGV4dChsZXZlbC50b1N0cmluZygpLCA1NzAsIDE1MCk7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZSk7XHJcbiAgICAgIHNldFNwZWVkKHNwZWVkKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1vdmVSb3dzRG93bihyb3dzVG9EZWxldGUsIHN0YXJ0T2ZEZWxldGlvbikge1xyXG4gIGZvciAodmFyIGkgPSBzdGFydE9mRGVsZXRpb24gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBnYW1lQm9hcmRBcnJheVdpZHRoOyB4KyspIHtcclxuICAgICAgdmFyIHkyID0gaSArIHJvd3NUb0RlbGV0ZTtcclxuICAgICAgdmFyIHNoYXBlID0gc3RvcHBlZFNoYXBlQXJyYXlbeF1baV07XHJcbiAgICAgIHZhciBuZXh0U2hhcGUgPSBzdG9wcGVkU2hhcGVBcnJheVt4XVt5Ml07XHJcbiAgICAgIGlmICh0eXBlb2Ygc2hhcGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBuZXh0U2hhcGUgPSBzaGFwZTtcclxuICAgICAgICBnYW1lQm9hcmRBcnJheVt4XVt5Ml0gPSAxO1xyXG4gICAgICAgIHN0b3BwZWRTaGFwZUFycmF5W3hdW3kyXSA9IHNoYXBlO1xyXG4gICAgICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5Ml0ueDtcclxuICAgICAgICBsZXQgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1beTJdLnk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IG5leHRTaGFwZTtcclxuICAgICAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMCwgMjApO1xyXG4gICAgICAgIHNoYXBlID0gMDtcclxuICAgICAgICBnYW1lQm9hcmRBcnJheVt4XVtpXSA9IDA7XHJcbiAgICAgICAgc3RvcHBlZFNoYXBlQXJyYXlbeF1baV0gPSAwO1xyXG4gICAgICAgIGNvb3JYID0gY29vcmRpbmF0ZUFycmF5W3hdW2ldLng7XHJcbiAgICAgICAgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1baV0ueTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdChjb29yWCwgY29vclksIDIwLCAyMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJvdGF0ZVRldHJvbWlubygpIHtcclxuICBsZXQgbmV3Um90YXRpb24gPSBuZXcgQXJyYXkoKTtcclxuICBsZXQgdGV0cm9taW5vQ29weSA9IGN1cnJlbnRUZXRyb21pbm87XHJcbiAgbGV0IGN1cnJlbnRUZXRyb21pbm9CYWNrVXA7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXRyb21pbm9Db3B5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjdXJyZW50VGV0cm9taW5vQmFja1VwID0gWy4uLmN1cnJlbnRUZXRyb21pbm9dO1xyXG4gICAgbGV0IHggPSB0ZXRyb21pbm9Db3B5W2ldWzBdO1xyXG4gICAgbGV0IHkgPSB0ZXRyb21pbm9Db3B5W2ldWzFdO1xyXG4gICAgbGV0IG5ld1ggPSBHZXRMYXN0U3F1YXJlWCgpIC0geTtcclxuICAgIGxldCBuZXdZID0geDtcclxuICAgIG5ld1JvdGF0aW9uLnB1c2goW25ld1gsIG5ld1ldKTtcclxuICB9XHJcbiAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgdHJ5IHtcclxuICAgIGN1cnJlbnRUZXRyb21pbm8gPSBuZXdSb3RhdGlvbjtcclxuICAgIERyYXdUZXRyb21pbm8oKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xyXG4gICAgICBjdXJyZW50VGV0cm9taW5vID0gY3VycmVudFRldHJvbWlub0JhY2tVcDtcclxuICAgICAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgICAgIERyYXdUZXRyb21pbm8oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuZnVuY3Rpb24gR2V0TGFzdFNxdWFyZVgoKSB7XHJcbiAgbGV0IGxhc3RYID0gMDtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBzcXVhcmUgPSBjdXJyZW50VGV0cm9taW5vW2ldO1xyXG4gICAgaWYgKHNxdWFyZVswXSA+IGxhc3RYKSBsYXN0WCA9IHNxdWFyZVswXTtcclxuICB9XHJcbiAgcmV0dXJuIGxhc3RYO1xyXG59XHJcblxyXG4vLyBOdW1iZXIgb2Yga2V5XHJcbi8vIGZ1bmN0aW9uIGtleUNvZGUoZSkge1xyXG4vLyAgIGNvbnNvbGUubG9nKGUua2V5Q29kZSk7XHJcbi8vIH1cclxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGtleUNvZGUpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);