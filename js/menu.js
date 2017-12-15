var menuState = {


    create: function () {

        game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        game.add.plugin(PhaserInput.Plugin);

        game.add.image(95, 150, 'boiler-logo');
        var button = game.add.button(game.world.centerX - 95, 400, ASSETS.DUMMY_BUTTON, menu.actionOnClick, this, 2, 1, 0);

        // button.onInputOver.add(over, this);
        // button.onInputOut.add(out, this);
        // button.onInputUp.add(up, this);
    }
};

var menu = {
    actionOnClick: function () {
        console.log("action on click called");
        game.state.start('game');
    }
}