var Spell = require('./spell.js');
var Character = require('./character.js');
var spellsInfos = require('./config/spells.js');

var WIDTH = 1280;
var HEIGHT = 720;

function Game() {
  this.characters = [];
  this.spells = [];
  this.lastSpellId = 0;
  this.lastPlayerId = 0;
}

Game.prototype = {

  addCharacter: function (characterData) {
    console.log('new character');

    this.lastPlayerId++;

    if (this.lastPlayerId > 1000) {
      this.lastPlayerId = 0;
    }

    var character = new Character(this.lastPlayerId, characterData.type, characterData.name);
    this.characters.push(character);
    return character;
  },

  addSpell: function (spellData) {
    console.log('add one spell id : ' + spellData.idSpell + ' owner : ' + spellData.ownerId);

    this.lastSpellId++;
    if (this.lastSpellId > 1000) {
      this.lastSpellId = 0;
    }

    var spell = new Spell(this.lastSpellId, spellData.idSpell, spellData.ownerId, spellData.alpha, spellData.x, spellData.y );
    this.spells.push(spell);
  },

  removeCharacter: function (characterId) {
      this.characters = this.characters.filter(
      function (t) { return t.id != characterId; });
    },

  //Sync character with new data received from a client
  syncCharacter: function (newCharacterData) {
      this.characters.forEach(function (character) {
        if (character.id == newCharacterData.id) {
          character.x = newCharacterData.x;
          character.y = newCharacterData.y;
          character.characterAngle = newCharacterData.characterAngle;
        }
      });
    },

  //The app has absolute control of the spells and their movement
  syncSpells: function () {
    var self = this;

      //Detect when spell is out of bounds
      this.spells.forEach(function (spell) {
        self.detectCollision(spell);
        if (spell.x < 0 || spell.x > WIDTH || spell.y < 0 || spell.y > HEIGHT) {
          spell.out = true;
        }else {
          spell.fly();
        }
      });
    },

  //Detect if spell collides with any character
  detectCollision: function (spell) {
    var self = this;

      this.characters.forEach(function (character) {

          if (character.id != spell.ownerId && Math.abs(character.x - spell.x) < 30 && Math.abs(character.y - spell.y) < 30) {
            //Hit character
            self.hurtCharacter(character, spell);
            spell.out = true;
            spell.exploding = true;
          }
        });

            // Detect collisions with obstacles
            var obst1 = { x: 250, y: (HEIGHT) - 500, width: 150, height: 300 };
            var obst2 = { x: 880, y: (HEIGHT) - 500, width: 150, height: 300 };
            var collision = false;
            if (obst1.x < spell.x  &&
          obst1.x + obst1.width > spell.x &&
          obst1.y < (HEIGHT - spell.y) &&
          obst1.height + obst1.y > (HEIGHT - spell.y)) {
              spell.out = true;
              spell.exploding = true;
            }

            if (obst2.x < spell.x &&
            obst2.x + obst2.width > spell.x &&
            obst2.y < (HEIGHT - spell.y) &&
            obst2.height + obst2.y > (HEIGHT - spell.y)) {
              spell.out = true;
              spell.exploding = true;
            }

          },

  hurtCharacter: function (character, spell) {
      var idSpell = spell.idSpell;
      var spellInfo = spellsInfos[idSpell];
      character = spellInfo['level1'].debuff(character);

    //  character.hp -= damage;
    },

  getData: function () {
    var gameData = {};

    gameData.characters = this.characters;
    gameData.spells = this.spells;

    return gameData;
  },

  cleanDeadCharacters: function () {
    this.characters = this.characters.filter(function (t) {
      return t.hp > 0;
    });
  },

  cleanDeadspells: function () {
    this.spells = this.spells.filter(function (spell) {
      return !spell.out;
    });
  },
};

module.exports = Game;
