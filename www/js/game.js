
function Game(){
  this.$arena = $('#arena');
	//this.character = []; //Tanks (other than the local tank)
}

Game.prototype = {

  addCharacter: function(name, type){
		var t = new Character( name, type, this.$arena );
	},

}
