var menuState = {


    create: function () {

        game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        game.add.plugin(PhaserInput.Plugin);

        var button = game.add.button(game.world.centerX - 95, 100, ASSETS.DUMMY_BUTTON, menu.actionOnClick, this, 2, 1, 0);

        var style = { font: "25px Arial", fill: "#FFFFFF", align: "left" };
        var text = game.add.text(game.world.centerX - 93, 110, "Start", style);
        text.anchor.set(0);

        button.onInputOver.add(menu.over, this);
        button.onInputOut.add(menu.out, this);


        var button = game.add.button(game.world.centerX - 95, 200, ASSETS.DUMMY_BUTTON, menu.creditsClicked, this, 2, 1, 0);

        var style = { font: "25px Arial", fill: "#FFFFFF", align: "left" };
        var text = game.add.text(game.world.centerX - 93, 210, "Credits", style);
        text.anchor.set(0);

        button.onInputOver.add(menu.over, this);
        button.onInputOut.add(menu.out, this);
    }
};



var menu = {

    over: function(btn) {
        btn.alpha = 0.8;
    },
    out: function(btn) {
        btn.alpha = 1;
    },
    actionOnClick: function () {
        console.log("action on click called");
        game.state.start('game');
    },
    creditsClicked: function () {
        game.state.start('credits');
    }
}