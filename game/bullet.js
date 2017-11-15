var spellsInfos = require('./config/spells.js');

function Bullet(id, idSpell, ownerId, alpha, x, y) {
  //console.log ('newBall : '+ownerId+ ' : ' + alpha + ' : ' + x + ' : ' +y );

  this.id = id;
  this.idSpell = idSpell;
  this.ownerId = ownerId;
  this.alpha = alpha; //angle of shot in radians
  this.x = x;
  this.y = y;
  this.out = false;

}

Bullet.prototype = {

  fly: function () {
    //move to trajectory
    var spellInfo = spellsInfos[this.idSpell];
    var speed = spellInfo['level1'].speed;

    var speedX = speed * Math.sin(this.alpha);
    var speedY = - speed * Math.cos(this.alpha);
    this.x += speedX;
    this.y += speedY;
  },

  hurtCharacter: function (target) {
      var spellInfo = spellsInfos[this.idSpell];
      spellInfo['level1'].hurtAssignment(this, null, target);
      //console.log('HURT');
      this.out = true;
      this.exploding = true;
      //console.log('new X : ' +character.buffDebuff.newX);
  },

};

module.exports = Spell;
