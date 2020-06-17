const defaultDifficulty = 'intermediate';
const defaultSize = 'medium';
const gameSettings = {
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
const textOffsetSettings = {
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

var app = angular.module('ngGame', []);
