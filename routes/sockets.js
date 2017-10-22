module.exports = (app, io) => {

  io.on('connection', function(client) {
  console.log('User connected');

	client.on('joinGame', function(character){
		console.log(character.name + ' joined the game');

		client.emit('addCharacter', {name: character.name, type: character.type});
		client.broadcast.emit('addCharacter', {name: character.name, type: character.type});
	});

});
};
