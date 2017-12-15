var menuState = {


    create: function () {
        this.MenuEntryCount = 1;

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

        this.addMenuEntry("Start", function () {game.state.start('game'); });
        this.addMenuEntry("Credits", function () {game.state.start('credits'); });

    },

    addMenuEntry: function (name,callback) {
        var button = game.add.button(game.world.centerX - 95, this.MenuEntryCount*100, ASSETS.DUMMY_BUTTON, callback, this, 2, 1, 0);
        var style = { font: "25px Arial", fill: "#FFFFFF", align: "left" };
        var text = game.add.text(game.world.centerX - 93, this.MenuEntryCount*100 + 10, name, style);
        text.anchor.set(0);
        this.MenuEntryCount += 1;
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
    }
}