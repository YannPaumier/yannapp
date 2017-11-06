module.exports = {
/*
* Hunter part
*/
   s0:  {
    name: 'shoot',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '8',
      cooldown: '0',
      speed: 10,
      debuff: function (character, spell) {
        var damage = this.damage;
        character.hp -= damage;
      },
    },
  },

  s1:  {
    name: 'aim shoot',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '50',
      cooldown: '3',
      speed: 20,
      debuff: function (character, spell) {
        character.hp -= this.damage;
        //return character;
      },
    },
  },

  s2:  {
    name: 'slow',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '2',
      cooldown: '5',
      speed: 30,
      debuff: function (character, spell) {
        var damage = this.damage;
        character.hp -= damage;
        character.speed -= 2;
        setTimeout(function(){
          console.log('speed avant reset : ' +character.speed);
          character.speed += 2;
        }, 5000);
      },
    },
  },

  s6:  {
    name: 'backdash',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 30,
      debuff: function (character, spell) {
        character.hp -= this.damage;
        var alpha = spell.alpha;
        var speedX = 100 * Math.sin(alpha);
        var speedY = -100 * Math.cos(alpha);
        var newX = character.x + speedX;
        var newY = character.y + speedY;
        character.buffDebuff = { newX: newX , newY: newY, newAngle: null, newSpeed: null, timeout: 0 };
      },
    },
  },

  /*
  * War  part
  */

  s3:  {
    name: 'charge',
    isCibled: false,
    isSelf: true,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 10,
      buff: function (spell, character, target){
        var newX;
        var newY;
        //var distanceXY = Math.sqrt( (Math.pow(target.x) - Math.pow(character.x)) + (Math.pow(target.y) - Math.pow(character.y)) );
      //  if( distanceXY < 300 ){
        //  newX = target.x;
        //  newY = targe.y;
        //}
        var alpha = spell.alpha;
        var speedX = 150 * Math.sin(alpha);
        var speedY = -150 * Math.cos(alpha);
        var newX = character.x + speedX;
        var newY = character.y + speedY;
        character.buffDebuff = { newX: newX , newY: newY, newAngle: null, newSpeed: null, timeout: 0 };
      },
      debuff: function (character, spell) {
        character.hp -= this.damage;
        //character.speed -= 5;
        return character;
      },
    },
  },

  s4:  {
    name: 'strike',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 10,
      debuff: function (character, spell) {
        character.hp -= this.damage;
        //character.speed -= 5;
        return character;
      },
    },
  },

  s5:  {
    name: 'shield',
    isCibled: false,
    isSelf: false,
    isAttack: false,
    isSpell: true,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 10,
      debuff: function (character, spell) {
        character.hp -= this.damage;
        //character.speed -= 5;
        return character;
      },
    },
  },

};
