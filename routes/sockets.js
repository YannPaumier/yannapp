module.exports = (app, io, game) => {

  var helpers = require('../game/helpers.js');

  var globalPlayerId = 0;

  io.on('connection', function (client) {
    console.log('User connected');

    client.on('joinGame', function (character) {
      console.log(character.name + ' joined the game');
      var playerId = globalPlayerId++;

      // Set de la position du joueur
      if (helpers.isEven(playerId))  {
        var initX = helpers.getRandomInt(30, 230);
        var initY = helpers.getRandomInt(200, 500);
      }else {
        var initX = helpers.getRandomInt(1020, 1220);
        var initY = helpers.getRandomInt(200, 500);
      }

      // Récupération des infos de la classe
      var infos = helpers.getCharacterInfos(character.type);

      game.addCharacter({ id: playerId, name: character.name, type: character.type, hp: infos.stats.vitality });

      //console.log('player id : ' + playerId + ' initX: ' + initX + ' initY : ' + initY);
      client.emit('addCharacter', { id: playerId, name: character.name, type: character.type, isLocal: true, x: initX, y: initY, hp: infos.stats.vitality, speed: infos.stats.speed });
      client.broadcast.emit('addCharacter', { id: playerId, name: character.name, type: character.type, isLocal: false, x: initX, y: initY, hp: infos.stats.vitality, speed: infos.stats.speed });

    });

    client.on('sync', function (data) {
      //Receive data from clients
      if (data.character != undefined) {
        game.syncCharacter(data.character);
      }

      //update ball positions
      game.syncSpells();

      //Broadcast data to clients
      client.emit('sync', game.getData());
      client.broadcast.emit('sync', game.getData());

      //Cleanup after sending data, so the clients know
      //when the character dies and when the balls explode
      game.cleanDeadCharacters();
      game.cleanDeadspells();

      //counter ++;
    });

    client.on('spell', function (spellData) {
      game.addSpell(spellData);
    });

    client.on('leaveGame', function (characterName, characterId) {
      console.log(characterName + ' has left the game, id : ' + characterId);
      game.removeCharacter(characterId);
      client.broadcast.emit('removeCharacter', characterId);
    });

  });
};
