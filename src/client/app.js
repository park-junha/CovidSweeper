let app = angular.module('ngGame', [])
.run(function($rootScope) {
  $rootScope.defaultDifficulty = 'intermediate';
  $rootScope.defaultSize = 'medium';
  $rootScope.gameSettings = {
    'intermediate': {
      'gridWidth': 9,
      'gridHeight': 9,
      'maxMines': 10,
      'spreadRate': 0.15,
      'minUninfected': 8,
      'maxInfected': 15,
      'textSize': 'medium'
    },
    'advanced': {
      'gridWidth': 16,
      'gridHeight': 16,
      'maxMines': 36,
      'spreadRate': 0.15,
      'minUninfected': 12,
      'maxInfected': 70,
      'textSize': 'medium'
    },
    'omgwhy': {
      'gridWidth': 30,
      'gridHeight': 16,
      'maxMines': 75,
      'spreadRate': 0.15,
      'minUninfected': 8,
      'maxInfected': 165,
      'textSize': 'medium'
    }
  };
  $rootScope.textOffsetSettings = {
    'small': {
      'tileSize': 24,
      'hOffset': 6,
      'vOffset': -3,
      'hOffsetMine': 8,
      'vOffsetMine': 3,
      'hOffsetFlag': 3,
      'vOffsetFlag': -3,
      'hOffsetX': 5,
      'vOffsetX': -3
    },
    'medium': {
      'tileSize': 36,
      'hOffset': 8,
      'vOffset': -4,
      'hOffsetMine': 11,
      'vOffsetMine': 3,
      'hOffsetFlag': 4,
      'vOffsetFlag': -4,
      'hOffsetX': 6,
      'vOffsetX': -4
    }
  };
});

const TILE_BOMB = -1;
const TILE_DEFAULT = 0;
const TILE_FLAGGED = 1;
const TILE_UNSURE = 2;
const TILE_CLICKED = 3;

const TILE_STATES_MODULO = 3;
