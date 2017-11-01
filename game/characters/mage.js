module.exports = {
  	stats:  {
      vitality: '30',
      strenght: '10',
      dexterity: '10',
      mentality: '100',
      speed: '60',
      bio: function () {
        alert(this.vitality);
      },
    },
    spells: {
    1: 'frost bolt',
    2: 'nova',
    3: 'teleport',
  },
}
