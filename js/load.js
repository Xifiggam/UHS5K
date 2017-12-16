var loadState = {

    preload: function () {

        /*
        Load all game assets
        Place your load bar, some messages.
        In this case of loading, only text is placed...
        */

        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#fff'});

        //Load your images, spritesheets, bitmaps...
        game.load.image(ASSETS.DUMMY_BUTTON, 'assets/img/button_dummy.png');
        game.load.image(ASSETS.STAR, 'assets/img/star.png');
        game.load.image(ASSETS.MENU_BG, 'assets/img/menubg.png');
        game.load.image(ASSETS.NIGHT, 'assets/img/night.png');
        game.load.image(ASSETS.BUTTON_1, 'assets/img/button_1_u.png');
        game.load.image(ASSETS.MENU_CENTER, 'assets/img/u_menu_center.png');
        game.load.image(ASSETS.MENU_TOP, 'assets/img/u_menu_top.png');

        game.load.image(ASSETS.BED_HEAD, 'assets/img/bed_head_32x32.png');
        game.load.image(ASSETS.BED_END, 'assets/img/bed_end_32x32.png');
        game.load.image(ASSETS.BED_MIDDLE, 'assets/img/bed_middle_32x32.png');
        game.load.image(ASSETS.PLANT, 'assets/img/plant_large_32x32.png');
        game.load.image(ASSETS.SHOWER, 'assets/img/shower_64x64.png');
        game.load.image(ASSETS.TOILET, 'assets/img/toilet_64x32.png');
        game.load.image(ASSETS.SINK, 'assets/img/sink_32x32.png');
        game.load.image(ASSETS.TV, 'assets/img/TV.png');
        game.load.image(ASSETS.CHAR_OLD, 'assets/img/char_old.png');
        game.load.image(ASSETS.CHAR_GEN, 'assets/img/char_gen.png');
        game.load.image(ASSETS.CHAR_WORKER_F, 'assets/img/char_steward_f.png');
        game.load.image(ASSETS.CHAR_WORKER_M, 'assets/img/char_steward_m.png');

        game.load.tilemap(ASSETS.TILES_PROTO_KARTE, 'assets/HotelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image(ASSETS.TILESET_PROTO_KARTE, 'assets/tileset.png');
        game.load.image(ASSETS.PERSON, 'assets/img/person.png');

    },

    create: function () {

        game.stage.setBackgroundColor('#0000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        game.add.plugin(PhaserInput.Plugin);
        game.state.start('game');
    }
};
