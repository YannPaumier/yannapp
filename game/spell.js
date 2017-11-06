var spellsInfos = require('./config/spells.js');

function Spell(id, idSpell, ownerId, alpha, x, y) {
  //console.log ('newBall : '+ownerId+ ' : ' + alpha + ' : ' + x + ' : ' +y );

  this.id = id;
  this.idSpell = idSpell;
  this.ownerId = ownerId;
  this.alpha = alpha; //angle of shot in radians
  this.x = x;
  this.y = y;
  this.out = false;

}

Spell.prototype = {

  fly: function () {
    //move to trajectory
    var spellInfo = spellsInfos[this.idSpell];
    var speed = spellInfo['level1'].speed;

    var speedX = speed * Math.sin(this.alpha);
    var speedY = -speed * Math.cos(this.alpha);
    this.x += speedX;
    this.y += speedY;
  },

  hurtCharacter: function (character) {
      var idSpell = this.idSpell;
      var spellInfo = spellsInfos[idSpell];
      spellInfo['level1'].debuff(character, this);
      //console.log('new X : ' +character.buffDebuff.newX);
  },

  affectSpell: function (character){
    var idSpell = this.idSpell;
    var spellInfo = spellsInfos[idSpell];
    spellInfo['level1'].buff(this, character);
    this.out = true;
  },

};

module.exports = Spell;
