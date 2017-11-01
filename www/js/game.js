var INTERVAL = 50;

function Game() {
  //this.localCharacter = '';
  this.characters = []; //Characters (other than the local character)
  this.$arena = $('#arena');

  var g = this;
  setInterval(function () { // Appel mailoop en boucle
    g.mainLoop();
  }, INTERVAL);
}

Game.prototype = {

  addCharacter: function (id, name, type, isLocal, x, y, hp, speed) {
    var c = new Character(id, name, type, isLocal, x, y, hp, speed, this.$arena);
    if (isLocal) {
      this.localCharacter = c;
      this.setControls();
    }else {
      this.characters.push(c);
    }
  },

  setControls: function () {
    var t = this.localCharacter;

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
      t.mx = e.pageX - t.$arena.offset().left;
      t.my = e.pageY - t.$arena.offset().top;
      t.setCharacterAngle();
    }).click(function () {
      t.shoot();
    });

  },

  removeCharacter: function (characterId) {
    //Remove character object
    this.characters = this.characters.filter(function (c) {return c.id != characterId });
    //remove character from dom
    console.log('remove id : '+characterId)
    $('#' + characterId).remove();
    $('#info-' + characterId).remove();
  },

  killCharacter: function (character) {
    character.dead = true;
    this.removeCharacter(character.id);

    //place explosion
    this.$arena.append('<img id="expl' + character.id + '" class="explosion" src="../sprites/deadblood.gif">');
    $('#expl' + character.id).css('left', (character.x - 40)  + 'px');
    $('#expl' + character.id).css('top', (character.y - 28)  + 'px');

    setTimeout(function () {
      $('#expl' + character.id).remove();
    }, 1000);

    if(character.id == this.localCharacter.id){
      $('#prompt').show();
    }
  },

  mainLoop: function () {
    if (this.localCharacter != undefined) {
      //send data to server about local tank
      this.sendData();

      //move local character
      this.localCharacter.move();
      this.localCharacter.anime();
      //this.localCharacter.updateGame();
    }
  },

  sendData: function () {
    //Send local data to server
    var gameData = {};

    //Send character data
    var c = {
      id: this.localCharacter.id,
      x: this.localCharacter.x,
      y: this.localCharacter.y,
      characterAngle: this.localCharacter.characterAngle,
    };
    gameData.character = c;

    //Client game does not send any info about balls,
    //the server controls that part
    socket.emit('sync', gameData);
  },

  receiveData: function (serverData) {
    var game = this;
    console.log('receive data from server : ');

    // Render characters
    serverData.characters.forEach(function (serverCharacter) {

        //Update local character stats
        if (game.localCharacter !== undefined && serverCharacter.id == game.localCharacter.id) {
          game.localCharacter.hp = serverCharacter.hp;
          if (game.localCharacter.hp <= 0) {
            game.killCharacter(game.localCharacter);
          }
        }

        //Update foreign characters
        var found = false;
        game.characters.forEach(function (clientCharacter) {
          //console.log('Id : ' + clientCharacter.id + ' x : ' + clientCharacter.x + ' y : ' + clientCharacter.y);
          //update foreign tanks
          if (clientCharacter.id === serverCharacter.id) {
            clientCharacter.x = serverCharacter.x;
            clientCharacter.y = serverCharacter.y;
            clientCharacter.characterAngle = serverCharacter.characterAngle;
            clientCharacter.hp = serverCharacter.hp;
            if (clientCharacter.hp <= 0) {
              game.killCharacter(clientCharacter);
            }

            clientCharacter.refresh();
            found = true;
          }
        });

        if (!found &&
        (game.localCharacter == undefined || serverCharacter.id != game.localCharacter.id)) {
          //I need to create it
          game.addCharacter(serverCharacter.id, serverCharacter.name, serverCharacter.type, false, serverCharacter.x, serverCharacter.y, serverCharacter.hp);
        }
      });

    //Render balls
    game.$arena.find('.cannon-ball').remove();

    serverData.balls.forEach(function (serverBall) {
      //console.log('new ball : '+serverBall.y);
      var b = new Weapon(serverBall.id, serverBall.ownerId, game.$arena, serverBall.x, serverBall.y);
      b.exploding = serverBall.exploding;
      if (b.exploding) {
        b.explode();
      }
    });
  },
};
