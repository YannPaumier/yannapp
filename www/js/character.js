
function Character( $arena ){
  this.$arena = $arena;
  this.materialize();
}

Character.prototype = {

  materialize: function(){
    console.log('char : '+this.$arena );
		this.$arena.append('<div id="" class="charcater">Nouveau personnage</div>');
	},

}
