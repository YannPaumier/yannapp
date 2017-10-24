
function Character(name, type, x, y, hp, $arena) {
  this.name = name;
  this.type = type;
  this.x = x;
  this.y = y;
  this.hp = hp;
  this.$arena = $arena;
  this.materialize();
}

Character.prototype = {

  materialize: function () {
    console.log('materialize char : ' + this.name + ' type : ' + this.type + ' x : ' + x + ' y : ' + y + ' hp : ' + hp);
    this.$arena.append('<div id="" class="character">');
    this.$arena.append(this.type + this.name);
    this.$arena.append('</div>');
  },

};
