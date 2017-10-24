
function Game() {
  this.$arena = $('#arena');

  //this.character = []; //Tanks (other than the local tank)
}

Game.prototype = {

  addCharacter: function (name, type, x, y, hp) {
    var t = new Character(name, type, x, y, hp, this.$arena);
  },

};
