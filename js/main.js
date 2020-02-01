!function(r){var n={};function c(t){if(n[t])return n[t].exports;var l=n[t]={i:t,l:!1,exports:{}};return r[t].call(l.exports,l,l.exports,c),l.l=!0,l.exports}c.m=r,c.c=n,c.d=function(r,n,t){c.o(r,n)||Object.defineProperty(r,n,{enumerable:!0,get:t})},c.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},c.t=function(r,n){if(1&n&&(r=c(r)),8&n)return r;if(4&n&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&n&&"string"!=typeof r)for(var l in r)c.d(t,l,function(n){return r[n]}.bind(null,l));return t},c.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return c.d(n,"a",n),n},c.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},c.p="",c(c.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function() {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function(registration) {\r\n        // Registration was successful\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function(err) {\r\n        // registration failed\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\nconsole.log(`Hello Tetromino!`);\r\n\r\nlet canvas;\r\nlet ctx;\r\nlet gameBoardArrayHeight = 20;\r\nlet gameBoardArrayWidth = 12;\r\nlet startX = 4;\r\nlet startY = 0;\r\nlet coordinateArray = [...Array(gameBoardArrayHeight)].map(e =>\r\n  Array(gameBoardArrayWidth).fill(0)\r\n);\r\nlet currentTetromino = [\r\n  [1, 0],\r\n  [0, 1],\r\n  [1, 1],\r\n  [2, 1]\r\n];\r\n\r\nlet tetrominos = [];\r\nlet tetrominosColors = [\r\n  "violet",\r\n  "cyan",\r\n  "blue",\r\n  "green",\r\n  "red",\r\n  "orange",\r\n  "yellow"\r\n];\r\n\r\nlet currentTetrominoColor = "yellow";\r\n\r\nlet gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));\r\n\r\nlet DIRECTION = {\r\n  IDEL: 0,\r\n  DOWN: 1,\r\n  LEFT: 2,\r\n  RIGHT: 3\r\n};\r\n\r\nlet direction;\r\n\r\nclass Coordinates {\r\n  constructor(x, y) {\r\n    this.x = x;\r\n    this.y = y;\r\n  }\r\n}\r\ndocument.addEventListener("DOMContentLoaded", SetupCanvas);\r\n\r\nfunction CreateCoordArray() {\r\n  let i = 0,\r\n    j = 0;\r\n  for (let y = 9; y <= 446; y += 23) {\r\n    for (let x = 11; x <= 264; x += 23) {\r\n      coordinateArray[i][j] = new Coordinates(x, y);\r\n      i++;\r\n    }\r\n    j++;\r\n    i = 0;\r\n  }\r\n}\r\nfunction SetupCanvas() {\r\n  canvas = document.getElementById("canvas");\r\n  ctx = canvas.getContext("2d");\r\n  canvas.width = 936;\r\n  canvas.height = 556;\r\n\r\n  ctx.scale(1.5, 1);\r\n\r\n  ctx.fillStyle = "cornsilk";\r\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n  ctx.strokeStyle = "black";\r\n  ctx.strokeRect(4, 8, 280, 462);\r\n\r\n  document.addEventListener("keydown", handleKeyPress);\r\n\r\n  CreateTetrominos();\r\n  CreateTetromino();\r\n  CreateCoordArray();\r\n  DrawTetromino();\r\n}\r\n\r\nfunction DrawTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[i][1] + startY;\r\n    gameBoardArray[x][y] = 1;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = "green";\r\n    // ctx.fillStyle = tetrominosColors;\r\n    ctx.fillRect(coorX, coorY, 21, 21);\r\n  }\r\n}\r\n\r\nfunction handleKeyPress(key) {\r\n  if (key.keyCode === 65) {\r\n    direction = DIRECTION.LEFT;\r\n    DeleteTetromino();\r\n    startX--;\r\n    DrawTetromino();\r\n  } else if (key.keyCode === 68) {\r\n    direction = DIRECTION.RIGHT;\r\n    startX++;\r\n    DrawTetromino();\r\n  } else if (key.keyCode === 83) {\r\n    direction = DIRECTION.DOWN;\r\n    startY++;\r\n    DrawTetromino();\r\n  }\r\n}\r\nfunction DeleteTetromino() {\r\n  for (let i = 0; i < currentTetromino.length; i++) {\r\n    let x = currentTetromino[i][0] + startX;\r\n    let y = currentTetromino[(1)[1]] + startY;\r\n    gameBoardArrayHeight[x][y] = 0;\r\n    let coorX = coordinateArray[x][y].x;\r\n    let coorY = coordinateArray[x][y].y;\r\n    ctx.fillStyle = "white";\r\n    ctx.fillRect(coorX, coorY, 21, 21);\r\n  }\r\n}\r\n\r\nfunction CreateTetrominos() {\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [2, 0],\r\n    [3, 0]\r\n  ]);\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  tetrominos.push([\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n  tetrominos.push([\r\n    [1, 0],\r\n    [2, 0],\r\n    [0, 1],\r\n    [1, 1]\r\n  ]);\r\n  tetrominos.push([\r\n    [0, 0],\r\n    [1, 0],\r\n    [1, 1],\r\n    [2, 1]\r\n  ]);\r\n}\r\n\r\nfunction CreateTetromino() {\r\n  let randomTetromino = Math.floor(Math.random() * tetrominos.length);\r\n  currentTetromino = tetrominos[randomTetromino];\r\n  currentTetrominoColor = currentTetrominoColor[randomTetromino];\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFVBQVU7QUFDM0Isb0JBQW9CLFVBQVU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDZCQUE2QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw2QkFBNkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoXCJzZXJ2aWNld29ya2VyLmpzXCIpLnRoZW4oXHJcbiAgICAgIGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCJTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGU6IFwiLFxyXG4gICAgICAgICAgcmVnaXN0cmF0aW9uLnNjb3BlXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiBcIiwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KTtcclxufVxyXG5cclxuY29uc29sZS5sb2coYEhlbGxvIFRldHJvbWlubyFgKTtcclxuXHJcbmxldCBjYW52YXM7XHJcbmxldCBjdHg7XHJcbmxldCBnYW1lQm9hcmRBcnJheUhlaWdodCA9IDIwO1xyXG5sZXQgZ2FtZUJvYXJkQXJyYXlXaWR0aCA9IDEyO1xyXG5sZXQgc3RhcnRYID0gNDtcclxubGV0IHN0YXJ0WSA9IDA7XHJcbmxldCBjb29yZGluYXRlQXJyYXkgPSBbLi4uQXJyYXkoZ2FtZUJvYXJkQXJyYXlIZWlnaHQpXS5tYXAoZSA9PlxyXG4gIEFycmF5KGdhbWVCb2FyZEFycmF5V2lkdGgpLmZpbGwoMClcclxuKTtcclxubGV0IGN1cnJlbnRUZXRyb21pbm8gPSBbXHJcbiAgWzEsIDBdLFxyXG4gIFswLCAxXSxcclxuICBbMSwgMV0sXHJcbiAgWzIsIDFdXHJcbl07XHJcblxyXG5sZXQgdGV0cm9taW5vcyA9IFtdO1xyXG5sZXQgdGV0cm9taW5vc0NvbG9ycyA9IFtcclxuICBcInZpb2xldFwiLFxyXG4gIFwiY3lhblwiLFxyXG4gIFwiYmx1ZVwiLFxyXG4gIFwiZ3JlZW5cIixcclxuICBcInJlZFwiLFxyXG4gIFwib3JhbmdlXCIsXHJcbiAgXCJ5ZWxsb3dcIlxyXG5dO1xyXG5cclxubGV0IGN1cnJlbnRUZXRyb21pbm9Db2xvciA9IFwieWVsbG93XCI7XHJcblxyXG5sZXQgZ2FtZUJvYXJkQXJyYXkgPSBbLi4uQXJyYXkoMjApXS5tYXAoZSA9PiBBcnJheSgxMikuZmlsbCgwKSk7XHJcblxyXG5sZXQgRElSRUNUSU9OID0ge1xyXG4gIElERUw6IDAsXHJcbiAgRE9XTjogMSxcclxuICBMRUZUOiAyLFxyXG4gIFJJR0hUOiAzXHJcbn07XHJcblxyXG5sZXQgZGlyZWN0aW9uO1xyXG5cclxuY2xhc3MgQ29vcmRpbmF0ZXMge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gIH1cclxufVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBTZXR1cENhbnZhcyk7XHJcblxyXG5mdW5jdGlvbiBDcmVhdGVDb29yZEFycmF5KCkge1xyXG4gIGxldCBpID0gMCxcclxuICAgIGogPSAwO1xyXG4gIGZvciAobGV0IHkgPSA5OyB5IDw9IDQ0NjsgeSArPSAyMykge1xyXG4gICAgZm9yIChsZXQgeCA9IDExOyB4IDw9IDI2NDsgeCArPSAyMykge1xyXG4gICAgICBjb29yZGluYXRlQXJyYXlbaV1bal0gPSBuZXcgQ29vcmRpbmF0ZXMoeCwgeSk7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuICAgIGorKztcclxuICAgIGkgPSAwO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBTZXR1cENhbnZhcygpIHtcclxuICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcclxuICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gIGNhbnZhcy53aWR0aCA9IDkzNjtcclxuICBjYW52YXMuaGVpZ2h0ID0gNTU2O1xyXG5cclxuICBjdHguc2NhbGUoMS41LCAxKTtcclxuXHJcbiAgY3R4LmZpbGxTdHlsZSA9IFwiY29ybnNpbGtcIjtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gIGN0eC5zdHJva2VSZWN0KDQsIDgsIDI4MCwgNDYyKTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlS2V5UHJlc3MpO1xyXG5cclxuICBDcmVhdGVUZXRyb21pbm9zKCk7XHJcbiAgQ3JlYXRlVGV0cm9taW5vKCk7XHJcbiAgQ3JlYXRlQ29vcmRBcnJheSgpO1xyXG4gIERyYXdUZXRyb21pbm8oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gRHJhd1RldHJvbWlubygpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRUZXRyb21pbm8ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCB4ID0gY3VycmVudFRldHJvbWlub1tpXVswXSArIHN0YXJ0WDtcclxuICAgIGxldCB5ID0gY3VycmVudFRldHJvbWlub1tpXVsxXSArIHN0YXJ0WTtcclxuICAgIGdhbWVCb2FyZEFycmF5W3hdW3ldID0gMTtcclxuICAgIGxldCBjb29yWCA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS54O1xyXG4gICAgbGV0IGNvb3JZID0gY29vcmRpbmF0ZUFycmF5W3hdW3ldLnk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9IHRldHJvbWlub3NDb2xvcnM7XHJcbiAgICBjdHguZmlsbFJlY3QoY29vclgsIGNvb3JZLCAyMSwgMjEpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlS2V5UHJlc3Moa2V5KSB7XHJcbiAgaWYgKGtleS5rZXlDb2RlID09PSA2NSkge1xyXG4gICAgZGlyZWN0aW9uID0gRElSRUNUSU9OLkxFRlQ7XHJcbiAgICBEZWxldGVUZXRyb21pbm8oKTtcclxuICAgIHN0YXJ0WC0tO1xyXG4gICAgRHJhd1RldHJvbWlubygpO1xyXG4gIH0gZWxzZSBpZiAoa2V5LmtleUNvZGUgPT09IDY4KSB7XHJcbiAgICBkaXJlY3Rpb24gPSBESVJFQ1RJT04uUklHSFQ7XHJcbiAgICBzdGFydFgrKztcclxuICAgIERyYXdUZXRyb21pbm8oKTtcclxuICB9IGVsc2UgaWYgKGtleS5rZXlDb2RlID09PSA4Mykge1xyXG4gICAgZGlyZWN0aW9uID0gRElSRUNUSU9OLkRPV047XHJcbiAgICBzdGFydFkrKztcclxuICAgIERyYXdUZXRyb21pbm8oKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gRGVsZXRlVGV0cm9taW5vKCkge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFRldHJvbWluby5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHggPSBjdXJyZW50VGV0cm9taW5vW2ldWzBdICsgc3RhcnRYO1xyXG4gICAgbGV0IHkgPSBjdXJyZW50VGV0cm9taW5vWygxKVsxXV0gKyBzdGFydFk7XHJcbiAgICBnYW1lQm9hcmRBcnJheUhlaWdodFt4XVt5XSA9IDA7XHJcbiAgICBsZXQgY29vclggPSBjb29yZGluYXRlQXJyYXlbeF1beV0ueDtcclxuICAgIGxldCBjb29yWSA9IGNvb3JkaW5hdGVBcnJheVt4XVt5XS55O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgIGN0eC5maWxsUmVjdChjb29yWCwgY29vclksIDIxLCAyMSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBDcmVhdGVUZXRyb21pbm9zKCkge1xyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzAsIDBdLFxyXG4gICAgWzEsIDBdLFxyXG4gICAgWzIsIDBdLFxyXG4gICAgWzMsIDBdXHJcbiAgXSk7XHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFswLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXSxcclxuICAgIFsyLCAxXVxyXG4gIF0pO1xyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMCwgMV0sXHJcbiAgICBbMSwgMV1cclxuICBdKTtcclxuICB0ZXRyb21pbm9zLnB1c2goW1xyXG4gICAgWzIsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWzEsIDFdLFxyXG4gICAgWzIsIDFdXHJcbiAgXSk7XHJcbiAgdGV0cm9taW5vcy5wdXNoKFtcclxuICAgIFsxLCAwXSxcclxuICAgIFsyLCAwXSxcclxuICAgIFswLCAxXSxcclxuICAgIFsxLCAxXVxyXG4gIF0pO1xyXG4gIHRldHJvbWlub3MucHVzaChbXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbMSwgMF0sXHJcbiAgICBbMSwgMV0sXHJcbiAgICBbMiwgMV1cclxuICBdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ3JlYXRlVGV0cm9taW5vKCkge1xyXG4gIGxldCByYW5kb21UZXRyb21pbm8gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXRyb21pbm9zLmxlbmd0aCk7XHJcbiAgY3VycmVudFRldHJvbWlubyA9IHRldHJvbWlub3NbcmFuZG9tVGV0cm9taW5vXTtcclxuICBjdXJyZW50VGV0cm9taW5vQ29sb3IgPSBjdXJyZW50VGV0cm9taW5vQ29sb3JbcmFuZG9tVGV0cm9taW5vXTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);