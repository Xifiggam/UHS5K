/*
For Fullscreen put this code:

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
*/
// var w = window.innerWidth * window.devicePixelRatio,
//     h = window.innerHeight * window.devicePixelRatio;
var w = 1200;
var h = 800;

var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameContainer');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('tutorial', tutorialState);
game.state.add('credits', creditsState);
game.state.add('game', gameState);

game.state.start('boot');
