const ARENA_MARGIN = 30;

function Character(id, name, type, isLocal, x, y, hp, $arena) {
  this.id = id;
  this.name = name;
  this.type = type;
  this.isLocal = isLocal;
  this.w = 60;
  this.h = 80;
  this.x = x;
  this.y = y;
  this.characterAngle = 0;
  /*
  * Controls
  */
  this.dir = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  this.mx = null;
  this.my = null;

  this.hp = hp;
  this.$arena = $arena;
  this.materialize();
}

Character.prototype = {

  materialize: function () {
    console.log('materialize character : ' + this.name + ' type : ' + this.type + ' x : ' + this.x + ' y : ' + this.y + ' hp : ' + this.hp);

    // Ajout du character
    this.$arena.append('<div id="' + this.id + '" class="character character' + this.type + '"></div>');
    this.$body = $('#' + this.id); // fait référence à un id, ici le character
    this.$body.css('width', this.w);
    this.$body.css('height', this.h);

    // Set de sa position
    this.$body.css('-webkit-transform', 'rotateZ(' + 90 + 'deg)');
    this.$body.css('-moz-transform', 'rotateZ(' + 90 + 'deg)');
    this.$body.css('-o-transform', 'rotateZ(' + 90 + 'deg)');
    this.$body.css('transform', 'rotateZ(' + 90 + 'deg)');

    // Ajout de l'amre
    this.$body.append('<div id="weapon-' + this.id + '" class="weapon"></div>');
    this.$weapon = $('#weapon-' + this.id);

    // Ajout des infos du character
    this.$arena.append('<div id="info-' + this.id + '" class="info"></div>');
    this.$info = $('#info-' + this.id);
    this.$info.append('<div class="label">' + this.name + '</div>');
    this.$info.append('<div class="hp-bar"></div>');

    this.refresh();

    if (this.isLocal) {
      this.setControls();
    };
  },

  refresh: function () {
    this.$body.css('left', this.x + 'px');
    this.$body.css('top', this.y + 'px');

    //var cannonAbsAngle = this.cannonAngle - this.baseAngle;
		this.$body.css('-webkit-transform', 'rotateZ(' + this.characterAngle + 'deg)');
		this.$body.css('-moz-transform', 'rotateZ(' + this.characterAngle + 'deg)');
		this.$body.css('-o-transform', 'rotateZ(' + this.characterAngle + 'deg)');
		this.$body.css('transform', 'rotateZ(' + this.characterAngle + 'deg)');

    this.$info.css('left', (this.x) + 'px');
    this.$info.css('top', (this.y) + 'px');
  },

  setControls: function () {
    var t = this;

    /* Detect both keypress and keyup to allow multiple keys
    and combined directions */
    $(document).keypress(function (e) {
      var k = e.keyCode || e.which;
      switch (k){
        case 122: //W
          t.dir.up = true;
        break;
        case 100: //D
          t.dir.right = true;
        break;
        case 115: //S
          t.dir.down = true;
        break;
        case 113: //A
          t.dir.left = true;
        break;
      }

    }).keyup(function (e) {
      var k = e.keyCode || e.which;
      switch (k){
        case 90: //W
          t.dir.up = false;
        break;
        case 68: //D
          t.dir.right = false;
        break;
        case 83: //S
          t.dir.down = false;
        break;
        case 81: //A
          t.dir.left = false;
        break;
      }
    }).mousemove(function (e) { //Detect mouse for aiming
      t.mx = e.pageX - t.$arena.offset().left;
      t.my = e.pageY - t.$arena.offset().top;
      t.setCharacterAngle();
    }).click(function () {
      //t.shoot();
    });

  },

  move: function () {
    if (this.dead) {
      return;
    }

    var moveX = 0;
    var moveY = 0;

    if (this.dir.up) {
      moveY = -1;
    } else if (this.dir.down) {
      moveY = 1;
    }

    if (this.dir.left) {
      moveX = -1;
    } else if (this.dir.right) {
      moveX = 1;
    }

    //moveX = this.speed * moveX;
    //moveY = this.speed * moveY;

    if (this.x + moveX > (0 + ARENA_MARGIN) && (this.x + moveX) < (this.$arena.width() - ARENA_MARGIN)){
      this.x += moveX;
    }

    if (this.y + moveY > (0 + ARENA_MARGIN) && (this.y + moveY) < (this.$arena.height() - ARENA_MARGIN)){
      this.y += moveY;
    }

    //this.rotateBase();
    this.setCharacterAngle();
    this.refresh();
  },

  setCharacterAngle: function () {
    var char = { x: this.x, y: this.y };
    var deltaX = this.mx - char.x;
    var deltaY = this.my - char.y;
    this.characterAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    this.characterAngle += 90;
  },
};
