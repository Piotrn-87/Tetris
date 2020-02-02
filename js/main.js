!function(r){var n={};function c(t){if(n[t])return n[t].exports;var e=n[t]={i:t,l:!1,exports:{}};return r[t].call(e.exports,e,e.exports,c),e.l=!0,e.exports}c.m=r,c.c=n,c.d=function(r,n,t){c.o(r,n)||Object.defineProperty(r,n,{enumerable:!0,get:t})},c.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},c.t=function(r,n){if(1&n&&(r=c(r)),8&n)return r;if(4&n&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&n&&"string"!=typeof r)for(var e in r)c.d(t,e,function(n){return r[n]}.bind(null,e));return t},c.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return c.d(n,"a",n),n},c.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},c.p="",c(c.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        // Registration was successful\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        // registration failed\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\nconsole.log(`Hello Tetromino!`);\r\n\r\nlet canvas;\r\nlet ctx;\r\nlet gameBoardArrayHeight = 20;\r\nlet gameBoardArrayWidth = 12;\r\nlet startX = 4;\r\nlet startY = 0;\r\n\r\nlet coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet currentTetromino = [\r\n  [1, 0],\r\n  [0, 1],\r\n  [1, 1],\r\n  [2, 1]\r\n];\r\n\r\nlet tetrominos = [];\r\nlet shapesColors = [\r\n  "violet",\r\n  "cyan",\r\n  "blue",\r\n  "green",\r\n  "red",\r\n  "orange",\r\n  "coral"\r\n];\r\nlet currentTetrominoColor;\r\nlet gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));\r\n\r\nlet DIRECTION = {\r\n  IDEL: 0,\r\n  DOWN: 1,\r\n  LEFT: 2,\r\n  RIGHT: 3\r\n};\r\n\r\nlet direction;\r\n\r\nclass Coordinates {\r\n  constructor(x, y) {\r\n    this.x = x;\r\n    this.y = y;\r\n  }\r\n}\r\ndocument.addEventListener("DOMContentLoaded", SetupCanvas);\r\n\r\nfunction CreateCoordArray() {\r\n  let i = 0,\r\n    j = 0;\r\n  for (let y = 11; y <= 446; y += 22) {\r\n    for (let x = 11; x <= 324; x += 22) {\r\n      coordinateArray[i][j] = new Coordinates(x, y);\r\n      i++;\r\n    }\r\n    j++;\r\n    i = 0;\r\n  }\r\n}\r\nfunction SetupCanvas() {\r\n  canvas = document.getElementById("canvas");\r\n  ctx = canvas.getContext("2d");\r\n  canvas.width = 352;\r\n  canvas.height = 556;\r\n\r\n  // ctx.scale(2, 2);\r\n\r\n  ctx.fillStyle = "white";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  ctx.strokeStyle = "black";\r\n  ctx.strokeRect(8, 8, 336, 542);\r\n\r\n  document.addEventListener("keydown", handleKeyPress);\r\n\r\n  CreateShapes();\r\n  CreateTetromino();\r\n  CreateCoordArray();\r\n  DrawTetromino();\r\n}\r\n\r\nfunction DrawTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = currentTetrominoColor;\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n    console.log("COLOR", currentTetrominoColor);\r\n  }\r\n}\r\n\r\nfunction handleKeyPress(key) {\r\n  if (key.keyCode === 65) {\r\n    direction = DIRECTION.LEFT;\r\n    if (!HittingTheWall()) {\r\n      DeleteTetromino();\r\n      startX--;\r\n      DrawTetromino();\r\n    }\r\n  } else if (key.keyCode === 68) {\r\n    direction = DIRECTION.RIGHT;\r\n    if (!HittingTheWall()) {\r\n      DeleteTetromino();\r\n      startX++;\r\n      DrawTetromino();\r\n    }\r\n  } else if (key.keyCode === 83) {\r\n    direction = DIRECTION.DOWN;\r\n    DeleteTetromino();\r\n    startY++;\r\n    DrawTetromino();\r\n  }\r\n}\r\nfunction DeleteTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 0;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = "white";\r\n    ctx.fillRect(coorX, coorY, 20, 20);\r\n  }\r\n}\r\n\r\nfunction CreateShapes() {\r\n  // T Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // I Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [2, 0],\r\n    [3, 0]\r\n  ]);\r\n  // J Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // Square Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // L Shape\r\n  tetrominos.push([\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  // S Shape\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  // Z Shape\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n}\r\n\r\nfunction CreateTetromino() {\r\n  let randomTetromino = Math.floor(Math.random() * tetrominos.length);\r\n  currentTetromino = tetrominos[randomTetromino];\r\n  currentTetrominoColor = shapesColors[randomTetromino];\r\n  console.log("Random", randomTetromino);\r\n  console.log("Length", tetrominos.length);\r\n}\r\n\r\nfunction HittingTheWall() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let newX = currentTetromino[i][0] + startX;\r\n    if (newX <= 0 && direction === DIRECTION.LEFT) {\r\n      return true;\r\n    } else if (newX >= 14 && direction === DIRECTION.RIGHT) {\r\n      return true;\r\n    }\r\n  }\r\n  return false;\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1QixvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoXCJzZXJ2aWNld29ya2VyLmpzXCIpLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGU6IFwiLFxyXG4gICAgICAgICAgcmVnaXN0cmF0aW9uLnNjb3BlXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiBcIiwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KTtcclxufVxyXG5cclxuY29uc29sZS5sb2coYEhlbGxvIFRldHJvbWlubyFgKTtcclxuXHJcbmxldCBjYW52YXM7XHJcbmxldCBjdHg7XHJcbmxldCBnYW1lQm9hcmRBcnJheUhlaWdodCA9IDIwO1xyXG5sZXQgZ2FtZUJvYXJkQXJyYXlXaWR0aCA9IDEyO1xyXG5sZXQgc3RhcnRYID0gNDtcclxubGV0IHN0YXJ0WSA9IDA7XHJcblxyXG5sZXQgY29vcmRpbmF0ZUFycmF5ID0gWy4uLkFycmF5KGdhbWVCb2FyZEFycmF5SGVpZ2h0KV0ubWFwKGUgPT5cclxuICBBcnJheShnYW1lQm9hcmRBcnJheVdpZHRoKS5maWxsKDApXHJcbik7XHJcbmxldCBjdXJyZW50VGV0cm9taW5vID0gW1xyXG4gIFsxLCAwXSxcclxuICBbMCwgMV0sXHJcbiAgWzEsIDFdLFxyXG4gIFsyLCAxXVxyXG5dO1xyXG5cclxubGV0IHRldHJvbWlub3MgPSBbXTtcclxubGV0IHNoYXBlc0NvbG9ycyA9IFtcclxuICBcInZpb2xldFwiLFxyXG4gIFwiY3lhblwiLFxyXG4gIFwiYmx1ZVwiLFxyXG4gIFwiZ3JlZW5cIixcclxuICBcInJlZFwiLFxyXG4gIFwib3JhbmdlXCIsXHJcbiAgXCJjb3JhbFwiXHJcbl07XHJcbmxldCBjdXJyZW50VGV0cm9taW5vQ29sb3I7XHJcbmxldCBnYW1lQm9hcmRBcnJheSA9IFsuLi5BcnJheSgyMCldLm1hcChlID0+IEFycmF5KDEyKS5maWxsKDApKTtcclxuXHJcbmxldCBESVJFQ1RJT04gPSB7XHJcbiAgSURFTDogMCxcclxuICBET1dOOiAxLFxyXG4gIExFRlQ6IDIsXHJcbiAgUklHSFQ6IDNcclxufTtcclxuXHJcbmxldCBkaXJlY3Rpb247XHJcblxyXG5jbGFzcyBDb29yZGluYXRlcyB7XHJcbiAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgfVxyXG59XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIFNldHVwQ2FudmFzKTtcclxuXHJcbmZ1bmN0aW9uIENyZWF0ZUNvb3JkQXJyYXkoKSB7XHJcbiAgbGV0IGkgPSAwLFxyXG4gICAgaiA9IDA7XHJcbiAgZm9yIChsZXQgeSA9IDExOyB5IDw9IDQ0NjsgeSArPSAyMikge1xyXG4gICAgZm9yIChsZXQgeCA9IDExOyB4IDw9IDMyNDsgeCArPSAyMikge1xyXG4gICAgICBjb29yZGluYXRlQXJyYXlbaV1bal0gPSBuZXcgQ29vcmRpbmF0ZXMoeCwgeSk7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuICAgIGorKztcclxuICAgIGkgPSAwO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBTZXR1cENhbnZhcygpIHtcclxuICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcclxuICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gIGNhbnZhcy53aWR0aCA9IDM1MjtcclxuICBjYW52YXMuaGVpZ2h0ID0gNTU2O1xyXG5cclxuICAvLyBjdHguc2NhbGUoMiwgMik7XHJcblxyXG4gIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICBjdHguc3Ryb2tlUmVjdCg4LCA4LCAzMzYsIDU0Mik7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGhhbmRsZUtleVByZXNzKTtcclxuXHJcbiAgQ3JlYXRlU2hhcGVzKCk7XHJcbiAgQ3JlYXRlVGV0cm9taW5vKCk7XHJcbiAgQ3JlYXRlQ29vcmRBcnJheSgpO1xyXG4gIERyYXdUZXRyb21pbm8oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gRHJhd1RldHJvbWlubygpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCB4ID0gY3VycmVudFRldHJvbWlub1tpXVswXSArIHN0YXJ0WDtcclxuICAgIGxldCB5ID0gY3VycmVudFRldHJvbWlub1tpXVsxXSArIHN0YXJ0WTtcclxuICAgIGdhbWVCb2FyZEFycmF5W3hdW3ldID0gMTtcclxuICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS54O1xyXG4gICAgbGV0IGNvb3JZID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLnk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY3VycmVudFRldHJvbWlub0NvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KGNvb3JYLCBjb29yWSwgMjAsIDIwKTtcclxuICAgIGNvbnNvbGUubG9nKFwiQ09MT1JcIiwgY3VycmVudFRldHJvbWlub0NvbG9yKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUtleVByZXNzKGtleSkge1xyXG4gIGlmIChrZXkua2V5Q29kZSA9PT0gNjUpIHtcclxuICAgIGRpcmVjdGlvbiA9IERJUkVDVElPTi5MRUZUO1xyXG4gICAgaWYgKCFIaXR0aW5nVGhlV2FsbCgpKSB7XHJcbiAgICAgIERlbGV0ZVRldHJvbWlubygpO1xyXG4gICAgICBzdGFydFgtLTtcclxuICAgICAgRHJhd1RldHJvbWlubygpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IDY4KSB7XHJcbiAgICBkaXJlY3Rpb24gPSBESVJFQ1RJT04uUklHSFQ7XHJcbiAgICBpZiAoIUhpdHRpbmdUaGVXYWxsKCkpIHtcclxuICAgICAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgICAgIHN0YXJ0WCsrO1xyXG4gICAgICBEcmF3VGV0cm9taW5vKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChrZXkua2V5Q29kZSA9PT0gODMpIHtcclxuICAgIGRpcmVjdGlvbiA9IERJUkVDVElPTi5ET1dOO1xyXG4gICAgRGVsZXRlVGV0cm9taW5vKCk7XHJcbiAgICBzdGFydFkrKztcclxuICAgIERyYXdUZXRyb21pbm8oKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gRGVsZXRlVGV0cm9taW5vKCkge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHggPSBjdXJyZW50VGV0cm9taW5vW2ldWzBdICsgc3RhcnRYO1xyXG4gICAgbGV0IHkgPSBjdXJyZW50VGV0cm9taW5vW2ldWzFdICsgc3RhcnRZO1xyXG4gICAgZ2FtZUJvYXJkQXJyYXlbeF1beV0gPSAwO1xyXG4gICAgbGV0IGNvb3JYID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLng7XHJcbiAgICBsZXQgY29vclkgPSBjb29yZGluYXRlQXJyYXlbeF1beV0ueTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMCwgMjApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gQ3JlYXRlU2hhcGVzKCkge1xyXG4gIC8vIFQgU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzEsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdLFxyXG4gICAgWzIsIDFdXHJcbiAgXSk7XHJcbiAgLy8gSSBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMiwgMF0sXHJcbiAgICBbMywgMF1cclxuICBdKTtcclxuICAvLyBKIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFswLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXSxcclxuICAgIFsyLCAxXVxyXG4gIF0pO1xyXG4gIC8vIFNxdWFyZSBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV1cclxuICBdKTtcclxuICAvLyBMIFNoYXBlXHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFsyLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXSxcclxuICAgIFsyLCAxXVxyXG4gIF0pO1xyXG4gIC8vIFMgU2hhcGVcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzEsIDBdLFxyXG4gICAgWzIsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdXHJcbiAgXSk7XHJcbiAgLy8gWiBTaGFwZVxyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ3JlYXRlVGV0cm9taW5vKCkge1xyXG4gIGxldCByYW5kb21UZXRyb21pbm8gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXRyb21pbm9zLmxlbmd0aCk7XHJcbiAgY3VycmVudFRldHJvbWlubyA9IHRldHJvbWlub3NbcmFuZG9tVGV0cm9taW5vXTtcclxuICBjdXJyZW50VGV0cm9taW5vQ29sb3IgPSBzaGFwZXNDb2xvcnNbcmFuZG9tVGV0cm9taW5vXTtcclxuICBjb25zb2xlLmxvZyhcIlJhbmRvbVwiLCByYW5kb21UZXRyb21pbm8pO1xyXG4gIGNvbnNvbGUubG9nKFwiTGVuZ3RoXCIsIHRldHJvbWlub3MubGVuZ3RoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSGl0dGluZ1RoZVdhbGwoKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50VGV0cm9taW5vLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgbmV3WCA9IGN1cnJlbnRUZXRyb21pbm9baV1bMF0gKyBzdGFydFg7XHJcbiAgICBpZiAobmV3WCA8PSAwICYmIGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OLkxFRlQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKG5ld1ggPj0gMTQgJiYgZGlyZWN0aW9uID09PSBESVJFQ1RJT04uUklHSFQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);