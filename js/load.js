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
        game.load.image(ASSETS.TILES_PROTO_KARTE, 'assets/img/button_dummy.png');
        game.load.image(ASSETS.DUMMY_BUTTON, 'assets/img/button_dummy.png');
        game.load.image(ASSETS.STAR, 'assets/img/star.png');
        game.load.image(ASSETS.MENU_BG, 'assets/img/menubg.png');

        game.load.tilemap(ASSETS.TILES_PROTO_KARTE, 'assets/ProtoKarte.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image(ASSETS.TILESET_PROTO_KARTE, 'assets/tileset.png');
        game.load.image(ASSETS.PERSON, 'assets/img/person.png');

    },

    create: function () {

        game.stage.setBackgroundColor('#0000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('game');
    }
};
