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

    // Detect collisions with obstacles
    var HEIGHT = 720;
    var obst1 = { x: 240, y: (HEIGHT) - 459, width: 216, height: 259 };
    var obst2 = { x: 800, y: (HEIGHT) - 459, width: 216, height: 259 };
    var collision = false;
    if (obst1.x < this.x - 20 &&
      obst1.x + obst1.width > this.x + 20 &&
      obst1.y < (HEIGHT - this.y) - 40 &&
      obst1.height + obst1.y > (HEIGHT - this.y) + 40 ) {
        this.out = true;
        this.exploding = true;
      }

      if (obst2.x < this.x - 20 &&
        obst2.x + obst2.width > this.x + 20 &&
        obst2.y < (HEIGHT - this.y) - 40 &&
        obst2.height + obst2.y > (HEIGHT - this.y) + 40 ) {
          this.out = true;
          this.exploding = true;
      }
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
