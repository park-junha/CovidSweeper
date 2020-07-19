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

  function initializeHighScores() {
    $scope.hiscores = {};
    $scope.hiscoreFetchStatuses = {};
    $scope.hiscoreLastUpdates = {};
    for (const difficulty in $rootScope.gameSettings) {
      $scope.hiscores[difficulty] = {};
      $scope.hiscoreFetchStatuses[difficulty] = {};
      $scope.hiscoreLastUpdates[difficulty] = {};
      $rootScope.hiscoreCategories.forEach((category) => {
        $scope.hiscores[difficulty][category] = [];
        $scope.hiscoreFetchStatuses[difficulty][category] = 0;
        $scope.hiscoreLastUpdates[difficulty][category] = '';
      });
    }
  };

  function getHiscores(diff, category) {
    $http({
      url: $rootScope.apiUrl + '/hiscores/' + diff + '/' + category
      , method: 'GET'
    }).then((res) => {
      $scope.hiscores[diff][category] = res.data;
      $scope.hiscoreFetchStatuses[diff][category] = res.status;
      $scope.hiscoreLastUpdates[diff][category] =
        new Date().toLocaleTimeString();
    }).catch((err) => {
      $scope.hiscoreFetchStatuses[diff][category] = err.status;
    });
  };

  function submitScore(newHiscoreName) {
    $scope.submittingScore = true;
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
      $scope.submittingScore = false;
      $scope.failedApiAttempts++;
    });
  };

  function closeModal() {
    $scope.submittingScore = false;
    $scope.failedApiAttempts = 0;
    $scope.newHiscore = false;
    $scope.viewHiscores = false;
  };

  $scope.$watch('settings', function (newSettings) {
    if (newSettings) {
      loadSettings();
    }
  }, true);

  $scope.$watch('scoresToView', function (newHiscoreViewOptions) {
    if (newHiscoreViewOptions &&
        $scope.hiscoreFetchStatuses[newHiscoreViewOptions.difficulty]
        [newHiscoreViewOptions.category] === 0) {
      getHiscores(newHiscoreViewOptions.difficulty,
                  newHiscoreViewOptions.category);
    }
  }, true);

  function refreshHiscores() {
    $scope.hiscoreFetchStatuses[$scope.scoresToView.difficulty]
      [$scope.scoresToView.category] = 0;
    getHiscores($scope.scoresToView.difficulty,
                $scope.scoresToView.category);
  };

  $scope.resetGame = resetGame;
  $scope.loadSettings = loadSettings;
  $scope.closeModal = closeModal;
  $scope.submitScore = submitScore;
  $scope.refreshHiscores = refreshHiscores;

  $scope.newHiscore = false;
  $scope.viewHiscores = false;
  $scope.submittingScore = false;
  $scope.failedApiAttempts = 0;
  $scope.scoresToView = {
    'difficulty': 'intermediate'
    , 'category': 'daily'
  };

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

  initializeHighScores();
});
