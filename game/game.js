var Spell = require('./spell.js');
var helpers = require('../game/helpers.js');
var Character = require('./character.js');
var spellsInfos = require('./config/spells.js');

var WIDTH = 1280;
var HEIGHT = 720;

function Game() {
  SOCKET_LIST = [];  // à voir ?
  CHARACTER_LIST = [];
  SPELL_LIST = [];
  BULLET_LIST = [];
}

Game.prototype = {

  addCharacter: function (characterData) {
    console.log('new player');

    var character = new Character(characterData.type, characterData.name);
    CHARACTER_LIST.push(character);
    //console.log("charachter id "+this.lastPlayerId+' name : '+CHARACTER_LIST[1].name);

    return character;
  },

  addSpell: function (spellData) {
    //console.log('add one spell id : ' + spellData.idSpell + ' owner : ' + spellData.ownerId);
    //console.log('character list size : ' + CHARACTER_LIST.length);
    //console.log('nom : ' + CHARACTER_LIST[spellData.ownerId].name);

    var spell = new Spell(spellData.idSpell, spellData.ownerId, spellData.targetId, spellData.alpha, spellData.x, spellData.y );
    SPELL_LIST.push(spell);
  },

  removeCharacter: function (characterId) {
    CHARACTER_LIST = CHARACTER_LIST.filter(
      function (t) { return t.id != characterId; });
  },

  //Sync character with new data received from a client
  syncCharacter: function (newCharacterData) {
    for(var i = 0, len = CHARACTER_LIST.length; i < len; i++) {
      if (CHARACTER_LIST[i].id == newCharacterData.id) {
        CHARACTER_LIST[i].x = newCharacterData.x;
        CHARACTER_LIST[i].y = newCharacterData.y;
        CHARACTER_LIST[i].characterAngle = newCharacterData.characterAngle;
      }
    };
  },

  //The app has absolute control of the SPELL_LIST and their movement
  syncBullets: function () {
    var self = this;

    for(var i = 0, len = SPELL_LIST.length; i < len; i++) {
      self.detectCollision(SPELL_LIST[i]);
      //Detect when ball is out of bounds
      if (SPELL_LIST[i].x < 0 || SPELL_LIST[i].x > WIDTH || SPELL_LIST[i].y < 0 || SPELL_LIST[i].y > HEIGHT) {
        SPELL_LIST[i].out = true;
      }else {
        SPELL_LIST[i].fly();
      }
    }

  },

  spellRequest: function (spellData) {
    //spellData.idSpell, spellData.ownerId, spellData.targetId, spellData.alpha, spellData.x, spellData.y

    var idSpell = spellData.idSpell;
    var spellInfo = spellsInfos[idSpell];


    var ownerCharacter = null;
    var targetCharacter = null;
    //console.log(' character id : ' + spell.ownerId + ' target id : ' +  spell.targetId);

    for(var i = 0, len = CHARACTER_LIST.length; i < len; i++) {
      if (CHARACTER_LIST[i].id == spell.ownerId) {
        ownerCharacter = CHARACTER_LIST[i];
      }

      if (CHARACTER_LIST[i].id == spell.targetId) {
        //console.log('target find : ' + character.id);
        targetCharacter = CHARACTER_LIST[i];
      }
    }

    spellInfo['level1'].spellAssignments(this, ownerCharacter, targetCharacter);

  },

  //Detect if spell collides with any character
  detectCollision: function (spell) {
    var self = this;
    var ownerCharacter;
    var targetCharacter;

    CHARACTER_LIST.forEach(function (character) {
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

      gameData.CHARACTER_LIST = CHARACTER_LIST;
      gameData.SPELL_LIST = SPELL_LIST;

      return gameData;
    },

    cleanCharacters: function () {
      // Remove debuff
      CHARACTER_LIST.forEach(function(c){
        c.spellAffection = null;
      });

      // Remove dead CHARACTER_LIST
      CHARACTER_LIST = CHARACTER_LIST.filter(function (t) {
        return t.hp > 0;
      });
    },

    cleanSpells: function () {
      SPELL_LIST = SPELL_LIST.filter(function (spell) {
        return !spell.out;
      });
    },
  };

  module.exports = Game;
