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

    layers: [],

    create: function () {
console.log("now");
        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('ProtoTileset', ASSETS.TILESET_PROTO_KARTE);
        this.gameWorld = game.add.group();
        this.gameWorld.position.setTo(game.world.centerX, game.world.centerY);
        this.createLayers();
        this.onLayers(function(layer){
            layer.resizeWorld();
        });

        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        game.input.onDown.add(this.addObject, this);
    },

    update: function () {
        this.inputHandling();
    },

    createLayers: function () {
        this.layers.push(this.map.createLayer('Floor'));
        this.layers.push(this.map.createLayer('Wall'));
        this.layers.push(this.map.createLayer('Object'));
    },

    onLayers: function(func){
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            func(layer)
        }
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
        if (this.miscButtons.shake.isDown) {
            game.camera.shake();
        }
    },

    addObject: function (point) {
        console.log(point);
        console.log(this.map);
        var posX = (this.layers[0].getTileX(point.worldX) * TILE.SIZE);
        var posY = (this.layers[0].getTileY(point.worldY) * TILE.SIZE);
        var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);
        sprite.scale.setTo(0.25,0.25);

    }
};
