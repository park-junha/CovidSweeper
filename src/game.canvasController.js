app.directive('ngGameCanvas', ['$interval', function ($interval) {
  let canv, ctx, elem, rect, timerPromise;

  return {
    restrict: 'EA',
    scope: {
      loadedSettings: '<'
      , emote: '='
      , gameState: '='
      , gameStatistics: '='
      , settings: '<'
      , timer: '='
    },
    link: function (scope, element) {
      elem = element;
      canv = elem[0];
      rect = canv.getBoundingClientRect();
      ctx = canv.getContext('2d');

      function startGame(initX, initY) {
        timerPromise = $interval(gameTimer, 1000);

        scope.gameState.gameStarted = true;
        scope.$apply();

        for (let row = 0; row < scope.loadedSettings.gridHeight; row++) {
          scope.gameState.gridState[row] = [];
          for (let col = 0; col < scope.loadedSettings.gridWidth; col++) {
            scope.gameState.gridState[row][col] = 0;
          }
        }

        let minesToPlace = scope.gameState.maxMines;
        while (minesToPlace > 0) {
          let mineX = Math.floor(Math.random() *
                             scope.loadedSettings.gridWidth);
          let mineY = Math.floor(Math.random() *
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
                  scope.gameState.gridState[j][i]++;
                }
              }
            }
            minesToPlace -= 1;
          }
        }
      }

      function gameTimer() {
        if (scope.gameState.gameStarted === true &&
            scope.gameState.gameOver === false) {
          scope.timer++;
          if (Math.random() < scope.loadedSettings.spreadRate) {
            addNewMine();
          }
        }
      }

      function stopTimer() {
        $interval.cancel(timerPromise);
      }

      function addNewMine() {
        let mineX = Math.floor(Math.random() *
                               scope.loadedSettings.gridWidth);
        let mineY = Math.floor(Math.random() *
                               scope.loadedSettings.gridHeight);
        if (scope.gameState.maxMines >= scope.loadedSettings.maxInfected ||
            scope.gameState.tilesToClick <=
            scope.loadedSettings.minUninfected) {
          return;
        }
        while (scope.gameState.gridClicked[mineY][mineX] === TILE_CLICKED ||
               scope.gameState.gridState[mineY][mineX] === TILE_BOMB) {
          mineX = Math.floor(Math.random() *
                             scope.loadedSettings.gridWidth);
          mineY = Math.floor(Math.random() *
                             scope.loadedSettings.gridHeight);
        }
        scope.gameState.gridState[mineY][mineX] = TILE_BOMB;
        scope.gameState.tilesToClick--;
        scope.gameState.minesLeft++;
        scope.gameState.maxMines++;
        scope.gameStatistics.tileCasualties++;
        for (let j = Math.max(mineY - 1, 0);
             j <= Math.min(mineY + 1, scope.loadedSettings.gridHeight - 1);
             j++) {
          for (let i = Math.max(mineX - 1, 0);
               i <= Math.min(mineX + 1, scope.loadedSettings.gridWidth - 1);
               i++) {
            if (scope.gameState.gridState[j][i] !== TILE_BOMB){
              scope.gameState.gridState[j][i]++;
              if (scope.gameState.gridClicked[j][i] === TILE_CLICKED) {
                ctx.fillStyle = 'grey';
                ctx.fillRect(i * scope.loadedSettings.tileSize + 1,
                             j * scope.loadedSettings.tileSize + 1,
                             scope.loadedSettings.tileSize,
                             scope.loadedSettings.tileSize);
                ctx.fillStyle = scope.gameState.gridState[j][i] < 7 ?
                                'thistle' : 'black';
                ctx.fillRect(i * scope.loadedSettings.tileSize + 1,
                             j * scope.loadedSettings.tileSize + 1,
                             scope.loadedSettings.tileSize - 1,
                             scope.loadedSettings.tileSize - 1);
                ctx.fillStyle = scope.gameState.gridState[j][i] < 7 ?
                                'indigo' : 'thistle';
                ctx.fillText(scope.gameState.gridState[j][i],
                             i * scope.loadedSettings.tileSize +
                                 scope.loadedSettings.textOffsets.hOffset,
                             (j + 1) *
                                 scope.loadedSettings.tileSize +
                                 scope.loadedSettings.textOffsets.vOffset);
              }
            }
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
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize - 1,
                     scope.loadedSettings.tileSize - 1);
      }

      function countSurroundingTiles(x, y) {
        let count = 0;
        for (let j = Math.max(y - 1, 0);
             j <= Math.min(y + 1, scope.loadedSettings.gridHeight - 1);
             j++) {
          for (let i = Math.max(x - 1, 0);
               i <= Math.min(x + 1, scope.loadedSettings.gridWidth - 1);
               i++) {
            switch (scope.gameState.gridClicked[j][i]) {
              case TILE_FLAGGED:
                count++;
                break;
            }
          }
        }
        return count;
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
          endGame(x, y);
          return;
        }
        else {
          switch (scope.gameState.gridState[y][x]) {
            case 1:
              textColor = 'blue';
              break;
            case 2:
              textColor = 'green';
              break;
            case 3:
              textColor = 'red';
              break;
            case 4:
              textColor = 'navy';
              break;
            case 5:
              textColor = 'brown';
              break;
            case 6:
              textColor = 'cyan';
              break;
            case 7:
              tileInner = 'black';
              textColor = 'white';
              break;
            case 8:
              tileInner = 'white';
              textColor = 'lightgray';
              break;
            default:
              ctx.fillStyle = 'grey';
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
          winGame();
        }
      }

      function markTile(x, y) {
        if (scope.gameState.gridClicked[y][x] === TILE_CLICKED) {
          return;
        }

        scope.gameState.gridClicked[y][x] =
          (scope.gameState.gridClicked[y][x] + 1) % TILE_STATES_MODULO;
      
        ctx.fillStyle = 'black';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize,
                     scope.loadedSettings.tileSize);
        ctx.fillStyle = 'grey';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize - 1,
                     scope.loadedSettings.tileSize - 1);
      
        switch (scope.gameState.gridClicked[y][x]) {
          case TILE_DEFAULT:
            break;
          case TILE_FLAGGED:
            ctx.fillStyle = 'indigo';
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
            ctx.fillStyle = 'black';
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

      function endGame(x, y) {
        scope.gameState.gameOver = true;
        scope.emote = 'X-(';
        stopTimer();

        ctx.fillStyle = 'purple';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize,
                     scope.loadedSettings.tileSize);
        ctx.fillStyle = 'blueviolet';
        ctx.fillRect(x * scope.loadedSettings.tileSize + 1,
                     y * scope.loadedSettings.tileSize + 1,
                     scope.loadedSettings.tileSize - 1,
                     scope.loadedSettings.tileSize - 1);
        ctx.fillStyle = 'indigo';
        ctx.fillText('*',
                     x * scope.loadedSettings.tileSize +
                         scope.loadedSettings.textOffsets.hOffsetMine,
                     (y + 1) *
                         scope.loadedSettings.tileSize +
                         scope.loadedSettings.textOffsets.vOffsetMine);

        for (let j = 0; j < scope.gameState.gridState.length; j++) {
          for (let i = 0; i < scope.gameState.gridState[j].length; i++) {
            if (scope.gameState.gridState[j][i] !== TILE_BOMB &&
                (scope.gameState.gridClicked[j][i] === TILE_FLAGGED ||
                 scope.gameState.gridClicked[j][i] === TILE_UNSURE)) {
              ctx.fillStyle = 'black';
              ctx.fillText('X',
                           i * scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets.hOffsetX,
                           (j + 1) *
                               scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets.vOffsetX);
            }
            if (scope.gameState.gridState[j][i] === TILE_BOMB &&
                scope.gameState.gridClicked[j][i] === TILE_DEFAULT &&
                (x !== i || y !== j)) {
              ctx.fillStyle = '#b19cd9';
              ctx.fillRect(i * scope.loadedSettings.tileSize + 1,
                           j * scope.loadedSettings.tileSize + 1,
                           scope.loadedSettings.tileSize - 1,
                           scope.loadedSettings.tileSize - 1);
              ctx.fillStyle = 'indigo';
              ctx.fillText('*',
                           i * scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets
                                 .hOffsetMine,
                           (j + 1) *
                               scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets
                                 .vOffsetMine);
            }
          }
        }
        scope.$apply();
      }

      function winGame() {
        if (scope.gameState.gameOver === true ||
            scope.gameState.gameStarted === false) {
          return;
        }

        scope.gameState.gameOver = true;
        scope.emote = 'B-)';
        scope.gameState.minesLeft = 0;
        stopTimer();

        let minesUncovered = 0;
        for (let j = 0; j < scope.gameState.gridState.length; j++) {
          for (let i = 0; i < scope.gameState.gridState[j].length; i++) {
            if (scope.gameState.gridClicked[j][i] !== TILE_CLICKED) {
              ctx.fillStyle = 'grey';
              ctx.fillRect(i * scope.loadedSettings.tileSize + 1,
                           j * scope.loadedSettings.tileSize + 1,
                           scope.loadedSettings.tileSize,
                           scope.loadedSettings.tileSize);
              ctx.fillStyle = 'aliceblue';
              ctx.fillRect(i * scope.loadedSettings.tileSize + 1,
                           j * scope.loadedSettings.tileSize + 1,
                           scope.loadedSettings.tileSize - 1,
                           scope.loadedSettings.tileSize - 1);
              ctx.fillStyle = 'powderblue';
              ctx.fillText('*',
                           i * scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets
                                .hOffsetMine,
                           (j + 1) * scope.loadedSettings.tileSize +
                               scope.loadedSettings.textOffsets
                                .vOffsetMine);
              minesUncovered++;
            }
          }
        }
        if (minesUncovered === scope.gameState.maxMines) {
          if (scope.settings.difficulty === 'omgwhy') {
            scope.gameStatistics.pandemics++;
          }
          else {
            scope.gameStatistics.outbreaks++;
          }
        }
        else {
          scope.gameStatistics.cheater = true;
        }
        scope.$apply();
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

        scope.emote = ':-)';
        scope.$apply();

        if (x < 0 || y < 0 || x >= scope.loadedSettings.gridWidth ||
            y >= scope.loadedSettings.gridHeight) {
          return;
        }

        if (scope.gameState.gameStarted === false){
          gameStarted = true;
          startGame(x, y);
        }

        checkTile(x, y);
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

      element.bind('dblclick', function (event) {
        if (scope.gameState.gameOver === true ||
            scope.gameState.gameStarted === false) {
          return;
        }

        let x = Math.floor((event.pageX - rect.left - 1) /
                           scope.loadedSettings.tileSize);
        let y = Math.floor((event.pageY - rect.top - 1) /
                           scope.loadedSettings.tileSize);

        scope.emote = ':-)';
        scope.$apply();

        if (scope.gameState.gridClicked[y][x] !== TILE_CLICKED) {
          return;
        }
        if (countSurroundingTiles(x, y) !==
            scope.gameState.gridState[y][x]) {
          return;
        }
        checkSurroundingTiles(x, y);
      });

      scope.$watch('loadedSettings', function (newLoadedSettings) {
        if (newLoadedSettings) {
          ctx.font = scope.loadedSettings.tileSize + 'px Arial';
        }
      }, true);

      scope.$watch('gameState', function (newGameState) {
        if (newGameState &&
            newGameState.gameStarted === false &&
            newGameState.gameOver === false) {
          stopTimer();
          scope.timer = 0;
          scope.emote = ':-)';
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canv.width, canv.height);
          ctx.fillStyle = 'grey';
          for (let row = 0;
               row < scope.loadedSettings.gridHeight;
               row++) {
            scope.gameState.gridClicked[row] = []
            for (let col = 0;
                 col < scope.loadedSettings.gridWidth;
                 col++) {
              scope.gameState.gridClicked[row][col] = TILE_DEFAULT;
              ctx.fillRect(col * scope.loadedSettings.tileSize + 1,
                           row * scope.loadedSettings.tileSize + 1,
                           scope.loadedSettings.tileSize - 1,
                           scope.loadedSettings.tileSize - 1);
            }
          }
        }
      }, true);
    }
  };
}]);
