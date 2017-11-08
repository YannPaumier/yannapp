function Spell(id, idSpell, ownerId, $arena, x, y) {
// spellId - pour récupérer l'animation
// characterId

this.id = id;
this.idSpell = idSpell;
this.ownerId = ownerId;
this.$arena = $arena;
this.x = x;
this.y = y;

this.exploding = false;

this.materialize();
}

Spell.prototype = {

materialize: function(){
	this.$arena.append('<div id="spell' + this.id + '" class="spell-' + this.idSpell + '" style="left:' + this.x + 'px"></div>');
	this.$body = $('#spell' + this.id);
	this.$body.css('left', this.x + 'px');
	this.$body.css('top', this.y + 'px');
},

explode: function(){
	this.$arena.append('<div id="expl' + this.id + '" class="spell-' + this.idSpell + '-explosion" style="left:' + this.x + 'px"></div>');
	var $expl = $('#expl' + this.id);
	$expl.css('left', this.x + 'px');
	$expl.css('top', this.y + 'px');
	setTimeout( function(){
		$expl.addClass('expand');
	}, 1);
	setTimeout( function(){
		//$expl.remove();
	}, 1000);
},
}
