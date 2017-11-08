var helpers = require('../game/helpers.js');
var spellsInfos = require('./config/spells.js');

function Character(id, type, name) {
  this.id = id;
  this.name = name;
  this.type = type;

  this.spells = {};
  this.carac = {};
  this.spellAffection = null;

  this.setStats();
  this.initPosition();
}

Character.prototype = {

  setStats: function () {
    // Récupération des infos de la classe
    var infos = helpers.getCharacterInfos(this.type);

    this.hp = infos.vitality;
    this.carac = { speed: infos.speed };
    //this.speed = infos.speed;


    // Récupération des spells du character
    var characterSpells = infos.spells;

    var t = this;
    var count = 0;
    characterSpells.forEach(function(value){
      if( spellsInfos[value] != undefined ){
        var spellInfo = spellsInfos[value];
        //console.log('value : ' + value);
        //console.log('name : ' + spellInfo.name);
        //console.log('cooldown : ' + spellInfo.level1.cooldown);
        var spellKey = count;
        if (count == 0)
          spellKey = 'lc';

        t.spells[count] = {id: value, name: spellInfo.name, cooldown: spellInfo.level1.cooldown, isAttack: spellInfo.isAttack, isSpell: spellInfo.isSpell, isProjectile: spellInfo.isProjectile, spellKey: spellKey};
        count++;
      }
    });

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
