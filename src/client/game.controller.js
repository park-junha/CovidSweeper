app.controller('gameController', function($scope, $rootScope, $http) {
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

  function submitScore(newHiscoreName) {
    $http({
      url: $rootScope.apiUrl + '/hiscores'
      , method: 'POST'
      , headers: {
        'Content-Type': 'application/json'
      }
      , data: {
        'time': $scope.timer
        , 'name': newHiscoreName
        , 'difficulty': $scope.settings.difficulty
        , 'mines': $scope.gameState.maxMines
      }
    }).then(closeModal)
    .catch((err) => {
      $scope.failedApiAttempts++;
    })
  };

  function closeModal() {
    $scope.failedApiAttempts = 0;
    $scope.newHiscore = false;
  };

  $scope.$watch('settings', function (newSettings) {
    if (newSettings) {
      loadSettings();
    }
  }, true);

  $scope.resetGame = resetGame;
  $scope.loadSettings = loadSettings;
  $scope.closeModal = closeModal;
  $scope.submitScore = submitScore;
  $scope.newHiscore = false;
  $scope.failedApiAttempts = 0;

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
