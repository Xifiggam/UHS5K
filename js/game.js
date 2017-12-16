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
    newsHudMenu: null,
    roomMenuHud: null,
    world: null,
    stars: [],
    layers: [],

    buildMarker: null,
    buildTile: null,
    buildSpriteGroup: null,


    create: function () {
        this.world = gameWorld;

        var room = new Room();
        room.posX = 4;
        room.posY = 19;
        room.length = 6;
        room.height = 6;
        room.name = "Room 101";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 11;
        room.posY = 19;
        room.length = 5;
        room.height = 6;
        room.name = "Room 102";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 33;
        room.posY = 19;
        room.length = 5;
        room.height = 6;
        room.name = "Room 103";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 39;
        room.posY = 19;
        room.length = 7;
        room.height = 6;
        room.name = "Room 104";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 4;
        room.posY = 13;
        room.length = 4;
        room.height = 5;
        room.name = "Room 105";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 4;
        room.posY = 7;
        room.length = 4;
        room.height = 5;
        room.name = "Room Blue";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 4;
        room.posY = 1;
        room.length = 6;
        room.height = 5;
        room.name = "Room Red";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 11;
        room.posY = 1;
        room.length = 7;
        room.height = 5;
        room.name = "Suite \"Lukas\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 11;
        room.posY = 9;
        room.length = 5;
        room.height = 7;
        room.name = "Suite \"Gabe\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 17;
        room.posY = 9;
        room.length = 6;
        room.height = 7;
        room.name = "Suite \"Zelle\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 19;
        room.posY = 1;
        room.length = 11;
        room.height = 5;
        room.name = "Suite \"Phoe\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 26;
        room.posY = 9;
        room.length = 6;
        room.height = 7;
        room.name = "Suite \"Veit\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 31;
        room.posY = 1;
        room.length = 7;
        room.height = 5;
        room.name = "Honeymoon Suite";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 39;
        room.posY = 1;
        room.length = 7;
        room.height = 5;
        room.name = "Baum des Lebens";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 41;
        room.posY = 7;
        room.length = 5;
        room.height = 5;
        room.name = "\"Spielzimmer\"";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 41;
        room.posY = 13;
        room.length = 5;
        room.height = 5;
        room.name = "Room 8541";
        this.world.roomList.push(room);

        var room = new Room();
        room.posX = 33;
        room.posY = 9;
        room.length = 5;
        room.height = 7;
        room.name = "Room 100";
        this.world.roomList.push(room);



        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('HotelTileSet', ASSETS.TILESET_PROTO_KARTE);
        this.createLayers();
        this.onLayers(function (layer) {
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
        this.updateBuildCursor();
        this.world.update();
    },

    createLayers: function () {
        this.layers.push(this.map.createLayer('Floor'));
        this.layers.push(this.map.createLayer('Wall'));
        this.layers.push(this.map.createLayer('Object'));
        this.objectLayer = this.layers[2];
        this.wallLayer = this.layers[1];
    },

    onLayers: function (func) {
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
            this.postNews("the cake is a lie", 4000);
        }
    },

    addObject: function (point) {
        // console.log(point);
        // console.log(this.map);
        // var posX = (this.layers[0].getTileX(point.worldX) * TILE.SIZE);
        // var posY = (this.layers[0].getTileY(point.worldY) * TILE.SIZE);
        // var sprite = this.game.add.sprite(posX, posY, ASSETS.PERSON);
        // sprite.scale.setTo(0.25,0.25);
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
        var self = this;

        function addFeatureOption(name, value, bought, notPlaceable, feature_type) {

            var style = {font: "20px Arial", fill: "#000000", align: "left"};

            if(bought){
                style.fill = "gray"
            }

            function click() {
                self.activeBuildCursor(3, 1, false, feature_type);
            }

            var button = game.add.button(offsetLeft + padding, 120 + featureCount * 100, ASSETS.DUMMY_BUTTON, click, this, 2, 1, 0);
            button.scale.x = 6;
            button.inputEnabled = !bought;
            button.fixedToCamera = true;

            var featureName = game.add.text(offsetLeft + padding + 10, 130 + featureCount * 100, name, style);
            featureName.fixedToCamera = true;

            var price = game.add.text(offsetLeft + padding + 130, 130 + featureCount * 100, value + "€", style);
            price.fixedToCamera = true;

            self.roomMenuHud.add(button);
            self.roomMenuHud.add(featureName);
            self.roomMenuHud.add(price);
            featureCount += 1;
        }

        if (this.roomMenuHud) {
            this.roomMenuHud.destroy();
            this.roomMenuHud = null;
        } else {
            this.roomMenuHud = game.add.group();
            var offsetLeft = game.width / 2;
            var sprite = game.add.sprite(offsetLeft, 10, ASSETS.MENU_BG);
            sprite.scale.x = offsetLeft - 10;
            sprite.scale.y = game.height - 20;
            sprite.fixedToCamera = true;

            var style = {font: "25px Arial", fill: "#000000", align: "left"};
            var padding = 20;

            var title = game.add.text(offsetLeft + padding, 20, room.name, style);
            title.fixedToCamera = true;

            this.roomMenuHud.add(sprite)
            this.roomMenuHud.add(title);
            var features = room.getFeatures();

            // [singleBed,doubleBed,childBed,luxuryBed,plant,view,entertainment,bath,minibar,acUnit]
            addFeatureOption("Single bed", 1000,features[0], false, SINGLE_FEATURE_TYPE.SINGLE_BED);
            addFeatureOption("Double bed", 1000,features[1], false, SINGLE_FEATURE_TYPE.DOUBLE_BED);
            addFeatureOption("Child bed", 1000,features[2]);
            addFeatureOption("Luxury bed", 1000,features[3]);
            addFeatureOption("Plant", 1000,features[4]);
            addFeatureOption("View", 1000,features[5],true);
            addFeatureOption("Entertainment", 1000,features[6]);
            addFeatureOption("Bath", 1000,features[7]);
            addFeatureOption("Minibar", 1000,features[8],true);
            addFeatureOption("AC Unit", 1000,features[9],true);

        }
    },
    openRoomMenuIfAny: function (point) {
        var room = this.getRoom(point);
        console.log(room);
        if (room) {
            this.createBuildMenu(room);
        }
    },

    createNewsHud: function () {
        this.newsHudMenu = game.add.group();

        function click() {
            console.log("blub");
        }

        var button = game.add.button(10, 10, ASSETS.DUMMY_BUTTON, click, this, 2, 1, 0);
        button.scale.setTo(10, 1.1);
        button.fixedToCamera = true;

        var style = {font: "25px Arial", fill: "#FFFFFF", align: "left"};
        var text = game.add.text(15, 15, "News", style);
        text.anchor.set(0);
        text.fixedToCamera = true;
    },


    postNews: function (text, delay) {
        var style = {font: "14px Arial", fill: "#FFFFFF", align: "left"};
        var text = game.add.text(15, 45, text, style);
        text.anchor.set(0);
        text.alpha = 0;
        text.fixedToCamera = true;
        var fadeInTween = game.add.tween(text).to({alpha: 1}, 2000);
        var fadeoutTween = game.add.tween(text).to({alpha: 0}, 2000);
        fadeoutTween.delay(delay);
        fadeInTween.chain(fadeoutTween);
        fadeInTween.start();
    },

    setupStarsHud: function () {
        var starCount = 5;
        var starOffset = 60;
        for (var i = 0; i < starCount; i++) {
            var star = game.add.sprite(game.width - i * starOffset, 10, ASSETS.STAR);
            this.stars.push(star);
            star.fixedToCamera = true;
        }
    }
    ,
    setupMoneyHud: function (money) {
        if (this.moneyText) {
            this.moneyText.destroy();
        }
        var style = {font: "25px Arial", fill: "#000000", align: "left"};
        this.moneyText = game.add.text(game.width - 28, 45, money + " €", style);
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


    activeBuildCursor: function (width, height, collision, type, room) {
        this.buildMarker = game.add.graphics();
        this.buildSpriteGroup = game.add.group();
        if(type == SINGLE_FEATURE_TYPE.SINGLE_BED || type == SINGLE_FEATURE_TYPE.DOUBLE_BED){
                var bed_end_sprite = game.add.sprite(0, 0, ASSETS.BED_HEAD);
                var bed_middle_sprite = game.add.sprite(0, 0, ASSETS.BED_MIDDLE).alignTo(bed_end_sprite, Phaser.RIGHT_CENTER, 0);
                var bed_head_sprite = game.add.sprite(0, 0, ASSETS.BED_END).alignTo(bed_middle_sprite, Phaser.RIGHT_CENTER, 0);
                this.buildSpriteGroup.add(bed_head_sprite);
                this.buildSpriteGroup.add(bed_middle_sprite);
                this.buildSpriteGroup.add(bed_end_sprite);
        } else {
            console.error("type for build cursor not found "+type);
        }
        console.log(type);

        var color = collision ? 0xFF0000 : 0x000000;
        this.buildMarker.lineStyle(2, color, 1);
        this.buildMarker.collision = collision;
        this.buildMarker.drawRect(0, 0, TILE.SIZE * width, TILE.SIZE * height);
        this.buildMarker.u_width = width;
        this.buildMarker.u_height = height;
        this.buildMarker.u_type = type;
        this.buildMarker.u_room = room;
    },

    deactivateBuildCursor: function(){
        this.buildMarker.destroy();
        this.buildMarker = null;
        this.buildSpriteGroup.destroy();
        this.buildSpriteGroup = null;
    },


    updateBuildCursor: function () {
        if (this.buildMarker !== null) {

            var x = this.objectLayer.getTileX(game.input.activePointer.worldX) * TILE.SIZE;
            var y = this.objectLayer.getTileY(game.input.activePointer.worldY) * TILE.SIZE;
            var collide = false;
            if(this.getRoom(game.input.activePointer) !== this.buildMarker.u_room) {
                collide = true; // not in room
            }
            for (var width = x; width < (this.buildMarker.u_width * TILE.SIZE + x ); width += TILE.SIZE) {
                for (var height = y; height < (this.buildMarker.u_height * TILE.SIZE + y); height += TILE.SIZE) {
                    collide = collide || this.map.getTile(this.objectLayer.getTileX(width), this.objectLayer.getTileY(height), this.objectLayer) != null;
                    collide = collide || this.map.getTile(this.wallLayer.getTileX(width), this.wallLayer.getTileY(height), this.wallLayer) != null;
                    if (collide) {
                        break;
                    }
                }
            }
            if (collide) {
                if (!this.buildMarker.collision) {
                    this.buildMarker.destroy();
                    this.buildSpriteGroup.destroy();
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, true, this.buildMarker.u_type, this.buildMarker.u_room);
                }
            } else {
                if (this.buildMarker.collision) {
                    this.buildMarker.destroy();
                    this.buildSpriteGroup.destroy();
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, false, this.buildMarker.u_type, this.buildMarker.u_room);
                }
            }
            this.buildMarker.x = x;
            this.buildMarker.y = y;
            for (var it_group_child = 0; it_group_child < this.buildSpriteGroup.children.length; it_group_child++) {
                var group_child = this.buildSpriteGroup.children[it_group_child];
                group_child.x = x + TILE.SIZE * it_group_child;
                group_child.y = y;
            }
            if (game.input.mousePointer.isDown && !collide) {
                var room = this.buildMarker.u_room;
                this.world.upgradeRoom(this.buildMarker.u_room, this.buildMarker.u_type);
                this.deactivateBuildCursor();
            }
        }
    }
};
