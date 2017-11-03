module.exports = {
  shoot:  {
    name: 'shoot',
    level1: {
      damage: '5',
      cooldown: '',
      cibled: false,
      self: false,
      speed: 10,
      debuff: function (character) {
        character.hp -= this.damage;
        return character;
      },
    },
  },

  s1:  {
    name: 'aim_shoot',
    level1: {
      damage: '20',
      cooldown: '2',
      cibled: false,
      self: false,
      speed: 20,
      debuff: function (character) {
        character.hp -= this.damage;
        return character;
      },
    },
  },

  s2:  {
    name: 'slow',
    level1: {
      damage: '2',
      cooldown: '2',
      cibled: false,
      self: false,
      speed: 10,
      debuff: function (character) {
        character.hp -= this.damage;
        //character.speed -= 5;
        return character;
      },
    },
  },

};
