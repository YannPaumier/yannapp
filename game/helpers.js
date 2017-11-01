var hunter = require('./characters/hunter.js');
var assassin = require('./characters/assassin.js');
var mage = require('./characters/mage.js');
var paladin = require('./characters/paladin.js');
var warrior = require('./characters/warrior.js');

exports.getCharacterInfos = function (type){
  switch(type) {
    case 1:
        return hunter;
        break;
    case 2:
        return warrior;
        break;
    case 3:
        return mage;
        break;
    case 4:
        return assassin;
        break;
    case 5:
        return paladin;
        break;
    default:
        return 0;
}
}

exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.isEven = function(n) {
  if( n % 2 == 0 ){
    return true;
  }else{
    return false;
  }
}
