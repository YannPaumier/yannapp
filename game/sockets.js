module.exports = (app, io, game) => {

  io.on('connection', function (client) {
    console.log('New user connected');

    client.on('joinGame', function (character) {
      character = game.addCharacter({ name: character.name, type: character.type });
      client.id = character.id;
      //console.log('character hp speed : ' + character.hp + character.speed);
      client.emit('addCharacter', { character, isLocal: true });
      client.broadcast.emit('addCharacter', { character, isLocal: false });
    });

    client.on('spellRequest', function (spellData) {
      game.addSpell(spellData);
    });

    client.on('sync', function (data) {

      //Receive data from clients
      if (data.character != undefined) {
        game.syncCharacter(data.character);
      }

      //update ball positions
      game.syncBullets();

      //Broadcast data to clients
      client.emit('sync', game.getData());
      client.broadcast.emit('sync', game.getData());

      //Cleanup after sending data, so the clients know
      //when the character dies and when the balls explode
      game.cleanCharacters();
      game.cleanSpells();

      //counter ++;
    });

    /*
    * Gestion des deconnexions
    */
    client.on('disconnect', function() {
      console.log('socket id left the game : ' + client.id);
      game.removeCharacter(client.id);
    })

    client.on('leaveGame', function (characterName, characterId) {
      console.log(characterName + ' has left the game, id : ' + characterId);
      game.removeCharacter(characterId);
      client.broadcast.emit('removeCharacter', characterId);
    });

  });
};
