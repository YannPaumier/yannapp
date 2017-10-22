 const socket = io('http://localhost:3000/');
var game = new Game();
var selectedChar = 1;
var charName = '';

$(document).ready( function(){

  game.addCharacter();

  $('#join').click( function(){
		characterName = $('#char-name').val();
		joinGame(charName, selectedChar, socket);
	});

  $('ul.char-selection li').click( function(){
		$('.char-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedChar = $(this).data('char');
	});

});

function joinGame(charName, tankType, socket){
	if(tankName != ''){
		$('#prompt').hide();
		socket.emit('joinGame', {name: tankName, type: tankType});
	}
}
