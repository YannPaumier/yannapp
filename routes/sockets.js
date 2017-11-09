module.exports = (app, io, game) => {

  io.on('connection', function (client) {
    console.log('User connected');

    client.on('joinGame', function (character) {

      character = game.addCharacter({ name: character.name, type: character.type });
      //console.log('character hp speed : ' + character.hp + character.speed);
      client.emit('addCharacter', { isLocal: true, character });
      client.broadcast.emit('addCharacter', { isLocal: false, character });

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
      game.cleanCharacters();
      game.cleanSpells();

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
