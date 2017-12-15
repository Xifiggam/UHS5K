/**
 * Created by zelle on 15.12.17.
 */


var gameState = {
    ZOOM_FACTOR: 0.005,
    map: null,
    cursors: null,
    zoomButtons: null,
    layer: null,

    create: function () {

        this.cursors = game.input.keyboard.createCursorKeys();
        game.world.setBounds(0, 0, 2000, 2000);
        this.map = game.add.tilemap(ASSETS.TILES_DESERT_JSON);

        this.gameWorld = game.add.group();
        this.gameWorld.position.setTo(game.world.centerX, game.world.centerY)

        this.map.addTilesetImage('Desert', ASSETS.TMW_DESERT_SPACING);

        this.layer = this.map.createLayer('Ground');
        this.layer.resizeWorld();
        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        console.log(this.zoomButtons);
        game.input.onDown.add(this.fillTiles, this);
    },

    update: function () {
        this.inputHandling();
    },

    inputHandling: function () {
        if (this.cursors.up.isDown) {
            game.camera.y -= 4;
        }
        else if (this.cursors.down.isDown) {
            game.camera.y += 4;
        }

        if (this.cursors.left.isDown) {
            game.camera.x -= 4;
        }
        else if (this.cursors.right.isDown) {
            game.camera.x += 4;
        }
        if (this.zoomButtons.in.isDown) {

            var centerIn = Phaser.Point.add(game.camera.position,
                new Phaser.Point(game.camera.view.halfWidth, game.camera.view.halfHeight));

            var oldCameraScaleIn = game.camera.scale.clone();

            game.camera.scale.x += this.ZOOM_FACTOR;
            game.camera.scale.y += this.ZOOM_FACTOR;


            var cameraScaleRatioIn = Phaser.Point.divide(game.camera.scale, oldCameraScaleIn);
            game.camera.focusOn(Phaser.Point.multiply(centerIn, cameraScaleRatioIn));


        } else if (this.zoomButtons.down.isDown) {

            var center = Phaser.Point.add(game.camera.position,
                new Phaser.Point(game.camera.view.halfWidth, game.camera.view.halfHeight));

            var oldCameraScale = game.camera.scale.clone();

            game.camera.scale.x += -this.ZOOM_FACTOR;
            game.camera.scale.y += -this.ZOOM_FACTOR;


            var cameraScaleRatio = Phaser.Point.divide(game.camera.scale, oldCameraScale);
            game.camera.focusOn(Phaser.Point.multiply(center, cameraScaleRatio));

        }
    },

    fillTiles: function (arg) {
        console.log(arg);
        // map.fill(31, layer.getTileX(sprite.x), layer.getTileY(sprite.y), 8, 8);

    }
};
