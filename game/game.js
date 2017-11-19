var Spell = require('./spell.js');
var Bullet = require('./bullet.js');
var helpers = require('../game/helpers.js');
var Character = require('./character.js');
var spellsInfos = require('./config/spells.js');

var WIDTH = 1280;
var HEIGHT = 720;

function Game() {
  this.CHARACTER_LIST = [];
  //this.SPELL_LIST = [];
  this.BULLET_LIST = [];
}

Game.prototype = {

  addCharacter: function (characterData) {
    console.log('new player');

    var character = new Character(characterData.type, characterData.name);
    this.CHARACTER_LIST.push(character);
    //console.log("charachter id "+this.lastPlayerId+' name : '+CHARACTER_LIST[1].name);

    return character;
  },

  spellRequest: function (spellData) {
    //spellData.idSpell, spellData.ownerId, spellData.targetId, spellData.alpha, spellData.x, spellData.y

    var idSpell = spellData.idSpell;
    var spellInfo = spellsInfos[idSpell];


    var ownerCharacter = null;
    var targetCharacter = null;
    //console.log(' character id : ' + spell.ownerId + ' target id : ' +  spell.targetId);

    for(var i = 0, len = this.CHARACTER_LIST.length; i < len; i++) {
      if (this.CHARACTER_LIST[i].id == spellData.ownerId) {
        ownerCharacter = this.CHARACTER_LIST[i];
      }

      if (this.CHARACTER_LIST[i].id == spellData.targetId) {
        //console.log('target find : ' + character.id);
        targetCharacter = this.CHARACTER_LIST[i];
      }
    }

    spellInfo['level1'].spellAssignments(this, ownerCharacter, targetCharacter);
    if ( spellInfo.isProjectile ) {
      this.addBullet( spellData );
    }
  },

  addBullet: function (spellData) {
    console.log('add one spell id : ' + spellData.idSpell + ' owner : ' + spellData.ownerId);

    var bullet = new Bullet( spellData.idSpell, spellData.ownerId, spellData.alpha, spellData.x, spellData.y );
    this.BULLET_LIST.push(bullet);
  },

  removeCharacter: function (characterId) {
    this.CHARACTER_LIST = this.CHARACTER_LIST.filter(
      function (t) { return t.id != characterId; });
  },

  //Sync character with new data received from a client
  syncCharacter: function (newCharacterData) {
    for(var i = 0, len = this.CHARACTER_LIST.length; i < len; i++) {
      if (this.CHARACTER_LIST[i].id == newCharacterData.id) {
        this.CHARACTER_LIST[i].x = newCharacterData.x;
        this.CHARACTER_LIST[i].y = newCharacterData.y;
        this.CHARACTER_LIST[i].characterAngle = newCharacterData.characterAngle;
      }
    };
  },

  //The app has absolute control of the SPELL_LIST and their movement
  syncBullets: function () {
    var self = this;

    for(var i = 0, len = this.BULLET_LIST.length; i < len; i++) {
      self.detectCollision(this.BULLET_LIST[i]);
      //Detect when ball is out of bounds
      if (this.BULLET_LIST[i].x < 0 || this.BULLET_LIST[i].x > WIDTH || this.BULLET_LIST[i].y < 0 || this.BULLET_LIST[i].y > HEIGHT) {
        this.BULLET_LIST[i].out = true;
      }else {
        this.BULLET_LIST[i].fly();
      }
    }
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

  },

  getData: function () {
    var gameData = {};

    gameData.CHARACTER_LIST = this.CHARACTER_LIST;
    gameData.BULLET_LIST = this.BULLET_LIST;

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

  cleanBullets: function () {
    this.BULLET_LIST = this.BULLET_LIST.filter(function (spell) {
      return !spell.out;
    });
  },
};

module.exports = Game;
