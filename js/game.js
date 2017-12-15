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
    gameWorld: null,

    layerFloor: null,
    layerWall: null,
    layerObject: null,

    create: function () {

        this.cursors = game.input.keyboard.createCursorKeys();
        game.world.setBounds(0, 0, 40000, 40000);
        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);

        this.map.addTilesetImage('ProtoTileset', ASSETS.TILESET_PROTO_KARTE);
        this.gameWorld = game.add.group();
        this.gameWorld.position.setTo(game.world.centerX, game.world.centerY)

        this.layer = this.map.createLayer('Floor');
        this.layer = this.map.createLayer('Wall');
        this.layer = this.map.createLayer('Object');
        this.layer.resizeWorld();

        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        console.log(this.zoomButtons);
        game.input.onDown.add(this.addObject, this);
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
        if (this.miscButtons.shake.isDown) {
            game.camera.shake();
        }
    },

    addObject: function (point) {
        console.log(this.map);
        var posX = this.layer.getTileX(point.clientX) * TILE.SIZE;
        var posY = this.layer.getTileY(point.clientY) * TILE.SIZE;
        var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);

    }
};
