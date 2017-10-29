var INTERVAL = 50;

function Game() {
  this.characters = []; //Characters (other than the local character)
  this.$arena = $('#arena');

  var g = this;
  setInterval(function () { // Appel mailoop en boucle
    g.mainLoop();
  }, INTERVAL);
}

Game.prototype = {

  addCharacter: function (id, name, type, isLocal, x, y, hp) {
    var c = new Character(id, name, type, isLocal, x, y, hp, this.$arena);
    if (isLocal) {
      this.localCharacter = c;
    }else {
      this.characters.push(c);
    }
  },

  mainLoop: function () {
    if (this.localCharacter != undefined) {
      //send data to server about local tank
      this.sendData();

      //move local tank
      this.localCharacter.move();
    }
  },

  sendData: function () {
    //Send local data to server
    var gameData = {};

    //Send character data
    var c = {
      id: this.localCharacter.id,
      x: this.localCharacter.x,
      y: this.localCharacter.y,
      baseAngle: this.localCharacter.baseAngle,
      cannonAngle: this.localCharacter.cannonAngle,
    };
    gameData.character = c;

    //Client game does not send any info about balls,
    //the server controls that part
    socket.emit('sync', gameData);
  },

  receiveData: function (serverData) {
    var game = this;

    //Render balls
		game.$arena.find('.cannon-ball').remove();

		serverData.balls.forEach( function(serverBall) {
      //console.log('new ball : '+serverBall.y);
			var b = new Weapon(serverBall.id, serverBall.ownerId, game.$arena, serverBall.x, serverBall.y);
			//b.exploding = serverBall.exploding;
			if(b.exploding){
				b.explode();
			}
		});
  },
};
