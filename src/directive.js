app.directive('ngGameCanvas', function(){
  var canv, ctx, elem, rect;

  return {
    restrict: 'EA',
    scope: {
      loadedSettings: '<'
      , gameState: '<'
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
            ctx.fillStyle='black';
            ctx.fillRect(0, 0, canv.width, canv.height);
          }
        }, true);

        drawTiles();
      }

      function drawTiles() {
        scope.$watch('gameState', function(newGameState) {
          if (newGameState && newGameState.gameStarted == false) {
            console.log('redraw');
            ctx.fillStyle='grey';
            for (var row = 0;
                 row < scope.loadedSettings.gridHeight;
                 row++) {
              scope.gameState.gridClicked[row] = []
              for (var col = 0;
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

      element.bind('mousedown', function(event) {
        console.log('down');
        if (event.which != 1 || scope.gameOver == true) {
          return;
        }
        scope.emote = ':-O';
        scope.$apply();
      });

      element.bind('click', function(event) {
        console.log('clickity');
        if (scope.gameOver == true) {
          return;
        }
        scope.emote = ':-)';
        scope.$apply();
      });

      initGame();
    }
  };
});
