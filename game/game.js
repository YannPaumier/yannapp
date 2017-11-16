var Spell = require('./spell.js');
var Character = require('./character.js');
var spellsInfos = require('./config/spells.js');

var WIDTH = 1280;
var HEIGHT = 720;

function Game() {
  this.SOCKET_LIST = [];  // à voir ?
  this.CHARACTER_LIST = [];
  this.SPELL_LIST = [];
  this.BULLET_LIST = [];

}

Game.prototype = {

  addCharacter: function (characterData) {
    console.log('new player');

    var character = new Character(characterData.type, characterData.name);
    this.CHARACTER_LIST.push(character);
    //console.log("charachter id "+this.lastPlayerId+' name : '+this.CHARACTER_LIST[1].name);

    return character;
  },

  addSpell: function (spellData) {
    //console.log('add one spell id : ' + spellData.idSpell + ' owner : ' + spellData.ownerId);
    //console.log('character list size : ' + this.CHARACTER_LIST.length);
    //console.log('nom : ' + this.CHARACTER_LIST[spellData.ownerId].name);

    var spell = new Spell(spellData.idSpell, spellData.ownerId, spellData.targetId, spellData.alpha, spellData.x, spellData.y );
    this.SPELL_LIST.push(spell);
  },

  removeCharacter: function (characterId) {
    this.CHARACTER_LIST = this.CHARACTER_LIST.filter(
      function (t) { return t.id != characterId; });
  },

  //Sync character with new data received from a client
  syncCharacter: function (newCharacterData) {
    this.CHARACTER_LIST.forEach(function (character) {
      if (character.id == newCharacterData.id) {
        character.x = newCharacterData.x;
        character.y = newCharacterData.y;
        character.isMoving = newCharacterData.isMoving;
        character.characterAngle = newCharacterData.characterAngle;
      }
    });
  },

  //The app has absolute control of the SPELL_LIST and their movement
  syncSpells: function () {
    var self = this;
    this.SPELL_LIST.forEach(function (spell) {

      // Si CAC
      if (spell.idSpell == 0) {
        console.log('CAC DETECT ON SERVEUR');
        self.attack(spell);
        spell.out = true;
      }else {   // Sinon
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

  attack: function (spell) {
    this.CHARACTER_LIST.forEach(function (character) {
      if(character.id == spell.targetId){
        character.hp -= 100;
      }
    });
  },

  affectSpells: function(spell){
    var self = this;
    var ownerCharacter = null;
    var targetCharacter = null;
    //console.log(' character id : ' + spell.ownerId + ' target id : ' +  spell.targetId);
    this.CHARACTER_LIST.forEach(function (character) {
      if (character.id == spell.ownerId) {
        ownerCharacter = character;
      }

      if (character.id == spell.targetId) {
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

    this.CHARACTER_LIST.forEach(function (character) {

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

      gameData.CHARACTER_LIST = this.CHARACTER_LIST;
      gameData.SPELL_LIST = this.SPELL_LIST;

      return gameData;
    },

    cleanCharacters: function () {
      // Remove debuff
      this.CHARACTER_LIST.forEach(function(c){
        c.spellAffection = null;
      });

      // Remove dead CHARACTER_LIST
      this.CHARACTER_LIST = this.CHARACTER_LIST.filter(function (t) {
        return t.hp > 0;
      });
    },

    cleanSpells: function () {
      this.SPELL_LIST = this.SPELL_LIST.filter(function (spell) {
        return !spell.out;
      });
    },
  };

  module.exports = Game;
