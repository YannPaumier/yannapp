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

};

module.exports = Spell;
