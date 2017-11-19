var INTERVAL = 20;

function Game() {
  //this.localCharacter = '';
  this.CHARACTER_LIST = []; //CHARACTER_LIST (other than the local character)
  this.$arena = $('#arena');

  var g = this;
  setInterval(function () { // Appel mailoop en boucle
    g.mainLoop();
  }, INTERVAL);
}

Game.prototype = {

  addCharacter: function ( characterData, isLocal ) {
      c = new Character( characterData, isLocal, this.$arena );
      if (isLocal) {
        this.localCharacter = c;

        this.setLayout(characterData);
        this.setShortcuts(characterData);

      }else {
        this.CHARACTER_LIST.push(c);
      }
  },

  setShortcuts: function(characterData){
      for (var property in characterData.spells) {
          if (characterData.spells.hasOwnProperty(property)) {
            this.localCharacter.shortcuts[characterData.spells[property].spellKey] =  property;
          }
      }
      console.log(this.localCharacter.shortcuts);
  },

  setLayout: function(characterData){
    // Set spells layout
    for (var property in characterData.spells) {
      if (characterData.spells.hasOwnProperty(property)) {
          //console.log('name : ' + characterData.spells[property].name);
          $('#block-'+characterData.spells[property].spellKey).append(characterData.spells[property].name);
      }
    }
  },

  removeCharacter: function (characterId) {
    //Remove character object
    this.CHARACTER_LIST = this.CHARACTER_LIST.filter(function (c) {return c.id != characterId });
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
    //console.log('receive data from server : ');

    // Render CHARACTER_LIST
    serverData.CHARACTER_LIST.forEach(function (serverCharacter) {

        //Update local character stats
        if (game.localCharacter !== undefined && serverCharacter.id == game.localCharacter.id) {

          // Updtade vita
          if ( serverCharacter.hp != game.localCharacter.hp ){
            game.localCharacter.updateHp(serverCharacter.hp);
          }

          // Affect spell
          if( serverCharacter.spellAffection != null ){
            game.localCharacter.affectSpell(serverCharacter.spellAffection);
          }

          // Kill character if no HP
          if (game.localCharacter.hp <= 0) {
            game.killCharacter(game.localCharacter);
          }
        }

        //Update foreign CHARACTER_LIST
        var found = false;
        game.CHARACTER_LIST.forEach(function (clientCharacter) {
          //console.log('Id : ' + clientCharacter.id + ' x : ' + clientCharacter.x + ' y : ' + clientCharacter.y);
          //update foreign tanks
          if (clientCharacter.id === serverCharacter.id) {
            clientCharacter.x = serverCharacter.x;
            clientCharacter.y = serverCharacter.y;
            clientCharacter.isMoving = serverCharacter.isMoving;
            clientCharacter.characterAngle = serverCharacter.characterAngle;
            clientCharacter.updateHp(serverCharacter.hp);
            if (clientCharacter.hp <= 0) {
              game.killCharacter(clientCharacter);
            }

            // update foreign caracter data
            clientCharacter.refresh();
            found = true;
          }
        });

        // If not found character
        if (!found &&
        (game.localCharacter == undefined || serverCharacter.id != game.localCharacter.id)) {
          //Create it
          game.addCharacter( serverCharacter, false);
        }
      });

    //Render spells
    game.$arena.find('*[class^="spell-"]').remove();

    serverData.SPELL_LIST.forEach(function (serverSpell) {
      //console.log('new ball : '+serverSpell.y);
      var s = new Spell(serverSpell.id, serverSpell.idSpell, serverSpell.ownerId, serverSpell.isProjectile, game.$arena, serverSpell.x, serverSpell.y);
      s.exploding = serverSpell.exploding;
      if (s.exploding) {
        s.explode();
      }
    });
  },
};
