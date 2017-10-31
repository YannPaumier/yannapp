var Ball = require('./ball.js');
var WIDTH = 1100;
var HEIGHT = 580;

function Game() {
  this.characters = [];
  this.balls = [];
  this.lastBallId = 0;
}

Game.prototype = {

    addCharacter: function (character) {
      this.characters.push(character);
    },

    addBall: function (ballData) {
      //console.log('add one ball : x : ' + ballData.x + ', y : ' + ballData.y);

      this.increaseLastBallId();
      var ball = new Ball(this.lastBallId, ballData.ownerId, ballData.alpha, ballData.x, ballData.y );
      this.balls.push(ball);
    },

    removeCharacter: function (characterId) {
        this.characters = this.characters.filter(
        function (t) { return t.id != characterId; });
      },

    //Sync tank with new data received from a client
    syncCharacter: function (newCharacterData) {
      this.characters.forEach(function (character) {
        if (character.id == newCharacterData.id) {
          character.x = newCharacterData.x;
          character.y = newCharacterData.y;
          character.characterAngle = newCharacterData.characterAngle;
        }
      });
    },

    //The app has absolute control of the balls and their movement
    syncBalls: function () {
      var self = this;

      //Detect when ball is out of bounds
      this.balls.forEach(function (ball) {
        self.detectCollision(ball);
        if (ball.x < 0 || ball.x > WIDTH || ball.y < 0 || ball.y > HEIGHT) {
          ball.out = true;
        }else {
          ball.fly();
        }
      });
    },

    //Detect if ball collides with any tank
    detectCollision: function (ball) {
        var self = this;
        this.characters.forEach(function (character) {

          if (character.id != ball.ownerId
          && Math.abs(character.x - ball.x) < 30
          && Math.abs(character.y - ball.y) < 30) {
            //Hit character
            self.hurtCharacter(character);
            ball.out = true;
            ball.exploding = true;
          }
        });
      },

    hurtCharacter: function (character) {
        character.hp -= 20;
      },

    getData: function () {
      var gameData = {};

      gameData.characters = this.characters;
      gameData.balls = this.balls;

      return gameData;
    },

    cleanDeadTanks: function () {
      this.characters = this.characters.filter(function (t) {
        return t.hp > 0;
      });
    },

    cleanDeadBalls: function () {
      this.balls = this.balls.filter(function (ball) {
        return !ball.out;
      });
    },

    increaseLastBallId: function () {
      this.lastBallId++;
      if (this.lastBallId > 1000) {
        this.lastBallId = 0;
      }
    },
  };

module.exports = Game;
