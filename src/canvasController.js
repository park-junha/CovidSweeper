app.directive('ngGameCanvas', function(){
  var canv, ctx, elem, rect;

  return {
    restrict: 'EA',
    scope: {
      loadedSettings: '<'
      , gameState: '='
      , emote: '='
    },
    link: function(scope, element){
      elem = element;
      canv = elem[0];
      rect = canv.getBoundingClientRect();
      ctx = canv.getContext('2d');

      function initGame() {
        scope.$watch('loadedSettings', function(newLoadedSettings) {
          if (newLoadedSettings) {
            ctx.font = scope.loadedSettings.tileSize + 'px Arial';
          }
        }, true);

        drawTiles();
      }

      function drawTiles() {
        scope.$watch('gameState', function(newGameState) {
          if (newGameState && newGameState.gameStarted === false) {
            console.log('redraw');
            ctx.fillStyle='black';
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.fillStyle='grey';
            for (let row = 0;
                 row < scope.loadedSettings.gridHeight;
                 row++) {
              scope.gameState.gridClicked[row] = []
              for (let col = 0;
                   col < scope.loadedSettings.gridWidth;
                   col++) {
                scope.gameState.gridClicked[row][col] = TILE_DEFAULT;
                ctx.fillRect(col * scope.loadedSettings.tileSize+1,
                             row * scope.loadedSettings.tileSize+1,
                             scope.loadedSettings.tileSize-1,
                             scope.loadedSettings.tileSize-1);
              }
            }
          }
        }, true);
      }

      function startGame (initX, initY) {
        scope.gameState.gameStarted = true;
        //document.getElementById("gameTimer").style.color = 'thistle';
        for (let row = 0; row < scope.loadedSettings.gridHeight; row++) {
          scope.gameState.gridState[row] = []
          for (let col = 0; col < scope.loadedSettings.gridWidth; col++) {
            scope.gameState.gridState[row][col] = 0;
          }
        }

        let minesToPlace = scope.gameState.maxMines;
        while (minesToPlace > 0) {
          mineX = Math.floor(Math.random() *
                             scope.loadedSettings.gridWidth);
          mineY = Math.floor(Math.random() *
                             scope.loadedSettings.gridHeight);
          if (scope.gameState.gridState[mineY][mineX] !== TILE_BOMB &&
              (Math.abs(initX - mineX) > 1 ||
               Math.abs(initY - mineY) > 1)){
            scope.gameState.gridState[mineY][mineX] = TILE_BOMB;
            for (let j = Math.max(mineY - 1, 0);
                 j <= Math.min(mineY + 1,
                               scope.loadedSettings.gridHeight - 1);
                 j++) {
              for (let i = Math.max(mineX - 1, 0);
                   i <= Math.min(mineX + 1,
                                 scope.loadedSettings.gridWidth - 1);
                   i++) {
                if (scope.gameState.gridState[j][i] !== TILE_BOMB){
                  scope.gameState.gridState[j][i] += 1;
                }
              }
            }
            minesToPlace -= 1;
          }
        }
      }

      function fillTile(x, y, outerColor, innerColor) {
        ctx.fillStyle = outerColor;
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize,
                     scope.loadedSettings.tileSize);
        ctx.fillStyle = innerColor;
        ctx.fillRect(x * scope.loadedSettings.tileSize+1,
                     y * scope.loadedSettings.tileSize+1,
                     scope.loadedSettings.tileSize - 1,
                     scope.loadedSettings.tileSize - 1);
      }

      function checkSurroundingTiles(x, y) {
        for (let j = Math.max(y - 1, 0);
             j <= Math.min(y + 1, scope.loadedSettings.gridHeight - 1);
             j++) {
          for (let i = Math.max(x - 1, 0);
               i <= Math.min(x + 1, scope.loadedSettings.gridWidth - 1);
               i++) {
            if (scope.gameState.gridClicked[j][i] !== TILE_CLICKED) {
              checkTile(i, j);
            }
          }
        }
      }

      function checkTile(x, y) {
        if (scope.gameState.gridClicked[y][x] === TILE_FLAGGED ||
            scope.gameState.gridClicked[y][x] === TILE_CLICKED) {
          return;
        }
      
        if (scope.gameState.gridClicked[y][x] !== TILE_CLICKED) {
          scope.gameState.gridClicked[y][x] = TILE_CLICKED;
          scope.gameState.tilesToClick -= 1;
        }
      
        let tileOuter='grey';
        let tileInner='silver';
      
        if (scope.gameState.gridState[y][x] === 0) {
          fillTile(x, y, tileOuter, tileInner);
          checkSurroundingTiles(x, y);
        }
        else if (scope.gameState.gridState[y][x] < 0) {
          console.log('gg');
          //endGame(x, y);
          return;
        }
        else {
          switch (scope.gameState.gridState[y][x]) {
            case 1:
              textColor='blue';
              break;
            case 2:
              textColor='green';
              break;
            case 3:
              textColor='red';
              break;
            case 4:
              textColor='navy';
              break;
            case 5:
              textColor='brown';
              break;
            case 6:
              textColor='cyan';
              break;
            case 7:
              tileInner='black';
              textColor='white';
              break;
            case 8:
              tileInner='white';
              textColor='lightgray';
              break;
            default:
              ctx.fillStyle='grey';
          }
          fillTile(x, y, tileOuter, tileInner);
          ctx.fillStyle = textColor;
          ctx.fillText(scope.gameState.gridState[y][x],
                       x * scope.loadedSettings.tileSize +
                       scope.loadedSettings.textOffsets.hOffset,
                       (y + 1) * scope.loadedSettings.tileSize +
                       scope.loadedSettings.textOffsets.vOffset);
        }
      
        if (scope.gameState.tilesToClick <= 0) {
          console.log('gg!');
          //winGame();
        }
      }

      function markTile (x, y) {
        if (scope.gameState.gridClicked[y][x] === TILE_CLICKED) {
          return;
        }

        //  TODO: replace hardcoded 3 with global constant
        scope.gameState.gridClicked[y][x] =
          (scope.gameState.gridClicked[y][x] + 1) % 3;
      
        ctx.fillStyle='black';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize,
                     scope.loadedSettings.tileSize);
        ctx.fillStyle='grey';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize - 1,
                     scope.loadedSettings.tileSize-1);
      
        switch (scope.gameState.gridClicked[y][x]) {
          case TILE_DEFAULT:
            break;
          case TILE_FLAGGED:
            ctx.fillStyle='indigo';
            ctx.fillText('O',
                         x * scope.loadedSettings.tileSize +
                             scope.loadedSettings.textOffsets.hOffsetFlag,
                         (y + 1) *
                             scope.loadedSettings.tileSize +
                             scope.loadedSettings.textOffsets.vOffsetFlag);
            scope.gameState.minesLeft -= 1;
            scope.$apply();
            break;
          case TILE_UNSURE:
            ctx.fillStyle='black';
            ctx.fillText('?',
                         x * scope.loadedSettings.tileSize +
                             scope.loadedSettings.textOffsets.hOffset,
                         (y + 1) *
                             scope.loadedSettings.tileSize +
                             scope.loadedSettings.textOffsets.vOffset);
            scope.gameState.minesLeft += 1;
            scope.$apply();
            break;
        }
      }

      element.bind('mousedown', function (event) {
        if (event.which != 1 || scope.gameState.gameOver === true) {
          return;
        }
        scope.emote = ':-O';
        scope.$apply();
      });

      element.bind('click', function (event) {
        if (scope.gameState.gameOver === true) {
          return;
        }

        let x = Math.floor((event.pageX - rect.left - 1) /
                            scope.loadedSettings.tileSize);
        let y = Math.floor((event.pageY - rect.top - 1) /
                            scope.loadedSettings.tileSize);
        if (scope.gameState.gameStarted === false){
          gameStarted = true;
          startGame(x, y);
        }

        checkTile(x, y);

        scope.emote = ':-)';
        scope.$apply();
      });

      element.bind('contextmenu', function (event) {
        event.preventDefault();

        if (scope.gameState.gameOver === true ||
            scope.gameState.gameStarted === false) {
          return;
        }
      
        let x = Math.floor((event.pageX - rect.left - 1) /
                            scope.loadedSettings.tileSize);
        let y = Math.floor((event.pageY - rect.top - 1) /
                            scope.loadedSettings.tileSize);

        markTile(x, y);
      });

      initGame();
    }
  };
});
