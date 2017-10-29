module.exports = (app, io, game) => {


  var helpers = require('../game/helpers.js');
  var characterCarac = require('../configs/character.js');

  var globalPlayerId = 0;

  io.on('connection', function (client) {
    console.log('User connected');

    client.on('joinGame', function (character) {
      console.log(character.name + ' joined the game');
      var playerId = globalPlayerId++;

      // Set de la position du joueur
      var initX = helpers.getRandomInt(40, 900);
      var initY = helpers.getRandomInt(40, 500);

      console.log('player id : ' + playerId + ' initX: ' + initX + ' initY : ' + initY);
      client.emit('addCharacter', { id: playerId, name: character.name, type: character.type, isLocal: true, x: initX, y: initY, hp: characterCarac.getCharacterHP() });
      client.broadcast.emit('addCharacter', { id: playerId, name: character.name, type: character.type, isLocal: false, x: initX, y: initY, hp: characterCarac.getCharacterHP() });
    });

    client.on('sync', function(data){
  		//Receive data from clients
  		if(data.character != undefined){
  			//game.syncTank(data.character);
  		}

      //update ball positions
  		game.syncBalls();

      //Broadcast data to clients
  		client.emit('sync', game.getData());
  		client.broadcast.emit('sync', game.getData());

  		//I do the cleanup after sending data, so the clients know
  		//when the tank dies and when the balls explode

      //game.cleanDeadTanks();
  		game.cleanDeadBalls();
  		//counter ++;
  	});

    client.on('shoot', function (ballData) {
      game.addBall(ballData);
    });

  });
};
