
var w = window.innerWidth * 1.5,
    h = window.innerHeight * 1.5;

/*var w = 1920,
    h = 1080; */
console.log("Width: " + w + " Height: " + h);
var game = new Phaser.Game(w, h, Phaser.CANVAS, 'gameContainer');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('credits', creditsState);
game.state.add('game', gameState);

game.state.start('boot');
