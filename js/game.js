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
    roomMenuHud:null,
    world:null,
    stars: [],
    layers: [],

    create: function () {
        this.world = gameWorld;

        var room = new Room();
        room.posX = 10;
        room.posY = 10;
        room.length = 10;
        room.height = 10;
        room.name = "Room 101";
        this.world.roomList.push(room);


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
        game.input.onDown.add(this.openRoomMenuIfAny, this);
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
        var posX = (this.layers[0].getTileX(point.worldX) * TILE.SIZE);
        var posY = (this.layers[0].getTileY(point.worldY) * TILE.SIZE);
        var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);
        sprite.scale.setTo(0.25,0.25);
    },

    getRoom: function (point) {
        var posX = (this.layers[0].getTileX(point.worldX));
        var posY = (this.layers[0].getTileY(point.worldY));
        for(var i = 0; i< this.world.roomList.length;i++){
            var room = this.world.roomList[i];
            if(posX <= room.posX + room.length && posX >= room.posX){
                if(posY <= room.posY + room.height && posY >= room.posY){
                    return room;
                }
            }
        }
        console.log(posX,posY);
        return null;
    },

    createBuildMenu: function (room) {
        var featureCount = 0;
        var self=this;
        function addFeatureOption(name, value) {

            var style = { font: "20px Arial", fill: "#000000", align: "left" };

            function click() {
                //TODO
            }

            var button = game.add.button(offsetLeft + padding  , 120 +featureCount*100, ASSETS.DUMMY_BUTTON, click, this, 2, 1, 0);
            button.scale.x = 6;
            button.fixedToCamera = true;

            var featureName = game.add.text(offsetLeft + padding + 10 , 130 +featureCount*100, name, style);
            featureName.fixedToCamera = true;

            var price = game.add.text(offsetLeft + padding + 100 , 130 +featureCount*100, value+"€", style);
            price.fixedToCamera = true;

            self.roomMenuHud.add(button);
            self.roomMenuHud.add(featureName);
            self.roomMenuHud.add(price);
            featureCount += 1;
        }

        if(this.roomMenuHud ){
            this.roomMenuHud.destroy();
            this.roomMenuHud = null;
        }else{
            this.roomMenuHud = game.add.group();
            var offsetLeft = game.width/2;
            var sprite = game.add.sprite(offsetLeft, 10, ASSETS.MENU_BG);
            sprite.scale.x = offsetLeft -10;
            sprite.scale.y = game.height - 20;
            sprite.fixedToCamera = true;

            var style = { font: "25px Arial", fill: "#000000", align: "left" };
            var padding = 20;

            var title  = game.add.text(offsetLeft + padding , 20, room.name, style);
            title.fixedToCamera = true;

            this.roomMenuHud.add(sprite)
            this.roomMenuHud.add(title);

            addFeatureOption("Test",1000);
            addFeatureOption("Test",1000);
            addFeatureOption("Test",1000);
            addFeatureOption("Test",1000);
        }
    },
    openRoomMenuIfAny: function(point){
        var room = this.getRoom(point);
        console.log(room);
        if(room){
            this.createBuildMenu(room);
        }
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
    }
};
