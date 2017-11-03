var infos = require('./config/characters.js');
var helpers = require('../game/helpers.js');

function Character(id, type, name) {
  this.id = id;
  this.name = name;
  this.type = type;

  this.setStats();
  this.initPosition();
}

Character.prototype = {

  setStats: function () {
    // Récupération des infos de la classe
    var infos = helpers.getCharacterInfos(this.type);

    this.hp = infos.vitality;
    this.speed = infos.speed;
  },

  initPosition: function () {
    // Set de la position du joueur
    if (helpers.isEven(this.id))  {
      this.x = helpers.getRandomInt(30, 230);
      this.y = helpers.getRandomInt(200, 500);
    }else {
      this.x = helpers.getRandomInt(1050, 1220);
      this.y = helpers.getRandomInt(200, 500);
    };
  },

};

module.exports = Character;
