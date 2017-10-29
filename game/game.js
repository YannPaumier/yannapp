var Ball = require('./ball.js');
var WIDTH = 1100;
var HEIGHT = 580;

function Game(){
  this.balls = [];
  this.lastBallId = 0;
}

Game.prototype = {

  addBall: function(ballData){
    console.log('add one ball : x : ' + ballData.x + ', y : ' + ballData.y);

    this.increaseLastBallId();
    var ball = new Ball(this.lastBallId, ballData.ownerId, ballData.alpha, ballData.x, ballData.y );
		this.balls.push(ball);
	},

  //The app has absolute control of the balls and their movement
	syncBalls: function(){
		var self = this;
		//Detect when ball is out of bounds
		this.balls.forEach( function(ball){
			//self.detectCollision(ball);

			if(ball.x < 0 || ball.x > WIDTH
				|| ball.y < 0 || ball.y > HEIGHT){
				ball.out = true;
			}else{
				ball.fly();
			}
		});
	},

  getData: function(){
		var gameData = {};

		//gameData.tanks = this.tanks;
		gameData.balls = this.balls;

		return gameData;
	},

  cleanDeadBalls: function(){
  		this.balls = this.balls.filter(function(ball){
  			return !ball.out;
  		});
  },
  increaseLastBallId: function(){
		this.lastBallId ++;
		if(this.lastBallId > 1000){
			this.lastBallId = 0;
		}
	},

}

module.exports = Game;
