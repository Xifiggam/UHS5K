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
        var self = this;
        this.world.customerArrivalCallback =  function(customer) {
            self.spawnCustomerVisualAndMoveToRoom(customer);
        };
        this.world.customerLeaveCallback =  function(customer) {
            self.moveCustomerVisualFromRoom(customer);
        };
        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('HotelTileSet', ASSETS.TILESET_PROTO_KARTE);
        this.createLayers();
        this.onLayers(function (layer) {
            layer.resizeWorld();
        });
        this.createNewsHud();


        this.initStarsHud();
        this.updateMoneyHudFromWorld();


        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        game.input.onDown.add(this.addObject, this);
        game.input.onDown.add(this.openRoomMenuIfAny, this);
    },


    update: function () {
        this.inputHandling();
        this.updateBuildCursor();
        this.world.update(game.time.elapsed);
        this.updateStarsHudFromWorld();
    },

    createLayers: function () {
        this.layers.push(this.map.createLayer('Floor'));
        this.layers.push(this.map.createLayer('Wall'));
        this.layers.push(this.map.createLayer('Object'));
        this.objectLayer = this.layers[2];
        this.wallLayer = this.layers[1];
        this.floorLayer = this.layers[0];
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
            this.spawnCustomerVisualAndMoveToRoom('Room 102');
            //this.postNews("the cake is a lie", 4000);
        }
    },

    moveCustomerVisualFromRoom: function(character) {
        if(character.sprite){
            var lobbyX = 760;
            var lobbyY = 750;

            var toLobby = game.add.tween(character.sprite).to( { x: lobbyX,y: lobbyY  },2000 , Phaser.Easing.Quadratic.InOut, false);
            var awaaaaay = game.add.tween(character.sprite).to( { x: lobbyX,y: 2000  },2000 , Phaser.Easing.Quadratic.InOut, false);
            toLobby.chain(awaaaaay);
            toLobby.start();
        }
    },
    spawnCustomerVisualAndMoveToRoom: function(character){
        var room = null;
        var roomName = character.chosenRoom.name;
        console.log(character);

        for(var i = 0; i<this.world.roomList.length;i++ ){
            var candidateRoom = this.world.roomList[i];
            if(candidateRoom.name === roomName){
                room = candidateRoom;
            }
        }
        if(room){
            var roomCenterX = (room.posX + room.length/2) * TILE.SIZE- TILE.SIZE/2;
            var roomCenterY = (room.posY + room.height/2) * TILE.SIZE- TILE.SIZE/2;

            var lobbyX = 760;
            var lobbyY = 750;
            var person =  game.add.sprite(760,800,ASSETS.CHAR_OLD); //somewhere in lobby
            character.sprite = person;
            person.scale.x = 1.2;
            person.scale.y = 1.2;
            var toLobby = game.add.tween(person).to( { x: lobbyX,y: lobbyY  },2000 , Phaser.Easing.Quadratic.InOut, false);
            var toRoom = game.add.tween(person).to( { x: roomCenterX,y: roomCenterY  },2000 , Phaser.Easing.Quadratic.InOut, false);
            toLobby.chain(toRoom);
            toLobby.start();
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
        for (var i = 0; i < this.world.roomList.length; i++) {
            var room = this.world.roomList[i];
            if (posX <= room.posX + room.length && posX >= room.posX) {
                if (posY <= room.posY + room.height && posY >= room.posY) {
                    return room;
                }
            }
        }
        console.log(posX, posY);
        return null;
    },

    close_build_menu: function () {
        this.roomMenuHud.destroy();
        this.roomMenuHud = null;
    },

    createBuildMenu: function (room) {
        var featureCount = 0;
        var self = this;

        if (self.roomMenuHud || self.buildMarker != null) {
            return;
        }

        function addFeatureOption(name, value, bought, notPlaceable, feature_type) {
            var style = {font: "20px Arial", fill: "#000000", align: "left"};

            if (bought) {
                style.fill = "gray"
            }
            function click_button() {
                self.close_build_menu();
                //TODO: check if there is money
                if(!notPlaceable) {
                   if(!bought){
                       self.activateBuildCursor(feature_type, room);
                   }
                } else {
                    self.world.upgradeRoom(room, feature_type);
                }

            }

            var baseOffsetTop = featureCount * 50;
            var button = game.add.button(offsetLeft + padding, 120 + baseOffsetTop, ASSETS.DUMMY_BUTTON, click_button, this, 2, 1, 0);
            button.scale.x = 6;
            button.scale.y = 0.9;
            button.inputEnabled = !bought;
            button.fixedToCamera = true;

            var featureName = game.add.text(offsetLeft + padding + 10, 130 + baseOffsetTop, name, style);
            featureName.fixedToCamera = true;

            var price = game.add.text(offsetLeft + padding + 160, 130 + baseOffsetTop, value + "€", style);
            price.fixedToCamera = true;

            self.roomMenuHud.add(button);
            self.roomMenuHud.add(featureName);
            self.roomMenuHud.add(price);
            featureCount += 1;
        }


        this.roomMenuHud = game.add.group();
        var offsetLeft = game.width / 2;
        var sprite = game.add.sprite(offsetLeft, 10, ASSETS.MENU_BG);
        sprite.scale.x = offsetLeft - 10;
        sprite.scale.y = game.height - 20;
        sprite.fixedToCamera = true;


        var style = {font: "25px Arial", fill: "#000000", align: "left"};
        var padding = 20;

        var btnClose = game.add.button(game.width - 50, 20, ASSETS.DUMMY_BUTTON, self.close_build_menu, this, 2, 1, 0);
        btnClose.fixedToCamera = true;
        var closex = game.add.text(game.width - 40, 20, "X", style);
        closex.fixedToCamera = true;

        function set_price() {
            room.price = prompt("Please enter a price for the room", room.price);
            setPrice.text = room.price+"€";
        }

        var btnSetPrice = game.add.button(game.width - 250, 20, ASSETS.DUMMY_BUTTON, set_price, this, 2, 1, 0);
        btnSetPrice.fixedToCamera = true;
        btnSetPrice.scale.x = 2.5;
        console.log(room);
        var setPrice = game.add.text(game.width - 240, 20, room.price+"€", style);
        setPrice.fixedToCamera = true;


        var title = game.add.text(offsetLeft + padding, 20, room.name, style);
        title.fixedToCamera = true;

        this.roomMenuHud.add(sprite);
        this.roomMenuHud.add(title);
        var features = room.getFeatures();

        this.roomMenuHud.add(btnClose);
        this.roomMenuHud.add(closex);

        this.roomMenuHud.add(btnSetPrice);
        this.roomMenuHud.add(setPrice);


        addFeatureOption("Single bed", this.world.SINGLEBED_PRICE, features[0], false, SINGLE_FEATURE_TYPE.SINGLE_BED);
        addFeatureOption("Double bed", this.world.DOUBLEBED_PRICE, features[1], false, SINGLE_FEATURE_TYPE.DOUBLE_BED);
        addFeatureOption("Child bed", this.world.CHILDBED_PRICE, features[2], false, SINGLE_FEATURE_TYPE.CHILD_BED);
        addFeatureOption("Luxury bed", this.world.LUXURYBED_PRICE, features[3], false, SINGLE_FEATURE_TYPE.LUXURY_BED);
        addFeatureOption("Plant", this.world.PLANT_PRICE, features[4], false, SINGLE_FEATURE_TYPE.PLANT);
        addFeatureOption("View", this.world.VIEW_PRICE, features[5], true, SINGLE_FEATURE_TYPE.VIEW);
        addFeatureOption("Entertainment", this.world.ENTERTAINMENT_PRICE, features[6], false, SINGLE_FEATURE_TYPE.ENTERTAINMENT);
        addFeatureOption("Bath", this.world.BATH_PRICE, features[7], false, SINGLE_FEATURE_TYPE.BATH);
        addFeatureOption("Minibar", this.world.MINIBAR_PRICE, features[8], true, SINGLE_FEATURE_TYPE.MINIBAR);
        addFeatureOption("AC Unit", this.world.ACUNIT_PRICE, features[9], true, SINGLE_FEATURE_TYPE.ACUNIT);

    },
    openRoomMenuIfAny: function (point) {
        var room = this.getRoom(point);
        // console.log(room);
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

    initStarsHud: function () {
        var starCount = 5;
        var starOffset = 60;
        for (var i = 0; i < starCount; i++) {
            var star = game.add.sprite(game.width - i * starOffset, 10, ASSETS.STAR);
            this.stars.push(star);
            star.fixedToCamera = true;
        }
    }
    ,
    updateMoneyHudFromWorld: function () {
        if (this.moneyText) {
            this.moneyText.destroy();
        }
        var style = {font: "25px Arial", fill: "#000000", align: "left"};
        this.moneyText = game.add.text(game.width - 28, 45, this.world.money + " €", style);
        this.moneyText.anchor.x = 1;
        this.moneyText.anchor.y = 0;
        this.moneyText.fixedToCamera = true;
    },

    updateStarsHudFromWorld: function () {

        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.alpha = this.world.stars < i;// <= this is my favourite line of code.
        }
    },

    activateBuildCursor: function (type, room) {
        var width = 1;
        var height = 1;
        this.buildSpriteGroup = game.add.group();
        this.buildSpriteGroup.u_diff_size = false;
        this.buildSpriteGroup.u_drawcallback = function(){console.log('drawcallback called but not implemented ')};
        if (type == SINGLE_FEATURE_TYPE.SINGLE_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
        } else if(type == SINGLE_FEATURE_TYPE.DOUBLE_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
            height = 2;
        } else if(type == SINGLE_FEATURE_TYPE.LUXURY_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
            height = 3;
        } else if(type == SINGLE_FEATURE_TYPE.CHILD_BED) {
            this.addChildBedSpriteToGroup(this.buildSpriteGroup);
            width = 2;
        } else if(type == SINGLE_FEATURE_TYPE.PLANT) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.PLANT));
        } else if(type == SINGLE_FEATURE_TYPE.VIEW) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.VIEW));
        } else if(type == SINGLE_FEATURE_TYPE.ENTERTAINMENT) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.TV));
        } else if(type == SINGLE_FEATURE_TYPE.BATH) {
            this.buildSpriteGroup.u_diff_size = true;
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.SHOWER));
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.TOILET));
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.SINK));
            width = 2;
            height = 4;
            this.buildSpriteGroup.u_drawcallback = function(group, x, y){
                group.children[0].x = x;
                group.children[0].y = y;
                group.children[1].x = x;
                group.children[1].y = y + TILE.SIZE * 2;
                group.children[2].x = x;
                group.children[2].y = y + TILE.SIZE * 3;
            }
        } else {
            console.warn('will open build cursor without asset type was ' + type);
        }
        this.activeBuildCursor(width, height, false, type, room);

    },



    activeBuildCursor: function (width, height, collision, type, room) {
        var color = collision ? 0xFF0000 : 0x000000;
        this.buildMarker = game.add.graphics();
        this.buildMarker.lineStyle(2, color, 1);
        this.buildMarker.collision = collision;
        this.buildMarker.drawRect(0, 0, TILE.SIZE * width, TILE.SIZE * height);
        this.buildMarker.u_width = width;
        this.buildMarker.u_height = height;
        this.buildMarker.u_type = type;
        this.buildMarker.u_room = room;

    },

    deactivateBuildCursor: function () {
        this.buildMarker.destroy();
        this.buildMarker = null;
        this.buildSpriteGroup.destroy();
        this.buildSpriteGroup = null;
    },


    updateBuildCursor: function () {
        if (this.buildMarker !== null) {

            var tileX = this.objectLayer.getTileX(game.input.activePointer.worldX);
            var x = tileX * TILE.SIZE;
            var tileY = this.objectLayer.getTileY(game.input.activePointer.worldY);
            var y = tileY * TILE.SIZE;
            var collide = false;
            if (this.getRoom(game.input.activePointer) !== this.buildMarker.u_room) {
                console.log("not in room");
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
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, true, this.buildMarker.u_type, this.buildMarker.u_room);
                }
            } else {
                if (this.buildMarker.collision) {
                    this.buildMarker.destroy();
                    this.activeBuildCursor(this.buildMarker.u_width, this.buildMarker.u_height, false, this.buildMarker.u_type, this.buildMarker.u_room);
                }
            }
            this.buildMarker.x = x;
            this.buildMarker.y = y;
            if(!this.buildSpriteGroup.u_diff_size) {
                //move build sprite
                for (var it_group_child_x = 0; it_group_child_x < this.buildMarker.u_width; it_group_child_x++) {
                    for (var it_group_child_y = 0; it_group_child_y < this.buildMarker.u_height; it_group_child_y++) {
                        var group_child = this.buildSpriteGroup.children[it_group_child_x+it_group_child_y*this.buildMarker.u_width];
                        group_child.x = x + TILE.SIZE * it_group_child_x ;
                        group_child.y = y + TILE.SIZE * it_group_child_y;
                    }
                }
            } else {
                this.buildSpriteGroup.u_drawcallback(this.buildSpriteGroup, x, y);
            }
            if (game.input.mousePointer.isDown && !collide) {
                var room = this.buildMarker.u_room;
                this.world.upgradeRoom(this.buildMarker.u_room, this.buildMarker.u_type);
                this.updateMoneyHudFromWorld();
                var sprite_group = game.add.group();
                if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.SINGLE_BED) {
                    this.addBedSpriteToGroup(sprite_group);
                }
                else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.DOUBLE_BED) {
                    this.addBedSpriteToGroup(sprite_group);
                    this.addBedSpriteToGroup(sprite_group);
                }
                else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.LUXURY_BED) {
                    this.addBedSpriteToGroup(sprite_group);
                    this.addBedSpriteToGroup(sprite_group);
                    this.addBedSpriteToGroup(sprite_group);
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.CHILD_BED) {
                    this.addChildBedSpriteToGroup(sprite_group);
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.PLANT) {
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.PLANT));
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.ENTERTAINMENT) {
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.TV));
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.BATH) {
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.SHOWER));
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.TOILET));
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.SINK));
                } else {
                    console.error('type not found for placement');
                }
                //write tile as blocker for building
                var currentTile = this.map.getTile(tileX, tileY, this.floorLayer);
                for (var it_bl_tile_x = 0; it_bl_tile_x < this.buildMarker.u_width; it_bl_tile_x++) {
                    for (var it_bl_tile_y = 0; it_bl_tile_y < this.buildMarker.u_height; it_bl_tile_y++) {
                        this.map.putTile(currentTile, tileX + it_bl_tile_x, tileY + it_bl_tile_y, this.objectLayer);
                        if(!this.buildSpriteGroup.u_diff_size) {
                            var group_child_block = sprite_group.children[it_bl_tile_x + it_bl_tile_y * this.buildMarker.u_width];
                            group_child_block.x = x + TILE.SIZE * it_bl_tile_x ;
                            group_child_block.y = y + TILE.SIZE * it_bl_tile_y;
                        }
                    }
                }
                if(this.buildSpriteGroup.u_diff_size) {
                    this.buildSpriteGroup.u_drawcallback(sprite_group, x, y);
                }



                this.deactivateBuildCursor();
            } else if (game.input.mousePointer.isDown){
                this.deactivateBuildCursor();
            }
        }
    },


    addBedSpriteToGroup: function(group){
        var bed_end_sprite = game.add.sprite(0, 0, ASSETS.BED_HEAD);
        var bed_middle_sprite = game.add.sprite(0, 0, ASSETS.BED_MIDDLE).alignTo(bed_end_sprite, Phaser.RIGHT_CENTER, 0);
        var bed_head_sprite = game.add.sprite(0, 0, ASSETS.BED_END).alignTo(bed_middle_sprite, Phaser.RIGHT_CENTER, 0);
        group.add(bed_head_sprite);
        group.add(bed_middle_sprite);
        group.add(bed_end_sprite);
    },
    addChildBedSpriteToGroup: function(group){
        var bed_end_sprite = game.add.sprite(0, 0, ASSETS.BED_HEAD);
        var bed_head_sprite = game.add.sprite(0, 0, ASSETS.BED_END).alignTo(bed_end_sprite, Phaser.RIGHT_CENTER, 0);
        group.add(bed_head_sprite);
        group.add(bed_end_sprite);
    }
};


