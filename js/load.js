var loadState = {

    preload: function () {

        /*
        Load all game assets
        Place your load bar, some messages.
        In this case of loading, only text is placed...
        */

        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#fff'});

        //Load your images, spritesheets, bitmaps...
        game.load.image('boiler-logo', 'assets/img/boilerplate-logo.png');
        game.load.image(ASSETS.DUMMY_BUTTON, 'assets/img/button_dummy.png');
        game.load.tilemap(ASSETS.TILES_DESERT_JSON, 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image(ASSETS.TMW_DESERT_SPACING, 'assets/tmw_desert_spacing.png');

        //Load your sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');

        //Load your data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {

        game.stage.setBackgroundColor('#F78181');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
