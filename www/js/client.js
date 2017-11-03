var game = new Game();
var selectedChar = 1;
var characterName = '';
var characterId = '';

socket.on('addCharacter', function (characterData) {
  console.log('New player : ' + characterData.character.name);
  if (characterData.isLocal) {
    characterId = characterData.character.id;
    characterName = characterData.character.name;
  };

  game.addCharacter(characterData);
});

socket.on('sync', function (gameServerData) {
  game.receiveData(gameServerData);
});

socket.on('removeCharacter', function (characterId) {
  game.removeCharacter(characterId);
});

$(document).ready(function () {

  $('#join').click(function () {
    characterName = $('#char-name').val();
    console.log('join clicked with char name : ' + characterName + ' and selectedChar : ' + selectedChar);
    joinGame(characterName, selectedChar);
  });

  $('ul.char-selection li').click(function () {
    $('.char-selection li').removeClass('selected');
    $(this).addClass('selected');
    selectedChar = $(this).data('char');
  });

});

$(window).on('beforeunload', function () {
  socket.emit('leaveGame', characterName, characterId);
});

function joinGame(charName, charType) {
  if (charName != '') {
    $('#prompt').hide();
    socket.emit('joinGame', { name: charName, type: charType });
  }
}
