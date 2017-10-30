var INTERVAL = 50;

function Game() {
  this.characters = []; //Characters (other than the local character)
  this.$arena = $('#arena');

  var g = this;
  setInterval(function () { // Appel mailoop en boucle
    g.mainLoop();
  }, INTERVAL);
}

Game.prototype = {

  addCharacter: function (id, name, type, isLocal, x, y, hp) {
    var c = new Character(id, name, type, isLocal, x, y, hp, this.$arena);
    if (isLocal) {
      this.localCharacter = c;
    }else {
      this.characters.push(c);
    }
  },

  removeCharacter: function (characterId) {
    //Remove tank object
    this.characters = this.characters.filter(function (c) {return c.id != characterId });
    //remove tank from dom
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

  },

  mainLoop: function () {
    if (this.localCharacter != undefined) {
      //send data to server about local tank
      this.sendData();

      //move local tank
      this.localCharacter.move();
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
            game.killCharacter(clientCharacter);
          }
        }

        //Update foreign characters
        var found = false;
        game.characters.forEach(function (clientCharacter) {
          console.log('Id : ' + clientCharacter.id + ' x : ' + clientCharacter.x + ' y : ' + clientCharacter.y);
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
