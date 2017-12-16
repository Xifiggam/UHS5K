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
    newsHudMenu : null,

    layers: [],

    create: function () {
console.log("now");
        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('ProtoTileset', ASSETS.TILESET_PROTO_KARTE);
        this.createLayers();
        this.onLayers(function(layer){
            layer.resizeWorld();
        });


        this.createNewsHud();

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
            //game.camera.shake();
            this.postNews("the cake is a lie",4000);
        }
    },

    addObject: function (point) {
        console.log(point);
        console.log(this.map);
        var posX = (this.layers[0].getTileX(point.worldX) * TILE.SIZE);
        var posY = (this.layers[0].getTileY(point.worldY) * TILE.SIZE);
        var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);
        sprite.scale.setTo(0.25,0.25);

    },

    createNewsHud: function () {
        this.newsHudMenu = game.add.group();

        function click() {
            console.log("blub");
        }

        var button = game.add.button(10, 10, ASSETS.DUMMY_BUTTON, click, this, 2, 1, 0);
        button.scale.setTo(10,1.1);
        button.fixedToCamera = true;

        var style = { font: "25px Arial", fill: "#FFFFFF", align: "left" };
        var text = game.add.text(15, 15, "News", style);
        text.anchor.set(0);
        text.fixedToCamera = true;
    },
    postNews: function (text,delay) {
        var style = { font: "14px Arial", fill: "#FFFFFF", align: "left" };
        var text = game.add.text(15, 45, text, style);
        text.anchor.set(0);
        text.alpha = 0;
        text.fixedToCamera = true;
        var fadeInTween = game.add.tween(text).to( { alpha: 1 }, 2000);
        var fadeoutTween =game.add.tween(text).to( { alpha: 0 }, 2000);
        fadeoutTween.delay(delay);
        fadeInTween.chain(fadeoutTween);
        fadeInTween.start();
    },

    setupStarsHud: function (count) {
        var sprite = game.add.sprite(game.width - 20);

    }
};
