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
    stars: [],
    layers: [],

    buildMarker: null,
    buildTile: null,
    

    create: function () {
        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('ProtoTileset', ASSETS.TILESET_PROTO_KARTE);
        this.createLayers();
        this.onLayers(function(layer){
            layer.resizeWorld();
        });
        this.createNewsHud();


        this.setupStarsHud();
        this.setupMoneyHud(1000);


        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        game.input.onDown.add(this.addObject, this);
        this.activeBuildCursor(2, 1, false);
    },

    update: function () {
        this.inputHandling();
        this.updateBuildCursor();
    },

    createLayers: function () {
        this.layers.push(this.map.createLayer('Floor'));
        this.layers.push(this.map.createLayer('Wall'));
        this.layers.push(this.map.createLayer('Object'));
        this.objectLayer = this.layers[2];
        this.wallLayer = this.layers[1];
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
        // console.log(point);
        // console.log(this.map);
        // var posX = (this.layers[0].getTileX(point.worldX) * TILE.SIZE);
        // var posY = (this.layers[0].getTileY(point.worldY) * TILE.SIZE);
        // var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);
        // sprite.scale.setTo(0.25,0.25);

        this.starsVisible(Math.random()*5);
        this.setupMoneyHud(Math.random()*1000);

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

    setupStarsHud: function () {
        var starCount = 5;
        var starOffset = 60;
        for (var i = 0; i < starCount; i++) {
            var star = game.add.sprite(game.width - i* starOffset, 10, ASSETS.STAR);
            this.stars.push(star);
            star.fixedToCamera = true;
        }
    },
    setupMoneyHud: function (money) {
        if(this.moneyText){
            this.moneyText.destroy();
        }
        var style = { font: "25px Arial", fill: "#000000", align: "left" };
        this.moneyText = game.add.text(game.width -28, 45, money +" €", style);
        this.moneyText.anchor.x = 1;
        this.moneyText.anchor.y = 0;
        this.moneyText.fixedToCamera = true;
    },
    starsVisible: function (count) {

        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.alpha = count < i;// <= this is my favourite line of code.
        }
    },

    
    activeBuildCursor: function(width, height, collision){
        this.buildMarker = game.add.graphics();
        var color = collision ? 0xFF0000 : 0x000000;
        this.buildMarker.lineStyle(2, color, 1);
        this.buildMarker.collision = collision;
        this.buildMarker.drawRect(0, 0, TILE.SIZE * width, TILE.SIZE * height);
        this.buildMarker.u_width = width;
        this.buildMarker.u_height = height;

    },


    updateBuildCursor: function(){
        if(this.buildMarker !== null) {

            var x = this.objectLayer.getTileX(game.input.activePointer.worldX) * TILE.SIZE;
            var y = this.objectLayer.getTileY(game.input.activePointer.worldY) * TILE.SIZE;
            var collide = false;
            for (var width = x; width < (this.buildMarker.u_width*TILE.SIZE + x ); width += TILE.SIZE) {
                for(var height = y; height < (this.buildMarker.u_height*TILE.SIZE + y); height += TILE.SIZE){
                    collide = collide || this.map.getTile(this.objectLayer.getTileX(width), this.objectLayer.getTileY(height), this.objectLayer) != null;
                    collide = collide || this.map.getTile(this.wallLayer.getTileX(width), this.wallLayer.getTileY(height), this.wallLayer) != null;
                    if(collide) {
                        break;
                    }
                }
            }
            if(collide) {
                if(!this.buildMarker.collision) {
                    this.buildMarker.destroy();
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, true);
                }
            } else {
                if(this.buildMarker.collision){
                    this.buildMarker.destroy();
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, false);
                }
            }
            this.buildMarker.x = x;
            this.buildMarker.y = y;
            if (game.input.mousePointer.isDown)
            {


            //     else
            // {
            //     if (this.map.getTile(this.objectLayer.getTileX(this.buildMarker.x), this.objectLayer.getTileY(this.buildMarker.y)).index != this.buildTile.index)
            //     {
            //         this.map.putTile(this.buildTile, this.objectLayer.getTileX(this.buildMarker.x), this.objectLayer.getTileY(this.buildMarker.y));
            //     }
            }
        }
    }
};
