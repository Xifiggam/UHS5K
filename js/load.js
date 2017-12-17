var country_bass;
var country_fiddle;
var country_guitar;
var country_mandolin;
var swing_bass;
var swing_drums;

var current;
var loopCount = 0;
var sounds;

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
        game.load.image(ASSETS.MENU_BOTTOM, 'assets/img/u_menu_bottom.png');
        game.load.image(ASSETS.MENU_BUBBLE, 'assets/img/u_bubble.png');

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
        game.load.image(ASSETS.AC_UNIT, 'assets/img/ac_cooling_32x32.png');
        game.load.image(ASSETS.DIRT, 'assets/img/dirt_32x32.png');

        game.load.tilemap(ASSETS.TILES_PROTO_KARTE, 'assets/HotelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image(ASSETS.TILESET_PROTO_KARTE, 'assets/tileset.png');
        game.load.image(ASSETS.PERSON, 'assets/img/person.png');

        // load audio
        game.load.audio(AUDIO.COUNTRY_BASS, 'assets/audio/hotel-country-bass.mp3');
        game.load.audio(AUDIO.COUNTRY_FIDDLE, 'assets/audio/hotel-country-fiddle.mp3');
        game.load.audio(AUDIO.COUNTRY_GUITAR, 'assets/audio/hotel-country-guitar.mp3');
        game.load.audio(AUDIO.COUNTRY_MANDOLIN, 'assets/audio/hotel-country-mandolin.mp3');
        game.load.audio(AUDIO.SWING_BASS, 'assets/audio/hotel-swing-bass.mp3');
        game.load.audio(AUDIO.SWING_DRUMS, 'assets/audio/hotel-swing-drums.mp3');

    },

    create: function () {

        country_bass = game.add.audio(AUDIO.COUNTRY_BASS);
        country_fiddle = game.add.audio(AUDIO.COUNTRY_FIDDLE);
        country_guitar = game.add.audio(AUDIO.COUNTRY_GUITAR);
        country_mandolin = game.add.audio(AUDIO.COUNTRY_MANDOLIN);
        swing_bass = game.add.audio(AUDIO.SWING_BASS);
        swing_drums = game.add.audio(AUDIO.SWING_DRUMS);

        sounds = [country_bass, country_fiddle, country_guitar, country_mandolin, swing_drums, swing_bass];

        game.sound.setDecodedCallback(sounds, start, this);

        game.stage.setBackgroundColor('#0000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        game.add.plugin(PhaserInput.Plugin);
        game.state.start('game');

    }
};


function start() {

    sounds.shift();

    country_bass.loopFull(0.6);
    country_bass.onLoop.add(hasLooped, this);

}

function hasLooped(sound) {

    loopCount++;

    if (loopCount === 1) {
        sounds.shift();
        country_fiddle.loopFull(0.6);
    }
    else if (loopCount === 2) {
        current = game.rnd.pick(sounds);
        current.loopFull();
    }
    else if (loopCount > 2) {
        current.stop();
        current = game.rnd.pick(sounds);
        current.loopFull();
    }
}