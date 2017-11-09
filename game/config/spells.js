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
    isProjectile: true,
    level1: {
      damage: '8',
      cooldown: '0',
      speed: 10,
      assignment: function (spell, character, target){
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
    isProjectile: true,
    level1: {
      damage: '50',
      cooldown: '3',
      speed: 20,
      assignment: function (spell, character, target){
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
    isProjectile: true,
    level1: {
      damage: '2',
      cooldown: '5',
      speed: 30,
      assignment: function (spell, character, target){
        var damage = this.damage;
        character.spellAffection = { newX: null , newY: null, newAngle: null, newSpeed: 2, timeout: 5000 };
      },
    },
  },

  s6:  {
    name: 'backdash',
    isCibled: false,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    isProjectile: true,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 30,
      assignment: function (spell, character, target){
        character.hp -= this.damage;
        var alpha = spell.alpha;
        var speedX = 100 * Math.sin(alpha);
        var speedY = -100 * Math.cos(alpha);
        var newX = character.x + speedX;
        var newY = character.y + speedY;
        character.spellAffection = { newX: newX , newY: newY, newAngle: null, newSpeed: null, timeout: 0 };
      },
    },
  },

  /*
  * War  part
  */

  s3:  {
    name: 'charge',
    isCibled: true,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    isProjectile: false,
    level1: {
      damage: '30',
      cooldown: '2',
      speed: 10,
      assignment: function (spell, character, target){

        var newX;
        var newY;
        var distanceXY = Math.sqrt( Math.pow((target.x - character.x), 2) +  Math.pow((target.y - character.y), 2) );

        if( distanceXY < 300 ){
          newX = target.x;
          newY = target.y;
          character.spellAffection = { newX: newX , newY: newY, newAngle: null, newSpeed: null, timeout: 0 };

          target.hp -= this.damage;
          target.spellAffection = { newX: null , newY: null, newAngle: null, newSpeed: 0, timeout: 3000 };
        }else{
          return;
        }
      },
    },
  },

  s4:  {
    name: 'strike',
    isCibled: true,
    isSelf: false,
    isAttack: true,
    isSpell: false,
    isProjectile: false,
    level1: {
      damage: '200',
      cooldown: '5',
      speed: 10,
      assignment: function (spell, character, target){
        var distanceXY = Math.sqrt( Math.pow((target.x - character.x), 2) +  Math.pow((target.y - character.y), 2) );
        if( distanceXY < 300 ){
        target.hp -= this.damage;
        target.spellAffection = { newX: null , newY: null, newAngle: null, newSpeed: 2, timeout: 5000 };
      }

      },
    },
  },

  s5:  {
    name: 'shield',
    isCibled: false,
    isSelf: false,
    isAttack: false,
    isSpell: true,
    isProjectile: false,
    level1: {
      damage: '2',
      cooldown: '2',
      speed: 10,
      assignment: function (spell, character, target){
        character.hp -= this.damage;
        //character.speed -= 5;
        return character;
      },
    },
  },

};
