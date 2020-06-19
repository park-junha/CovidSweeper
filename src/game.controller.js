app.controller('gameController', function($scope, $rootScope) {
  function resetGame() {
    $scope.gameState = {
      'minesLeft': $scope.loadedSettings.maxMines
      , 'maxMines': $scope.loadedSettings.maxMines
      , 'gridClicked': []
      , 'gridState': []
      , 'gameStarted': false
      , 'gameOver': false
      , 'tilesToClick': $scope.loadedSettings.totalTiles -
                        $scope.loadedSettings.maxMines
    };
  };

  function loadSettings() {
    $scope.loadedSettings = {
      'gridWidth': $rootScope.gameSettings[$scope.settings.difficulty]
                     .gridWidth
      , 'gridHeight': $rootScope.gameSettings[$scope.settings.difficulty]
                        .gridHeight
      , 'maxMines': $rootScope.gameSettings[$scope.settings.difficulty]
                      .maxMines
      , 'spreadRate': $rootScope.gameSettings[$scope.settings.difficulty]
                        .spreadRate
      , 'maxInfected': $rootScope.gameSettings[$scope.settings.difficulty]
                         .maxInfected
      , 'minUninfected': $rootScope.gameSettings[$scope.settings.difficulty]
                           .minUninfected
      , 'tileSize': $rootScope.textOffsetSettings[$scope.settings.textSize]
                      .tileSize
      , 'textOffsets': $rootScope
                         .textOffsetSettings[$scope.settings.textSize]
    };
    $scope.loadedSettings.totalTiles = $scope.loadedSettings.gridWidth *
                                       $scope.loadedSettings.gridHeight;
    $scope.gameCanvasSettings = {
      'width': $scope.loadedSettings.gridWidth *
               $scope.loadedSettings.tileSize + 1
      , 'height': $scope.loadedSettings.gridHeight *
                  $scope.loadedSettings.tileSize + 1
    };
    resetGame();
  };

  $scope.$watch('settings', function (newSettings) {
    if (newSettings) {
      loadSettings();
    }
  }, true);

  $scope.resetGame = resetGame;
  $scope.loadSettings = loadSettings;

  $scope.settings = {
    'textSize': $rootScope.defaultSize
    , 'difficulty': $rootScope.defaultDifficulty
  };

  $scope.gameStatistics = {
    'tileCasualties': 0
    , 'outbreaks': 0
    , 'pandemics': 0
    , 'cheated': false
  };
});
