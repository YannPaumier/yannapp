var CHARACTER_INIT_HP = 100;

exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.getCharacterHP = function () {
  return CHARACTER_INIT_HP;
};
