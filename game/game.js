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

    var spell = new Spell(this.lastSpellId, spellData.idSpell, spellData.ownerId, spellData.targetId, spellData.alpha, spellData.x, spellData.y );

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
        character.isMoving = newCharacterData.isMoving;
        character.characterAngle = newCharacterData.characterAngle;
      }
    });
  },

    //The app has absolute control of the spells and their movement
    syncSpells: function () {
      var self = this;
      this.spells.forEach(function (spell) {

        // Si CAC
        if ( spell.idSpell == 0 ){
          console.log('CAC DETECT ON SERVEUR');
          self.attack(spell);
          spell.out = true;
        }else{   // Sinon
          // affect spells
          self.affectSpells(spell);

          // Detect collision
          self.detectCollision(spell);

          //Detect when spell is out of bounds
          if (spell.x < 0 || spell.x > WIDTH || spell.y < 0 || spell.y > HEIGHT) {
            spell.out = true;
          }else {
            spell.fly();
        }
      }
      });
    },

    attack: function (spell){
      this.characters.forEach(function (character) {
        if( character.id == spell.targetId ){
          character.hp -= 100;
        }
      });
    },

    affectSpells: function(spell){
      var self = this;
      var ownerCharacter = null;
      var targetCharacter = null;
      //console.log(' character id : ' + spell.ownerId + ' target id : ' +  spell.targetId);
      this.characters.forEach(function (character) {
        if( character.id == spell.ownerId ){
          ownerCharacter = character;
        }
        if( character.id == spell.targetId ){
          //console.log('target find : ' + character.id);
          targetCharacter = character;
        }
      });

      spell.affectSpell(ownerCharacter, targetCharacter);

    },

    //Detect if spell collides with any character
    detectCollision: function (spell) {
      var self = this;
      var ownerCharacter;
      var targetCharacter;

      this.characters.forEach(function (character) {

        if (character.id != spell.ownerId && Math.abs(character.x - spell.x) < 40 && Math.abs(character.y - spell.y) < 40) {
          //Hit character
            spell.hurtCharacter(spell, null, targetCharacter);
        }
      });



      // Detect collisions with obstacles
      var obst1 = { x: 240, y: (HEIGHT) - 459, width: 216, height: 259 };
      var obst2 = { x: 800, y: (HEIGHT) - 459, width: 216, height: 259 };
      var collision = false;
      if (obst1.x < spell.x - 20 &&
        obst1.x + obst1.width > spell.x + 20 &&
        obst1.y < (HEIGHT - spell.y) - 40 &&
        obst1.height + obst1.y > (HEIGHT - spell.y) + 40 ) {
          spell.out = true;
          spell.exploding = true;
        }

        if (obst2.x < spell.x - 20 &&
          obst2.x + obst2.width > spell.x + 20 &&
          obst2.y < (HEIGHT - spell.y) - 40 &&
          obst2.height + obst2.y > (HEIGHT - spell.y) + 40 ) {
            spell.out = true;
            spell.exploding = true;
          }

        },

        getData: function () {
          var gameData = {};

          gameData.characters = this.characters;
          gameData.spells = this.spells;

          return gameData;
        },

        cleanCharacters: function () {
          // Remove debuff
          this.characters.forEach(function(c){
            c.spellAffection = null;
          });

          // Remove dead characters
          this.characters = this.characters.filter(function (t) {
            return t.hp > 0;
          });
        },

        cleanSpells: function () {
          this.spells = this.spells.filter(function (spell) {
            return !spell.out;
          });
        },
      };

      module.exports = Game;
