/**
 * Created by zelle on 15.12.17.
 */


var gameState = {
    ZOOM_FACTOR: 0.005,
    MOVE_SPEED: 4,
    map: null,
    cursors: null,
    zoomButtons: null,
    miscButtons: null,
    layer: null,

    create: function () {

        this.cursors = game.input.keyboard.createCursorKeys();
        game.world.setBounds(0, 0, 2000, 2000);
        this.map = game.add.tilemap(ASSETS.TILES_DESERT_JSON);

        this.map.addTilesetImage('Desert', ASSETS.TMW_DESERT_SPACING);

        this.layer = this.map.createLayer('Ground');

        this.layer.resizeWorld();
        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        console.log(this.zoomButtons);
        game.input.onDown.add(this.fillTiles, this);
    },

    update: function () {
        this.inputHandling();
    },

    inputHandling: function () {
        if (this.cursors.up.isDown) {
            game.camera.y -= this.MOVE_SPEED;
        }
        else if (this.cursors.down.isDown) {
            game.camera.y += this.MOVE_SPEED;
        }

        if (this.cursors.left.isDown) {
            game.camera.x -= this.MOVE_SPEED;
        }
        else if (this.cursors.right.isDown) {
            game.camera.x += this.MOVE_SPEED;
        }
        if (this.zoomButtons.in.isDown) {
            game.camera.scale.x += this.ZOOM_FACTOR;
            game.camera.scale.y += this.ZOOM_FACTOR;
        } else if (this.zoomButtons.down.isDown) {
            game.camera.scale.x += -this.ZOOM_FACTOR;
            game.camera.scale.y += -this.ZOOM_FACTOR;
        }
        if (this.miscButtons.shake.isDown) {
            game.camera.shake();
        }
    },

    fillTiles: function (arg) {
        console.log(arg);
        sprite = this.game.add.sprite(arg.clientX, arg.clientY, ASSETS.PERSON);

    }
};
