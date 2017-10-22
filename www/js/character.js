
function Character( name, type, $arena ){
  this.name = name;
  this.type = type;
  this.$arena = $arena;
  this.materialize();
}

Character.prototype = {

  materialize: function(){
    console.log('materialize char : '+this.name+' type : '+this.type );
		this.$arena.append('<div id="" class="character">');
    this.$arena.append(this.type+this.name);
    this.$arena.append('</div>');
	},

}
