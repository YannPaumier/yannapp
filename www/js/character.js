
function Character(name, type, x, y, hp, $arena) {
  this.name = name;
  this.type = type;
  this.w = 60;
	this.h = 80;
  this.x = x;
  this.y = y;
  this.hp = hp;
  this.$arena = $arena;
  this.materialize();
}

Character.prototype = {

  materialize: function () {
    console.log('materialize char : ' + this.name + ' type : ' + this.type + ' x : ' + this.x + ' y : ' + this.y + ' hp : ' + this.hp);

    this.$arena.append('<div id="' + this.id + '" class="character' + this.type + '"></div>');
		this.$body = $('#' + this.id); // fait référence à un id, ici le character
		this.$body.css('width', this.w);
		this.$body.css('height', this.h);

		this.$body.css('-webkit-transform', 'rotateZ(' + 60 + 'deg)');
		this.$body.css('-moz-transform', 'rotateZ(' + 60 + 'deg)');
		this.$body.css('-o-transform', 'rotateZ(' + 60 + 'deg)');
		this.$body.css('transform', 'rotateZ(' + 60 + 'deg)');

		this.$body.append('<div id="cannon-' + this.id + '" class="weapon"></div>');
		this.$cannon = $('#cannon-' + this.id);

		this.$arena.append('<div id="info-' + this.id + '" class="info"></div>');
		this.$info = $('#info-' + this.id);
		this.$info.append('<div class="label">' + this.name + '</div>');
		this.$info.append('<div class="hp-bar"></div>');

  },

};
