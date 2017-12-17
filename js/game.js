function formatDateTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return hours + ":" + minutes;
}

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
    menuHud: null,
    infoHud: null,
    entityGroup: null,
    backroundObjectGroup: null,
    world: null,
    stars: [],
    layers: [],
    newsHistory: [],

    buildMarker: null,
    buildTile: null,
    buildSpriteGroup: null,


    create: function () {
        this.world = gameWorld;
        var self = this;


        this.world.customerArrivalCallback = function (customer) {
            self.moveToRoom(customer);
        };

        this.world.newReviewCallback = function (text) {
            self.postNews(text);
        };

        this.world.customerToLobbyCallback = function (customer) {
            self.spawnCharacterAndMoveToLobbyNow(customer);
        };
        this.world.customerLeaveCallback = function (customer) {
            // kaching.play();
            self.moveCustomerVisualFromRoom(customer);
        };

        this.world.doCleaningCallback = function (worker) {
            self.updateWorker(worker);
        };

        this.world.updateRoomStatusCallback = function (room) {
            self.updateRoomDirtyState(room);
        };

        this.world.bubbleCallback = function (customer, text) {
            self.openBubble(customer.sprite.position.x, customer.sprite.position.y, text);
        };

        this.cursors = game.input.keyboard.createCursorKeys();

        this.map = game.add.tilemap(ASSETS.TILES_PROTO_KARTE);
        this.map.addTilesetImage('HotelTileSet', ASSETS.TILESET_PROTO_KARTE);
        this.createLayers();
        this.onLayers(function (layer) {
            layer.resizeWorld();
        });


        this.cursors = game.input.keyboard.createCursorKeys();
        this.zoomButtons = game.input.keyboard.addKeys({'in': Phaser.KeyCode.L, 'down': Phaser.KeyCode.K});
        this.miscButtons = game.input.keyboard.addKeys({'shake': Phaser.KeyCode.O});

        game.input.onDown.add(this.addObject, this);
        game.input.onDown.add(this.openRoomMenuIfAny, this);

        this.backroundObjectGroup = game.add.group();
        this.entityGroup = game.add.group();
        this.infoHud = game.add.group();
        this.initStarsHud();
        this.initTimeHud();
        this.createNewsHud();
        this.menuHud = game.add.group();
        var text_style = {font: "20px Arial", fill: "#ffffff", align: "left"};

        var button_start_x = 20;
        var button_start_y = game.height - 120;
        var buyRoomButton = game.add.button(button_start_x, button_start_y, ASSETS.BUTTON_1, function () {
            var button_texts = [];
            var button_type = [];
            for (var room_it = 0; room_it < self.world.roomList.length; room_it++) {
                var room = self.world.roomList[room_it];
                if (!room.activated) {
                    button_texts.push(room.name + ' - ' + room.price_to_buy + '€');
                    button_type.push(room_it);
                }
            }
            self.openBuyMenu(function (room_cl) {
                self.activateRoom(room_cl)
            }, button_texts, button_type);

        }, this, 2, 1, 0);
        buyRoomButton.scale.x = 3;
        var scalY = 1.8;
        buyRoomButton.scale.y = scalY;
        buyRoomButton.fixedToCamera = true;
        this.menuHud.add(buyRoomButton);
        var buyRoomsText = game.add.text(button_start_x + 35, button_start_y + 12, "BUY ROOMS", text_style);
        buyRoomsText.fixedToCamera = true;
        this.menuHud.add(buyRoomsText);

        button_start_x += 200;
        var buyStaffButton = game.add.button(button_start_x, button_start_y, ASSETS.BUTTON_1, function () {
            var worker_texts = [];
            var worker_objects = [];
            for (var worker_it = 0; worker_it < self.world.workerList.length; worker_it++) {
                var worker_obj = self.world.workerList[worker_it];
                if (worker_obj.statusCurrent === WORKER_STATE.TO_HIRE) {
                    worker_texts.push(worker_obj.name + " - eff:" + worker_obj.quality + " - " + worker_obj.price + "€/d");
                    worker_objects.push(worker_obj);
                }
            }
            self.openBuyMenu(function (worker_cl_obj) {
                worker_cl_obj.statusCurrent = WORKER_STATE.IDLE;
                self.addWorker(worker_cl_obj);
            }, worker_texts, worker_objects);
        }, this, 2, 1, 0);
        buyStaffButton.scale.x = 3;
        buyStaffButton.scale.y = scalY;
        buyStaffButton.fixedToCamera = true;
        this.menuHud.add(buyStaffButton);
        var buyStaff = game.add.text(button_start_x + 35, button_start_y + 12, "HIRE STAFF", text_style);
        buyStaff.fixedToCamera = true;
        this.menuHud.add(buyStaff);

        button_start_x += 200;
        var buyUpgradeButton = game.add.button(button_start_x, button_start_y, ASSETS.BUTTON_1, function () {
            var global_features = this.world.getGlobalFeatureValues();
            var global_feature_texts = [];
            var global_feature_type = [];
            for (var global_feature_it = 0; global_feature_it < global_features.length; global_feature_it++) {
                var global_feature = global_features[global_feature_it];
                global_feature_texts.push((global_feature.active ? '[x]' : '[  ]') + '  ' + global_feature.name + ' - ' +global_feature.price+"€" );
                global_feature_type.push(global_feature.name);
            }
            self.openBuyMenu(function (global_upgrade) {
                var global_upgrade_obj = self.world.getGlobalFeatureForValue(global_upgrade)
                if (!global_upgrade_obj.active && global_upgrade_obj.price <= self.world.money) {
                    self.world.buyGlobalUpgrade(global_upgrade);
                } else {
                    self.openMessageBox('cannot buy not enough money');
                }

            }, global_feature_texts, global_feature_type);
        }, this, 2, 1, 0);
        buyUpgradeButton.scale.x = 3.6;
        buyUpgradeButton.scale.y = scalY;
        buyUpgradeButton.fixedToCamera = true;
        var buyUpgradeText = game.add.text(button_start_x + 35, button_start_y + 12, "BUY UPGRADES", text_style);
        buyUpgradeText.fixedToCamera = true;
        this.menuHud.add(buyUpgradeButton);
        this.menuHud.add(buyUpgradeText);


        //day/night
        // var nightSprite = game.add.sprite(0,0,ASSETS.NIGHT);
        // nightSprite.scale.x = game.width;
        // nightSprite.scale.y = game.height;
        // nightSprite.alpha = 0;
        // nightSprite.fixedToCamera = true;
        // var tween = game.add.tween(nightSprite).to({alpha:0.5},GAMELOGIC.MSPERDAY);
        // tween.start();
        //
    },


    update: function () {
        this.inputHandling();
        this.updateBuildCursor();
        this.world.update(game.time.elapsed);
        this.updateTimeHud();
        this.updateStarsHudFromWorld();
        this.updateMoneyHudFromWorld();
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
            game.camera.shake();
            this.postNews("You are broke.");
        }
    },

    moveCustomerVisualFromRoom: function (character) {
        if (character.sprite) {
            var lobbyX = 760;
            var lobbyY = 750;

            var nameTag = character.nameTag;

            if (character.chosenRoom) {
                var toLobby = game.add.tween(character.sprite).to({
                    x: lobbyX,
                    y: lobbyY
                }, 2000, Phaser.Easing.Quadratic.InOut, false);
                var toLobbyTag = game.add.tween(nameTag).to({
                    x: lobbyX,
                    y: lobbyY
                }, 2000, Phaser.Easing.Quadratic.InOut, false);
                var awaaaaay = game.add.tween(character.sprite).to({
                    x: lobbyX,
                    y: 2000
                }, 2000, Phaser.Easing.Quadratic.InOut, false);
                var awaaaaayTag = game.add.tween(nameTag).to({
                    x: lobbyX,
                    y: 2000
                }, 2000, Phaser.Easing.Quadratic.InOut, false);
                toLobby.chain(awaaaaay);
                toLobbyTag.chain(awaaaaayTag);
                toLobby.start();
                toLobbyTag.start();
            } else {
                game.add.tween(character.sprite).to({x: lobbyX, y: 1000}, 2000, Phaser.Easing.Quadratic.InOut, true);
                game.add.tween(nameTag).to({x: lobbyX, y: 1000}, 2000, Phaser.Easing.Quadratic.InOut, true);
            }

        }
    },
    updateWorker: function (worker) {
        console.log(worker.workTaskRoom);
        if (worker.workTaskRoom) {
            var room = worker.workTaskRoom;
            {
                var roomCenterX = (room.posX + room.length / 2) * TILE.SIZE - TILE.SIZE / 2;
                var roomCenterY = (room.posY + room.height / 2) * TILE.SIZE - TILE.SIZE / 2;


                var person = worker.sprite;
                var nameTag = worker.nameTag;

                game.add.tween(person).to({x: roomCenterX, y: roomCenterY}, 2000, Phaser.Easing.Quadratic.InOut, true);
                game.add.tween(nameTag).to({x: roomCenterX, y: roomCenterY}, 2000, Phaser.Easing.Quadratic.InOut, true);
            }
        } else {//move to lobby
            var lobbyX = 19 * 32 + (Math.random() * 7 * 32);
            var lobbyY = 19 * 32 + (Math.random() * 5 * 32);


            var person = worker.sprite;
            var nameTag = worker.nameTag;

            game.add.tween(person).to({x: lobbyX, y: lobbyY}, 2000, Phaser.Easing.Quadratic.InOut, true);
            game.add.tween(nameTag).to({x: lobbyX, y: lobbyY}, 2000, Phaser.Easing.Quadratic.InOut, true);
        }
    },
    updateRoomDirtyState: function (room) {

        var asset = null;
        if (room.statusCurrent == "free" && room.sprite) {
            room.sprite.destroy();
        }
        if (room.statusCurrent == 'dirty') {
            var roomCenterX = (room.posX + room.length / 2) * TILE.SIZE - TILE.SIZE / 2;
            var roomCenterY = (room.posY + room.height / 2) * TILE.SIZE - TILE.SIZE / 2;
            room.sprite = game.add.sprite(roomCenterX, roomCenterY, ASSETS.DIRT);
            this.backroundObjectGroup.add(room.sprite);
        }

    },

    addWorker: function (worker) {
        var number = Math.random();
        var asset = ASSETS.CHAR_WORKER_F;
        if (number < 0.5) {
            asset = ASSETS.CHAR_WORKER_M;
        }
        var person = game.add.sprite(760, 800, asset); //somewhere in lobby
        this.entityGroup.add(person);
        var style = {font: "14px Arial", fill: "#000000", align: "left"};
        var nameTag = game.add.text(760, 800, worker.name, style);
        nameTag.anchor.x = 0.5;
        nameTag.anchor.y = 0.5;
        this.entityGroup.add(nameTag);
        person.scale.x = 1.2;
        person.scale.y = 1.2;
        worker.sprite = person;
        worker.nameTag = nameTag;

        this.updateWorker(worker);
    },

    spawnCharacterAndMoveToLobbyNow: function (character) {
        var lobbyX = 19 * 32 + (Math.random() * 7 * 32);
        var lobbyY = 19 * 32 + (Math.random() * 5 * 32);
        var number = Math.random();
        var asset = null;
        if (number < 0.5) {
            asset = ASSETS.CHAR_OLD;
        } else {
            asset = ASSETS.CHAR_GEN;
        }
        var person = game.add.sprite(760, 800, asset); //somewhere in lobby

        var style = {font: "14px Arial", fill: "#000000", align: "left"};
        var nameTag = game.add.text(760, 800, character.name, style);


        nameTag.anchor.x = 0.5;
        nameTag.anchor.y = 0.5;
        person.scale.x = 1.2;
        person.scale.y = 1.2;
        // statsWindow.scale.y = 0.5;
        // statsWindow.scale.x = 0.5;
        character.sprite = person;
        character.sprite.inputEnabled = true;
        character.sprite.events.onInputDown.add(this.openStatsWindow(character), this);
        character.nameTag = nameTag;
        character.statsWindowOpen = true;
        this.entityGroup.add(nameTag);
        this.entityGroup.add(person);
        game.add.tween(person).to({x: lobbyX, y: lobbyY}, 2000, Phaser.Easing.Quadratic.InOut, true);
        game.add.tween(nameTag).to({x: lobbyX, y: lobbyY}, 2000, Phaser.Easing.Quadratic.InOut, true);

    },


    moveToRoom: function (character) {
        var room = null;
        var roomName = character.chosenRoom.name;

        for (var i = 0; i < this.world.roomList.length; i++) {
            var candidateRoom = this.world.roomList[i];
            if (candidateRoom.name === roomName) {
                room = candidateRoom;
            }
        }
        if (room) {
            var roomCenterX = (room.posX + room.length / 2) * TILE.SIZE - TILE.SIZE / 2;
            var roomCenterY = (room.posY + room.height / 2) * TILE.SIZE - TILE.SIZE / 2;


            var person = character.sprite;
            var nameTag = character.nameTag;

            game.add.tween(person).to({x: roomCenterX, y: roomCenterY}, 2000, Phaser.Easing.Quadratic.InOut, true);
            game.add.tween(nameTag).to({x: roomCenterX, y: roomCenterY}, 2000, Phaser.Easing.Quadratic.InOut, true);
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
        if (this.roomMenuHud != null) {
            this.roomMenuHud.destroy();
            this.roomMenuHud = null;
        }
    },

    createBuildMenu: function (room) {
        var featureCount = 0;
        var self = this;

        if (self.roomMenuHud || self.buildMarker != null || self.buyMenuHud != null || !room.activated || self.messageBox != null) {
            return;
        }

        function addFeatureOption(name, value, bought, notPlaceable, feature_type) {
            var style = {font: "20px Arial", fill: "#ffffff", align: "left"};

            if (bought) {
                style.fill = "gray"
            }
            function click_button() {
                self.close_build_menu();
                //TODO: check if there is money
                if (!notPlaceable) {
                    if (!bought) {
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
            button.alpha = 0;
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
        this.menuHud.add(this.roomMenuHud);
        var offsetLeft = game.width / 2;
        var sprite = game.add.sprite(offsetLeft, 10, ASSETS.MENU_TOP);
        sprite.scale.x = 2;
        sprite.fixedToCamera = true;
        var sprite_bg = game.add.sprite(offsetLeft, 10 + TILE.SIZE * 2, ASSETS.MENU_CENTER);
        sprite_bg.scale.x = 2;
        sprite_bg.scale.y = 10;
        sprite_bg.fixedToCamera = true;


        var style = {font: "25px Arial", fill: "#ffffff", align: "left"};
        var padding = 20;
        var btnClose = game.add.button(game.width - 50, 20, ASSETS.DUMMY_BUTTON, self.close_build_menu, this, 2, 1, 0);
        btnClose.alignIn(sprite, Phaser.TOP_RIGHT, 0, 0);
        btnClose.alpha = 0;
        btnClose.fixedToCamera = true;
        var closex = game.add.text(game.width - 40, 20, "X", style);
        closex.alignIn(btnClose, Phaser.CENTER, 0, 0);
        closex.fixedToCamera = true;

        function set_price() {
            room.price = parseInt(prompt("Please enter a price for the room", room.price));
            setPrice.text = room.price + "€";
        }

        var btnSetPrice = game.add.button(game.width - 250, 20, ASSETS.DUMMY_BUTTON, set_price, this, 2, 1, 0);
        btnSetPrice.scale.x = 2.5;
        btnSetPrice.alpha = 0;
        btnSetPrice.alignIn(sprite, Phaser.TOP_RIGHT, -100, 0);
        btnSetPrice.fixedToCamera = true;
        console.log(room);
        var setPrice = game.add.text(game.width - 240, 20, room.price + "€", style);
        setPrice.alignIn(btnSetPrice, Phaser.CENTER, 0, 0);
        setPrice.fixedToCamera = true;


        var title = game.add.text(offsetLeft + padding, 20, room.name, style);
        title.fixedToCamera = true;
        var sprite_end = game.add.sprite(offsetLeft, 10, ASSETS.MENU_TOP);
        sprite_end.scale.x = 2;
        sprite_end.anchor.setTo(1, 1);
        sprite_end.angle = 180;
        sprite_end.alignTo(sprite_bg, Phaser.BOTTOM_LEFT, sprite.width, -1 * sprite_end.height);
        sprite_end.fixedToCamera = true;
        this.roomMenuHud.add(sprite_end);

        this.roomMenuHud.add(sprite);
        this.roomMenuHud.add(sprite_bg);
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
        addFeatureOption("AC Unit", this.world.ACUNIT_PRICE, features[9], false, SINGLE_FEATURE_TYPE.ACUNIT);

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
        var self =this

        function click() {
            var start = Math.max(0,this.newsHistory.length-10);
            self.openMessageBox(this.newsHistory.splice(start,this.newsHistory.length - start),2,1);
        }

        var button = game.add.button(10, 10, ASSETS.DUMMY_BUTTON, click, this, 2, 1, 0);
        button.scale.setTo(10, 1.1);
        button.fixedToCamera = true;

        var style = {font: "20px Arial", fill: "#FFFFFF", align: "left"};
        var text = game.add.text(15, 15, "News", style);
        text.anchor.set(0);
        text.fixedToCamera = true;
        var style_txt = {font: "14px Arial", fill: "#FFFFFF", align: "left"};
        this.news_text = game.add.text(15, 45, text, style_txt);
        this.news_text.alpha = 0;
        this.news_text.fixedToCamera = true;
        this.newsHudMenu.add(button);
        this.newsHudMenu.add(text);
        this.newsHudMenu.add(this.news_text);
        this.infoHud.add(this.newsHudMenu);
    },


    postNews: function (text) {
        var text2 = this.dayandtime + ": " + text;

        this.newsHistory.push(text2);
        var tween1 = game.add.tween(this.news_text).to({alpha: 0}, 2000);

        function setText() {
            this.news_text.text = text2;
        }

        tween1.onComplete.add(setText, this);
        var tween3 = game.add.tween(this.news_text).to({alpha: 1}, 2000);

        tween1.chain(tween3);
        tween1.start();

    },

    initStarsHud: function () {
        var starCount = 5;
        var starOffset = 60;
        for (var i = 0; i <= starCount; i++) {
            var star = game.add.sprite(game.width - i * starOffset, 10, ASSETS.STAR);
            var star_gray = game.add.sprite(game.width - i * starOffset, 10, ASSETS.STAR);
            this.stars.push(star);
            star.fixedToCamera = true;
            star_gray.fixedToCamera = true;
            star_gray.alpha = 0.3;
            this.infoHud.add(star_gray);
            this.infoHud.add(star);
        }
    },

    initTimeHud: function () {
        var style = {font: "25px Arial", fill: "#000000", align: "left"};
        this.delta = 0;
        this.timeTextField = game.add.text(game.width - 460, 15, "", style);
        this.timeTextField.fixedToCamera = true;
    },
    updateTimeHud: function () {
        this.delta += game.time.elapsed;
        var timeDelta = this.delta % GAMELOGIC.MSPERDAY;
        var timeInHours = parseInt((timeDelta / GAMELOGIC.MSPERDAY) * 24);
        if (timeInHours < 10) {
            timeInHours = '0' + timeInHours;
        }
        this.world.daysPassed = parseInt(this.delta / GAMELOGIC.MSPERDAY);
        var text = 'Day ' + this.world.daysPassed + ', ' + timeInHours + ':00';
        this.dayandtime = text;
        this.timeTextField.text = text;

    }
    ,
    updateMoneyHudFromWorld: function () {
        var text_info = this.world.money + "€";
        if (this.moneyText) {
            this.moneyText.text = text_info;
            return;
        }
        var style = {font: "25px Arial", fill: "#000000", align: "left"};
        this.moneyText = game.add.text(game.width - 28, 45, text_info, style);
        this.moneyText.anchor.x = 1;
        this.moneyText.anchor.y = 0;
        this.moneyText.fixedToCamera = true;
        this.infoHud.add(this.moneyText);
    },

    updateStarsHudFromWorld: function () {

        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.alpha = this.world.stars < i;// <= this is my favourite line of code.
        }
    },

    activateRoom: function (index) {
        var roomToActivate = this.world.roomList[index];
        if (!roomToActivate.activated) {
            roomToActivate.activated = true;
            var copyTile = this.map.getTile(3, 0, this.wallLayer);
            for (var x = roomToActivate.posX - 1; x < roomToActivate.length + roomToActivate.posX + 1; x++) {
                gameState.map.putTile(copyTile, x, roomToActivate.posY - 1, this.wallLayer);
                gameState.map.putTile(copyTile, x, roomToActivate.posY + roomToActivate.height, this.wallLayer);
            }
            for (var y = roomToActivate.posY - 1; y < roomToActivate.height + roomToActivate.posY; y++) {
                gameState.map.putTile(copyTile, roomToActivate.posX - 1, y, this.wallLayer);
                gameState.map.putTile(copyTile, roomToActivate.posX + roomToActivate.length, y, this.wallLayer);
            }
        } else {
            console.error('could not activate room already activated');
        }
    },

    activateBuildCursor: function (type, room) {
        var width = 1;
        var height = 1;
        this.buildSpriteGroup = game.add.group();
        this.buildSpriteGroup.u_diff_size = false;
        this.buildSpriteGroup.u_drawcallback = function () {
            console.log('drawcallback called but not implemented ')
        };
        if (type == SINGLE_FEATURE_TYPE.SINGLE_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
        } else if (type == SINGLE_FEATURE_TYPE.DOUBLE_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
            height = 2;
        } else if (type == SINGLE_FEATURE_TYPE.LUXURY_BED) {
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            this.addBedSpriteToGroup(this.buildSpriteGroup);
            width = 3;
            height = 3;
        } else if (type == SINGLE_FEATURE_TYPE.CHILD_BED) {
            this.addChildBedSpriteToGroup(this.buildSpriteGroup);
            width = 2;
        } else if (type == SINGLE_FEATURE_TYPE.PLANT) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.PLANT));
        } else if (type == SINGLE_FEATURE_TYPE.VIEW) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.VIEW));
        } else if (type == SINGLE_FEATURE_TYPE.ENTERTAINMENT) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.TV));
        } else if (type == SINGLE_FEATURE_TYPE.ACUNIT) {
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.AC_UNIT));
        } else if (type == SINGLE_FEATURE_TYPE.BATH) {
            this.buildSpriteGroup.u_diff_size = true;
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.SHOWER));
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.TOILET));
            this.buildSpriteGroup.add(game.add.sprite(0, 0, ASSETS.SINK));
            width = 2;
            height = 4;
            this.buildSpriteGroup.u_drawcallback = function (group, x, y) {
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
        var roomRect = game.add.graphics();
        roomRect.lineStyle(2, color, 1);
        roomRect.drawRect(room.posX * TILE.SIZE, room.posY * TILE.SIZE, TILE.SIZE * room.length, TILE.SIZE * room.height);
        this.buildSpriteGroup.add(roomRect);

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
            if (!this.buildSpriteGroup.u_diff_size) {
                //move build sprite
                for (var it_group_child_x = 0; it_group_child_x < this.buildMarker.u_width; it_group_child_x++) {
                    for (var it_group_child_y = 0; it_group_child_y < this.buildMarker.u_height; it_group_child_y++) {
                        var group_child = this.buildSpriteGroup.children[it_group_child_x + it_group_child_y * this.buildMarker.u_width];
                        group_child.x = x + TILE.SIZE * it_group_child_x;
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
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.ACUNIT) {
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.AC_UNIT));
                } else if (this.buildMarker.u_type == SINGLE_FEATURE_TYPE.BATH) {
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.SHOWER));
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.TOILET));
                    sprite_group.add(game.add.sprite(0, 0, ASSETS.SINK));
                } else {
                    console.error('type not found for placement');
                }
                this.backroundObjectGroup.add(sprite_group);
                //write tile as blocker for building
                var currentTile = this.map.getTile(tileX, tileY, this.floorLayer);
                for (var it_bl_tile_x = 0; it_bl_tile_x < this.buildMarker.u_width; it_bl_tile_x++) {
                    for (var it_bl_tile_y = 0; it_bl_tile_y < this.buildMarker.u_height; it_bl_tile_y++) {
                        this.map.putTile(currentTile, tileX + it_bl_tile_x, tileY + it_bl_tile_y, this.objectLayer);
                        if (!this.buildSpriteGroup.u_diff_size) {
                            var group_child_block = sprite_group.children[it_bl_tile_x + it_bl_tile_y * this.buildMarker.u_width];
                            group_child_block.x = x + TILE.SIZE * it_bl_tile_x;
                            group_child_block.y = y + TILE.SIZE * it_bl_tile_y;
                        }
                    }
                }
                if (this.buildSpriteGroup.u_diff_size) {
                    this.buildSpriteGroup.u_drawcallback(sprite_group, x, y);
                }


                this.deactivateBuildCursor();
            } else if (game.input.mousePointer.isDown) {
                this.deactivateBuildCursor();
            }
        }
    },


    addBedSpriteToGroup: function (group) {
        var bed_end_sprite = game.add.sprite(0, 0, ASSETS.BED_HEAD);
        var bed_middle_sprite = game.add.sprite(0, 0, ASSETS.BED_MIDDLE).alignTo(bed_end_sprite, Phaser.RIGHT_CENTER, 0);
        var bed_head_sprite = game.add.sprite(0, 0, ASSETS.BED_END).alignTo(bed_middle_sprite, Phaser.RIGHT_CENTER, 0);
        group.add(bed_head_sprite);
        group.add(bed_middle_sprite);
        group.add(bed_end_sprite);
    },
    addChildBedSpriteToGroup: function (group) {
        var bed_end_sprite = game.add.sprite(0, 0, ASSETS.BED_HEAD);
        var bed_head_sprite = game.add.sprite(0, 0, ASSETS.BED_END).alignTo(bed_end_sprite, Phaser.RIGHT_CENTER, 0);
        group.add(bed_head_sprite);
        group.add(bed_end_sprite);
    },

    openBuyMenu: function (click_callback, button_texts, button_types) {
        var self = this;
        if (this.buyMenuHud != null) {
            self.closeBuyMenu();
        }

        this.buyMenuHud = game.add.group();
        var offsetLeft = game.width / 2;
        var offsetTop = 10;
        var sprite_top = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_TOP);

        sprite_top.fixedToCamera = true;
        sprite_top.scale.x = 1.5;
        this.buyMenuHud.add(sprite_top);
        offsetTop += TILE.SIZE;
        var button_offset = offsetTop;
        var sprite_center = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_CENTER);
        sprite_center.scale.y = 10;
        sprite_center.scale.x = 1.5;
        offsetTop += TILE.SIZE * 20;
        sprite_center.fixedToCamera = true;
        this.buyMenuHud.add(sprite_center);
        var sprite_bottom = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_TOP);
        sprite_bottom.fixedToCamera = true;
        sprite_bottom.anchor.setTo(1, 1);
        sprite_bottom.angle = 180;
        sprite_bottom.scale.x = 1.5;
        this.buyMenuHud.add(sprite_bottom);

        var text_style = {font: "20px Arial", fill: "#ffffff", align: "left"};
        var closeButton = game.add.button(offsetLeft, button_offset, ASSETS.MENU_BG, function () {
            self.closeBuyMenu();
        }, this, 2, 1, 0);
        closeButton.scale.y = 25;
        closeButton.scale.x = 25;
        closeButton.alpha = 0;
        closeButton.alignIn(sprite_top, Phaser.TOP_RIGHT, -15, -15);
        closeButton.fixedToCamera = true;
        this.buyMenuHud.add(closeButton);
        var closeButtonText = game.add.text(offsetLeft + 35, button_offset, 'X', text_style);
        closeButtonText.alignIn(closeButton, Phaser.CENTER);
        closeButtonText.fixedToCamera = true;
        this.buyMenuHud.add(closeButtonText);


        if (button_texts.length != button_types.length) {
            console.log('error cannot render buttons types and texts not matching')
        } else {
            for (var button_render_it = 0; button_render_it < button_texts.length; button_render_it++) {
                var button_text = button_texts[button_render_it];
                var button_type = button_types[button_render_it];
                var callback = function (button_type_t) {
                    return function () {
                        self.closeBuyMenu();
                        click_callback(button_type_t);
                    };
                };
                var buyUpgradeButton = game.add.button(offsetLeft, button_offset, ASSETS.MENU_BG, callback(button_type), this, 2, 1, 0);
                buyUpgradeButton.scale.y = TILE.SIZE * 1.1;
                buyUpgradeButton.scale.x = TILE.SIZE * 8;
                buyUpgradeButton.alpha = 0;
                buyUpgradeButton.fixedToCamera = true;
                this.buyMenuHud.add(buyUpgradeButton);


                var buyUpgradeText = game.add.text(offsetLeft + 35, button_offset, button_text, text_style);
                buyUpgradeText.fixedToCamera = true;
                this.buyMenuHud.add(buyUpgradeText);
                button_offset += TILE.SIZE * 1.2;
            }


        }

    },

    closeBuyMenu: function () {
        this.buyMenuHud.destroy();
        this.buyMenuHud = null;

    },

    openMessageBox: function (text, xScale, yScale, position) {
        var self = this;
        self.close_build_menu();
        if (this.messageBox != null) {
            self.closeMessageBox();
        }
        if (text.hasOwnProperty('isArray') && !text.isArray()) {
            text = [text];
        }

        this.messageBox = game.add.group();
        var offsetLeft = position == undefined ? (game.width / 2) : position.x;
        var offsetTop = position == undefined ? (game.height / 4) : position.y;
        var scaleX = xScale == undefined ? 1 : xScale;
        var scaleY = yScale == undefined ? 1 : yScale;
        var sprite_top = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_TOP);

        sprite_top.fixedToCamera = true;
        sprite_top.scale.x = scaleX;
        this.messageBox.add(sprite_top);

        var button_offset = offsetTop;
        for (var i = 0; i < Math.max(text.length / 2,1); i++) {
            offsetTop += TILE.SIZE*2;
            console.log(button_offset);
            var sprite_center = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_CENTER);
            // sprite_center.scale.y = scaleY;
            sprite_center.scale.x = scaleX;
            sprite_center.scale.y = yScale;
            sprite_center.fixedToCamera = true;
            this.messageBox.add(sprite_center);
        }

        offsetTop += TILE.SIZE * 2;
        var sprite_bottom = game.add.sprite(offsetLeft, offsetTop, ASSETS.MENU_BOTTOM);
        sprite_bottom.fixedToCamera = true;
        sprite_bottom.scale.x = scaleX;
        sprite_bottom.fixedToCamera = true;
        this.messageBox.add(sprite_bottom);

        var text_style = {font: "15px Arial", fill: "#ffffff", align: "left"};
        var closeButton = game.add.button(offsetLeft, button_offset, ASSETS.MENU_BG, function () {
            self.closeMessageBox();
        }, this, 2, 1, 0);
        closeButton.scale.y = 25;
        closeButton.scale.x = 25;
        closeButton.alpha = 0;
        closeButton.alignIn(sprite_top, Phaser.TOP_RIGHT, -15, -15);
        closeButton.fixedToCamera = true;
        this.messageBox.add(closeButton);
        var closeButtonText = game.add.text(offsetLeft + 35, button_offset, 'X', text_style);
        closeButtonText.alignIn(closeButton, Phaser.CENTER);
        closeButtonText.fixedToCamera = true;
        this.messageBox.add(closeButtonText);

        console.log(button_offset);
        for (var text_it = 0; text_it < text.length; text_it++) {
            var text_str = text[text_it];
            var message_text = game.add.text(offsetLeft + 10, button_offset + 45 * text_it, text_str, text_style);
            message_text.alignIn(sprite_top, Phaser.CENTER, 0, 30 * text_it);
            message_text.fixedToCamera = true;
            this.messageBox.add(message_text);
        }


    },

    closeMessageBox: function () {
        this.messageBox.destroy();
        this.messageBox = null;
    },

    moveGroup: function (group, toX, toY, duration) {
        for (var stats_window_it = 0; stats_window_it < group.children.length; stats_window_it++) {
            var stats_window_obj = group.children[stats_window_it];
            console.log(stats_window_obj);
            game.add.tween(stats_window_obj).to({x: toX, y: toY}, 2000, Phaser.Easing.Quadratic.InOut, true);
        }
    },

    openStatsWindow: function (char) {
        var self = this;
        return function () {
            console.log(char);
            var texts = [];
            texts.push(char.name);
            var req_str = 'Wants: ' + char.requirementArray.join(', ');
            texts.push(req_str);
            var position = {};
            position.x = game.width / 3;
            position.y = game.height / 4;
            self.openMessageBox(texts, 2, 1, position)
        }
    },


    openBubble: function (posX, posY, text) {
        var bubbleGroup = game.add.group();
        var text_style = {font: "13px Arial", fill: "#000000", align: "left"};
        // message_text.alignIn(bubble_sprite, Phaser.CENTER, 0, 0);
        var bubble_sprite = game.add.sprite(posX, posY - TILE.SIZE * 2, ASSETS.MENU_BUBBLE);
        bubble_sprite.scale.x = 0.7;
        bubble_sprite.scale.y = 0.7;
        var message_text = game.add.text(posX + 30, posY-30, text, text_style);
        bubbleGroup.add(bubble_sprite);
        bubbleGroup.add(message_text);
        var fadeOutTween = game.add.tween(bubbleGroup).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true, 0, 0, false);
        fadeOutTween.onComplete.add(function () {
            bubbleGroup.destroy();
            bubbleGroup = null;
        }, this);
        this.entityGroup.add(bubbleGroup);
    }
};





