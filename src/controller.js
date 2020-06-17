app.controller('ngCtrl', function($scope) {
  $scope.timer = 0;
  $scope.loadedDifficulty = defaultDifficulty;
  $scope.loadedTextSize = defaultSize;
  $scope.loadedSettings = {
    'gridWidth': gameSettings[$scope.loadedDifficulty].gridWidth
    , 'gridHeight': gameSettings[$scope.loadedDifficulty].gridHeight
    , 'maxMines': gameSettings[$scope.loadedDifficulty].maxMines
    , 'spreadRate': gameSettings[$scope.loadedDifficulty].spreadRate
    , 'maxInfected': gameSettings[$scope.loadedDifficulty].maxInfected
    , 'minUninfected': gameSettings[$scope.loadedDifficulty].minUninfected
    , 'tileSize': textOffsetSettings[$scope.loadedTextSize].tileSize
    , 'textOffsets': textOffsetSettings[$scope.loadedTextSize]
  };
  $scope.loadedSettings.totalTiles = $scope.loadedSettings.gridWidth
                                     * $scope.loadedSettings.gridHeight;
  $scope.gameCanvasSettings = {
    'width': $scope.loadedSettings.gridWidth
             * $scope.loadedSettings.tileSize + 1
    , 'height': $scope.loadedSettings.gridHeight
                * $scope.loadedSettings.tileSize + 1
  };
});
