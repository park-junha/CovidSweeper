app.directive('ngCovidsweeper', function(){
  var canv, ctx, elem, rect;

  return {
    restrict: 'A',
    scope: {
      loadedSettings: '<'
      , gameCanvasSettings: '<'
    },
    link: function(scope, element){
      elem = element;
      canv = elem.find('canvas')[0];
      rect = canv.getBoundingClientRect();
      ctx = canv.getContext('2d');

      ctx.font = scope.loadedSettings.tileSize + 'px Arial';
      ctx.fillStyle="black";
      ctx.fillRect(0, 0, canv.width, canv.height);
      ctx.fillStyle="grey";
      for (var row = 0; row < scope.loadedSettings.gridHeight; row++) {
        gridClicked[row] = []
        for (var col = 0; col < scope.loadedSettings.gridWidth; col++) {
          gridClicked[row][col] = tileDefault;
          ctx.fillRect(col * scope.loadedSettings.tileSize+1,
                       row * scope.loadedSettings.tileSize+1,
                       scope.loadedSettings.tileSize-1,
                       scope.loadedSettings.tileSize-1);
        }
      }
    }
  };
});
