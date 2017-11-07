const ARENA_MARGIN = 30;

function Character(characterData, isLocal, $arena) {
  this.$arena = $arena;

  /*
  * Character infos
  */
  this.id = characterData.id;
  this.name = characterData.name;
  this.type = characterData.type;
  this.initHp = characterData.hp;
  this.hp = characterData.hp;
  this.isLocal = isLocal;
  this.speed = characterData.speed;
  this.w = 100;
  this.h = 100;

  this.dead = false;
  this.isMoving = false;
  this.isAttacking = false;
  this.isSpelling = false;

  /*
  * Position
  */
  this.x = characterData.x;
  this.y = characterData.y;
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
  this.targetId = null;

  /*
  * spells
  */
  this.spells = characterData.spells;

  this.globalcd = false;
  this.cds = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    a: false,
    e: false,
    r: false,
    f: false,
  };

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

    // Set pointer on other characters
    $('.character').not('#' + this.id).css('cursor', 'crosshair');

    // Set de sa position
    /*
    this.$body.css('-webkit-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('-moz-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('-o-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('transform', 'rotateZ(' + this.characterAngle + 'deg)');
    */

    // Ajout des infos du character
    this.$arena.append('<div id="info-' + this.id + '" class="info"></div>');
    this.$info = $('#info-' + this.id);
    this.$info.append('<div class="label">' + this.name + '</div>');
    this.$info.append('<div class="hp-bar">' + this.hp + '</div>');

    this.refresh();

    if (this.isLocal) {
      this.setControls();
    };

  },

  refresh: function () {
    this.$body.css('left', this.x - (this.w / 2) + 'px');
    this.$body.css('top', this.y - (this.h / 2)  + 'px');

    this.anime();
    /*
    this.$body.css('-webkit-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('-moz-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('-o-transform', 'rotateZ(' + this.characterAngle + 'deg)');
    this.$body.css('transform', 'rotateZ(' + this.characterAngle + 'deg)');
    */

    this.$info.css('left', (this.x) + 'px');
    this.$info.css('top', (this.y) + 'px');

    this.$info.find('.hp-bar').css('width', (this.hp * 100) / this.initHp + 'px');
    this.$info.find('.hp-bar').css('background-color', getGreenToRed((this.hp * 100) / this.initHp));
    this.$info.find('.hp-bar').text(this.hp);
  },

  setControls: function () {
    var t = this;

    /* Detect both keypress and keyup to allow multiple keys
    and combined directions */
    $(document).keypress(function (e) {

      var k = e.keyCode || e.which;

      switch (k){
        case 122: //Z
          t.dir.up = true;
        break;
        case 100: //D
          t.dir.right = true;
        break;
        case 115: //S
          t.dir.down = true;
        break;
        case 113: //Q
          t.dir.left = true;
        break;
        case 38://1
        case 49: //1
          t.spell('1');
        break;
        case 233://2
        case 50: //2
          t.spell('2');
        break;
        case 34://3
        case 51: //3
          t.spell('3');
        break;
        case 39://4
        case 52: //4
          t.spell('4');
        break;
        case 40: //5
        case 53: //5
          t.spell('5');
        break;
        case 70: //r
        case 102: //r
          t.spell('6');
        break;
        case 114://f
        case 82: //f
          t.spell('7');
        break;
      }

    }).keyup(function (e) {
      var k = e.keyCode || e.which;
      switch (k){
        case 90: //Z
          t.dir.up = false;
        break;
        case 68: //D
          t.dir.right = false;
        break;
        case 83: //S
          t.dir.down = false;
        break;
        case 81: //Q
          t.dir.left = false;
        break;
      }
    }).mousemove(function (e) { //Detect mouse for aiming
      t.targetId = e.target.id;
      t.mx = e.pageX - t.$arena.offset().left;
      t.my = e.pageY - t.$arena.offset().top;
      t.setCharacterAngle();
    }).click(function () {
      t.spell('0');
    });

  },

  move: function () {
    if (this.dead) {
      return;
    }

    /*
    * Gestion des déplaceemnts
    */

    // Indique si le joueur est en déplacement
    if (this.dir.up || this.dir.down || this.dir.left || this.dir.right) {
      this.isMoving = true;
    }else {
      this.isMoving = false;
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

    // Gestion des diagonales
    if (moveX != 0 && moveY != 0) {
      moveX =  Math.sin(45) * this.speed * moveX;
      moveY =  Math.sin(45) * this.speed * moveY;
    }else {
      moveX = this.speed * moveX;
      moveY = this.speed * moveY;
    }

    /*
    * Detection des collisions
    */
    var collisionX = false;
    var collisionY = false;
    var collision = false;

    var obst1 = { x: 240, y: (this.$arena.height()) - 459, width: 216, height: 259 };
    var obst2 = { x: 800, y: (this.$arena.height()) - 459, width: 216, height: 259 };

    if (obst1.x < this.x + 10 + moveX &&
       obst1.x + obst1.width > (this.x + moveX) - 10 &&
       obst1.y < (this.$arena.height()) - (this.y + moveY)  - 20 &&
       obst1.height + obst1.y > (this.$arena.height()) - (this.y + moveY) + 20 ) {
      collision = true;
    }

    if (obst2.x < this.x + 10 + moveX &&
       obst2.x + obst2.width > (this.x + moveX) - 10 &&
       obst2.y < (this.$arena.height()) - (this.y + moveY) - 20 &&
       obst2.height + obst2.y > (this.$arena.height()) - (this.y + moveY) + 20) {
      collision = true;
    }

    if (!collision && this.x + moveX > (0 + ARENA_MARGIN) && (this.x + moveX) < (this.$arena.width() - ARENA_MARGIN)) {
      this.x += moveX;
    }

    if (!collision && this.y + moveY > (0 + ARENA_MARGIN) && (this.y + moveY) < (this.$arena.height() - ARENA_MARGIN)) {
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

  anime: function () {

    char = this;
    //char.$body.css('background-image', '');
      if( -45 <= char.characterAngle && char.characterAngle <= 45){
        if (this.isMoving)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-back-walk.gif');
        if (this.isAttacking)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-back-attack.gif');
        if( !this.isMoving && !this.isAttacking && !this.isSpelling)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-back-stand.png');
      }
      else if( 45 <= char.characterAngle && char.characterAngle <= 135){
        if (this.isMoving)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-right-walk.gif');
        if (this.isAttacking)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-right-attack.gif');
        if( !this.isMoving && !this.isAttacking && !this.isSpelling)
          char.$body.css('background-image', 'url(../sprites/'+this.type+'-right-stand.png');
      }
      else if( 135 <= char.characterAngle && char.characterAngle <= 225){
        if (this.isMoving)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-front-walk.gif');
        if (this.isAttacking)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-front-attack.gif');
        if( !this.isMoving && !this.isAttacking && !this.isSpelling)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-front-stand.png');
      }
      else if( 225 <= char.characterAngle && char.characterAngle <= 270 || -90 <= char.characterAngle && char.characterAngle <= -45){
        if (this.isMoving)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-left-walk.gif');
        if (this.isAttacking)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-left-attack.gif');
        if( !this.isMoving && !this.isAttacking && !this.isSpelling)
        char.$body.css('background-image', 'url(../sprites/'+this.type+'-left-stand.png');
      }

  },

  spell: function (action) {
    if (this.dead) {
      return;
    }
    if (this.globalcd || this.cds[action]){
      return;
    }

    var b = this;

    // Set du mouvement pour animation
    if(this.spells[action].isAttack){
      b.isAttacking = true;
      setTimeout(function(){
          b.isAttacking = false;
      }, 1800);
    }

    //Emit spell to server
    var clientSpell = {};

    clientSpell.idSpell = this.spells[action].id;

    if($('#' + this.targetId).hasClass( 'character' )){
      clientSpell.targetId = this.targetId;
    }

    //Just for local balls who have owner
    clientSpell.alpha = this.characterAngle * Math.PI / 180; //angle of shot in radians
    //Set init position
    var cannonLength = 20;
    var deltaX = cannonLength * Math.sin(clientSpell.alpha);
    var deltaY = cannonLength * Math.cos(clientSpell.alpha);

    clientSpell.ownerId = this.id;
    clientSpell.x = this.x + deltaX - 5;
    clientSpell.y = this.y - deltaY - 5;

    socket.emit('spell', clientSpell);

    this.cooldown(action);
  },

  cooldown: function (action){
    var t = this;
    //console.log('set du cooldown du spell : ' + spellId + ' cooldwon : '+ t.spells[spellId].cooldown);

    t.globalcd = true;
    t.cds[action]=true;

    setTimeout(function(){
      //console.log('set globalcd to false');&
      t.globalcd = false;
    }, 500);

    // Change la couleur du spell en CD
    var spellBlock = $('#block-'+action);
    spellBlock.css('background-color', '#FFE5E5');
    setTimeout(function(){
      //console.log('set du spell ' + action +  ' to false');
      spellBlock.css('background-color', '#D3D3D3');
      t.cds[action]=false;
    }, t.spells[action].cooldown*1000);

  },

  buffDebuff: function( newData ){
      //newData = { newX: newX , newY: newY, newAngle: null, newSpeed: null, timeout: 0 }

      var initX = this.x;
      var initY = this.y;
      var initAngle = this.angle;
      var initSpeed = this.speed;

      //this.x= newData.newX;
      //this.y = newData.newY;

      if( newData.newX != null && newData.newY != null ){
        console.log('oldx : ' + this.x + ' newx : ' + newData.newX + ' oldy : ' + this.y + ' newy : ' + newData.newY);
        var count = 0;

        var interval = setInterval(function(){
          count ++;
          console.log('DEPLACEMENT');
          if( this.x > newData.newX ){
            this.x -= 1;
          }
          if( this.x < newData.newX ){
            this.x += 1;
          }
          if( this.y > newData.newY ){
            this.y -= 1;
          }
          if( this.y < newData.newY ){
            this.y += 1;
          }
        }, 30);

        //interval();
        if (this.x != newData.newX && this.y != newData.newY && count < 500){
          clearInterval(interval);
        };

      }

      if(newData.timeout > 0 ){
        //console.log('RESET DE LA POSITION)')
        setTimeout(function(){
          if(newData.newX != null)
          this.x = initX;
          if(newData.newY != null)
          this.y = initY;
          if(newData.newAngle != null)
          this.angle = initAngle;
          if(newData.newSpeed != null)
          this.speed = initSpeed;
        }, newData.timeout);
      }
  },

};
