module.exports = (app, io) => {
  var game = require('../game/game.js');
  var globalPlayerId = 0;

  io.on('connection', function (client) {
    console.log('User connected');

    client.on('joinGame', function (character) {
      console.log(character.name + ' joined the game');
      var playerId = globalPlayerId++;

      // Set de la position du joueur
      var initX = game.getRandomInt(40, 900);
      var initY = game.getRandomInt(40, 500);

      console.log('player id : ' + playerId + 'initX: ' + initX + ' initY : ' + initY);
      client.emit('addCharacter', { id: playerId, name: character.name, type: character.type, x: initX, y: initY, hp: game.getCharacterHP() });
      client.broadcast.emit('addCharacter', { id: playerId, name: character.name, type: character.type, x: initX, y: initY, hp: game.getCharacterHP() });
    });

  });
};
