
function Game(){
  this.$arena = $('#arena');
	//this.character = []; //Tanks (other than the local tank)
}

Game.prototype = {

  addCharacter: function(){
		var t = new Character( this.$arena );
	},

}
