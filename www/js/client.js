
var game = new Game();
var selectedChar = 1;
var charName = '';

socket.on('addCharacter', function (character) {
  console.log('addCharacter : ' + character.name + ' id : ' + character.id + ' type : ' + character.type + ' isLocal : ' + character.isLocal);
  game.addCharacter(character.id, character.name, character.type, character.isLocal, character.x, character.y, character.hp);
});

socket.on('sync', function (gameServerData) {
  game.receiveData(gameServerData);
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

function joinGame(charName, charType) {
  if (charName != '') {
    $('#prompt').hide();
    socket.emit('joinGame', { name: charName, type: charType });
  }
}
