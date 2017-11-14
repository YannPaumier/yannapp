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
      damage: '20',
      cooldown: '1',
      speed: 10,
      launchAssignment: function (spell, character, target){
        if (character != null){
          character.spellAffection = { idSpell: 's0', newX: null , newY: null, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: null };
        }
      },
      hurtAssignment: function (spell, character, target){
        if( target != null){
          var damage = this.damage;
          target.hp -= damage;
        }
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
      damage: '80',
      cooldown: '3',
      speed: 30,
      launchAssignment: function (spell, character, target){
        if (character != null){
        character.spellAffection = { idSpell: 's1', newX: null , newY: null, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: null };
        }
      },
      hurtAssignment: function (spell, character, target){
        if( target != null){
            target.hp -= this.damage;
        }
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
      launchAssignment: function (spell, character, target){
        if (character != null){
          character.spellAffection = { idSpell: 's2', newX: null , newY: null, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: null };
        }
      },
      hurtAssignment: function (spell, character, target){
      if( target != null){
        target.hp -= this.damage;
        target.spellAffection = { idSpell: 's2', newX: null , newY: null, newAngle: null, newSpeed: 2, cooldown: null, timeout: 5000 };
      }
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
      launchAssignment: function (spell, character, target){
        if( character != null ){
          character.spellAffection = { idSpell: 's6', newX: null , newY: null, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: null };
        }
      },
      hurtAssignment: function (spell, character, target){
        if( target != null && character != null ){
          target.hp -= this.damage;
          var alpha = spell.alpha;
          var speedX = 100 * Math.sin(alpha);
          var speedY = -100 * Math.cos(alpha);
          var newX = character.x + speedX;
          var newY = character.y + speedY;
          target.spellAffection = { idSpell: 's6', newX: newX , newY: newY, newAngle: null, newSpeed: null, cooldown: null, timeout: 0 };
        }
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
      launchAssignment: function (spell, character, target){
          if( target != null && character != null ){
            var newX;
            var newY;
            var distanceXY = Math.sqrt( Math.pow((target.x - character.x), 2) +  Math.pow((target.y - character.y), 2) );

            if( distanceXY < 300 ){
              newX = target.x;
              newY = target.y;
              character.spellAffection = { idSpell: 's3', newX: newX , newY: newY, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: 0 };

              target.hp -= this.damage;
              target.spellAffection = { idSpell: 's3', newX: null , newY: null, newAngle: null, newSpeed: 0, cooldown: null, timeout: 3000 };
            }else{
              return;
            }
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
      damage: '120',
      cooldown: '5',
      speed: 10,
      launchAssignment: function (spell, character, target){
        if( target != null ){
          var distanceXY = Math.sqrt( Math.pow((target.x - character.x), 2) +  Math.pow((target.y - character.y), 2) );
          if( distanceXY < 300 ){
          target.hp -= this.damage;
          target.spellAffection = { idSpell: 's4', newX: null , newY: null, newAngle: null, newSpeed: 2, cooldown: this.cooldown, timeout: 5000 };
        }
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
      cooldown: '10',
      speed: 10,
      launchAssignment: function (spell, character, target){
        character.hp += 200;
        character.spellAffection = { idSpell: 's5', newX: null , newY: null, newAngle: null, newSpeed: null, cooldown: this.cooldown, timeout: null };
        //character.hp -= this.damage;
        //character.speed -= 5;

      },
    },
  },

};
