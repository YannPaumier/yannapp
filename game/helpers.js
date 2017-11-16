var characters = require('./config/characters.js');

var lastId = 0;

exports.generateId = function () {
  lastId++;
  if (lastId > 1000) {
    lastId = 0;
  }
  return lastId;
}

exports.getCharacterInfos = function (type) {
  switch (type) {
    case 1:
        return characters[1];
        break;
    case 2:
        return characters[2];
        break;
    case 3:
        return characters[3];
        break;
    case 4:
        return characters[4];
        break;
    case 5:
        return characters[5];
        break;
    default:
        return 0;
      }
};

exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.isEven = function(n) {
  if( n % 2 == 0 ){
    return true;
  }else{
    return false;
  }
};
