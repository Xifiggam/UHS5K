/**
 * Created by Veit on the Death S.
 */

var gameWorld = {

    guestList: [],
    roomList: [],
    workerList: [],
    reviewList: [],
    globalUpgradesArray: ["wifi_room", "wifi_lobby", "seminarRoom", "massageParlor", "sauna", "saunaPlus", "pool", "outdoorPool", "fitnessStudio", "hotelBar", "restaurant"],
    localUpgradesArray: [SINGLE_FEATURE_TYPE.SINGLE_BED, SINGLE_FEATURE_TYPE.DOUBLE_BED, SINGLE_FEATURE_TYPE.CHILD_BED, SINGLE_FEATURE_TYPE.LUXURY_BED, SINGLE_FEATURE_TYPE.PLANT, SINGLE_FEATURE_TYPE.VIEW, SINGLE_FEATURE_TYPE.ENTERTAINMENT, SINGLE_FEATURE_TYPE.BATH, SINGLE_FEATURE_TYPE.MINIBAR, SINGLE_FEATURE_TYPE.ACUNIT],
    money: 10000,
    stars: 1,
    guestToDelete: null,
    toDelete: false,
    daysPassed: 0,


    GLOBAL_FEATURE_TYPE: {
        WIFI_ROOM: new GlobalFeatureType('wifi_room', 'Wifi in all Rooms', 1000),
        WIFI_LOBBY: new GlobalFeatureType('wifi_lobby', 'Wifi in the Lobby', 100),
        SEMINAR_ROOM: new GlobalFeatureType('seminarRoom', 'Seminar Room', 100),
        MASSAGE_PARLOR: new GlobalFeatureType('massageParlor', 'Massage room', 1000),
        SAUNA: new GlobalFeatureType('sauna', 'Sauna', 1000),
        SAUNA_PLUS: new GlobalFeatureType('saunaPlus', 'Sauna +', 2000),
        POOL: new GlobalFeatureType('pool', 'Pool', 2000),
        OUTDOOR_POOL: new GlobalFeatureType('outdoorPool', 'Outdoor Pool', 2000),
        FINESS_STUDIO: new GlobalFeatureType('fitnessStudio', 'Fitness Studio', 1000),
        HOTEL_BAR: new GlobalFeatureType('hotelBar', 'Hotel Bar', 1000),
        RESTAURANT: new GlobalFeatureType('restaurant', 'Restaurant', 1000)
    },

    // Room Upgrade Prices
    SINGLEBED_PRICE: 250,
    DOUBLEBED_PRICE: 500,
    CHILDBED_PRICE: 200,
    LUXURYBED_PRICE: 500,
    PLANT_PRICE: 100,
    VIEW_PRICE: 1000,
    ENTERTAINMENT_PRICE: 700,
    BATH_PRICE: 700,
    MINIBAR_PRICE: 400,
    ACUNIT_PRICE: 800,

    init: false,


    update: function (deltaTime) {
        if (!this.init) {
            init();
            this.init = true;
        }

        if (this.reviewList.length > 8) {
            countingReviewsNo = (this.reviewList.length / 2 + 4);
            reviewCount = 0;
            for (var i = countingReviewsNo - 1; i >= 0; i--) {
                reviewCount += this.reviewList[i];
            }
            this.stars = Math.floor(reviewCount / countingReviewsNo);
        }

        numberOfActivatedRooms = 0;
        alength = this.roomList.length;
        for (i = 0; i < alength; i++) {
            this.roomList[i].update(deltaTime);
            if (this.roomList[i].activated) {
                numberOfActivatedRooms++;
            }
        }
        alength = this.workerList.length;
        for (i = 0; i < alength; i++) {
            this.workerList[i].update(deltaTime);
        }
        alength = this.guestList.length;
        for (i = 0; i < alength; i++) {
            this.guestList[i].update(deltaTime);
        }
        if (alength < numberOfActivatedRooms) {
            if (Math.random() < (0.004 + (0.001 * this.stars))) {
                var guest = new Guest(generateName(1));
                gameWorld.guestList.push(guest);
                if (gameWorld.customerToLobbyCallback) {
                    gameWorld.customerToLobbyCallback(guest);
                }
                for (i = 0; i < gameWorld.roomList.length; i++) {
                    //console.log(gameWorld.roomList[i]);
                }
            }
        }
        if (this.toDelete) {
            this.guestList.splice(this.guestList.indexOf(this.guestToDelete), 1);
            // for (var i = 0; i < this.guestList.length; i++) {
            //     var obj = this.guestList[i];
            //     if(JSON.stringify(obj) === JSON.stringify(this.guestToDelete) ){
            //         this.guestList.splice(i,1);
            //     }
            // }
            this.toDelete = false;
        }
    },

    getGlobalFeatureForValue: function (feature) {
        //console.log('search feature', feature);
        var obj_values = Object.getOwnPropertyNames(this.GLOBAL_FEATURE_TYPE);
        for (var i = 0; i < obj_values.length; i++) {
            if (this.GLOBAL_FEATURE_TYPE[obj_values[i]].name === feature) {
                return this.GLOBAL_FEATURE_TYPE[obj_values[i]];
            }
        }
        return null;
    },

    getActiveGlobalFeatureNames: function () {
        var global_features = this.getGlobalFeatureValues();
        var global_feature_texts = [];
        for (var global_feature_it = 0; global_feature_it < global_features.length; global_feature_it++) {
            var global_feature = global_features[global_feature_it];
            if (global_feature.active) {
                global_feature_texts.push(global_feature.name);
            }
        }
        return global_feature_texts;
    },

    getGlobalFeatureValues: function () {
        var obj_values = Object.getOwnPropertyNames(this.GLOBAL_FEATURE_TYPE);
        var ret_values = [];
        for (var i = 0; i < obj_values.length; i++) {
            ret_values.push(this.GLOBAL_FEATURE_TYPE[obj_values[i]]);
        }
        return ret_values;
    },

    buyGlobalUpgrade: function (feature) {
        var feature_obj = this.getGlobalFeatureForValue(feature);
        if (feature_obj != null) {
            this.money = this.money - feature_obj.price;
            feature_obj.active = true;
            console.log('feature found' + feature, feature_obj);
        }
    },

    upgradeRoom: function (Room, feature) {
        console.log(Room, feature);
        switch (feature) {
            case SINGLE_FEATURE_TYPE.SINGLE_BED:
                Room.singleBed = true;
                this.money = this.money - this.SINGLEBED_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.DOUBLE_BED:
                Room.doubleBed = true;
                this.money = this.money - this.DOUBLEBED_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.CHILD_BED:
                Room.childBed = true;
                this.money = this.money - this.CHILDBED_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.LUXURY_BED:
                Room.luxuryBed = true;
                this.money = this.money - this.LUXURYBED_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.PLANT:
                Room.plant = true;
                this.money = this.money - this.PLANT_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.VIEW:
                Room.view = true;
                this.money = this.money - this.VIEW_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.ENTERTAINMENT:
                Room.entertainment = true;
                this.money = this.money - this.ENTERTAINMENT_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.BATH:
                Room.bath = true;
                this.money = this.money - this.BATH_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.MINIBAR:
                Room.minibar = true;
                this.money = this.money - this.MINIBAR_PRICE;
                break;
            case SINGLE_FEATURE_TYPE.ACUNIT:
                Room.acUnit = true;
                this.money = this.money - this.ACUNIT_PRICE;
                break;
        }
    }
};

function Guest(name) {
    this.name = name;
    this.statetime = 0;
    this.chosenRoom = null;
    this.alreadySaidSomething = false;
    this.reviewChance = 0.95;
    this.statisfaction = 0;
    this.comingTime = Math.random() * 5500;
    this.goingTime = Math.random() * 3000;
    this.maxRequirements = Math.min(gameWorld.daysPassed/4,10)+1;
    this.daysToStay = Math.floor((Math.random() * 3) + 1);
    this.noOfRequirements = Math.floor((Math.random() * this.maxRequirements) + 1);
    //console.log("New Customer: " + this.name + " #req: " + this.noOfRequirements);
    this.requirementArrayChoose = gameWorld.globalUpgradesArray.concat(gameWorld.localUpgradesArray);
    this.requirementArray = [];
    for (i = 0; i < this.noOfRequirements; i++) {
        x = Math.floor(Math.random() * this.requirementArrayChoose.length);
        this.requirementArray.push(this.requirementArrayChoose[x]);
        this.requirementArrayChoose.splice(x, 1);
    }


    bedchosen = false;
    for (var i = 0; i < this.requirementArray.length; i++) {
        var obj = this.requirementArray[i];
        if (obj === SINGLE_FEATURE_TYPE.SINGLE_BED || obj === SINGLE_FEATURE_TYPE.DOUBLE_BED || obj === SINGLE_FEATURE_TYPE.LUXURY_BED) {
            bedchosen = true;
            break;
        }
    }
    if (!bedchosen) {
        x = Math.random();
        if (x > 0.96) {
            this.requirementArray.push(SINGLE_FEATURE_TYPE.LUXURY_BED);
        }
        else if (x > 0.60) {
            this.requirementArray.push(SINGLE_FEATURE_TYPE.DOUBLE_BED);
        }
        else if (x > 0.1) {
            this.requirementArray.push(SINGLE_FEATURE_TYPE.SINGLE_BED);
        }
    }


    this.maximumPrice = Math.floor((Math.random() * 1000) + 100) + (Math.random() * gameWorld.stars * 50);
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.statusArray = ["coming", "going", "staying"];
    this.statusCurrent = "coming";

    this.update = function (deltaTime) {
        this.statetime += deltaTime;
        switch (this.statusCurrent) {
            case "coming":
                customer(this);
                if (this.statetime >= this.comingTime) {
                    this.statusCurrent = "going";
                    this.statisfaction = 0.1;
                    this.statetime = 0;
                    if (Math.random() < 0.10) {
                        this.writeReview();
                        //console.log("Guest not served review!");
                    }
                    var want_req = [];
                    for (var want_req_it = 0; want_req_it < this.requirementArray.length; want_req_it+=2) {
                        var req1 = this.requirementArray[want_req_it];
                        var req2 = want_req_it+1 < this.requirementArray.length ? ', ' + this.requirementArray[want_req_it+1] : ', ';
                        want_req.push(req1 + req2);
                    }
                    gameWorld.bubbleCallback(this, "Would be nice if you had at least one of \n" + want_req.join(", \n"), true);


                }
                break;
            case "going":
                if (this.statetime >= this.goingTime) {
                    gameWorld.toDelete = true;
                    gameWorld.guestToDelete = this;
                    if (gameWorld.customerLeaveCallback) {
                        gameWorld.customerLeaveCallback(this);
                    }
                }
                break;
            case "staying":
                if (this.statetime >= GAMELOGIC.MSPERDAY) {
                    if (!this.alreadySaidSomething) {
                        this.alreadySaidSomething = true;
                        var roomHas = this.chosenRoom.returnRoomFeaturesAsArray();
                        var customerWants = this.requirementArray;

                        var positive = {
                            "wifi_room": "Sweet, free wifi in the room.",
                        "wifi_lobby": "Nice, the wifi even works in the lobby.",
                        "seminarRoom": "Perfect work environment in the seminar room.",
                        "massageParlor": "Mmmhh, the massages are so relaxing.",
                        "sauna": "The sauna is hot, but it feels really good.",
                        "saunaPlus": "Haaaaah, that sauna+ just hits the spot!",
                            "pool": "Cool, a pool.",
                        "outdoorPool": "Cool, an outdoor pool.",
                        "fitnessStudio": "Yes, I can burn some calories in the gym.",
                        "hotelBar": "I like the bar’s whiskey selection.",
                        "restaurant": "The food in the restaurant is tasty.",
                        "singleBed": "Yes, my own appropriately sized bed.",
                        "doubleBed": "Perfect sized bed for me.",
                            "childBed": "Even a bed for a kid. The night is saved.",
                        "luxuryBed": "Perfect, so much space to sleep.",
                        "plant": "A little green brightens the room.",
                        "view": "What a beautiful view.",
                        "entertainment": "Nice  rustic TV set.",
                        "bath": "Such a clean bathroom.",
                        "minibar": "A cheap minibar, that’s a first.",
                        "acUnit": "Nice, I can adjust the temperature myself."};

                        var negative = {
                            "wifi_room": "No free wifi? Cheap bastards.",
                            "wifi_lobby": "No wifi in the lobby? Great start!",
                            "seminarRoom": "No seminar room? Where should I work?",
                            "massageParlor": "No massage parlor? That stresses me.",
                        "sauna": "No sauna? Where do they expect me to sweat?",
                            "saunaPlus": "No sauna+? Where do they expect me to cum?",
                            "pool": "Not even a pool? Poor!",
                            "outdoorPool": "No outdoor pool? Poor!",
                            "fitnessStudio": "No gym? Then I’ll have to rely on steroids.",
                        "hotelBar": "No bar? Now I have to stay sober in this lousy dump!",
                            "restaurant": "No restaurant? Do they want me to starve?",
                            "singleBed": "No single bed? I’ll not be able to sleep.",
                        "doubleBed": "No double bed? What a junky joint.",
                        "childBed": "No kids bed? My evening plans ruined.",
                        "luxuryBed": "No luxury bed? I expected better!",
                            "plant": "No plants? What a shoddy establishment?",
                            "view": "No view, only the hookers in the alley. What a trashy shack.",
                        "entertainment": "No TV? What should I fap to?",
                            "bath": "No bath? I guess I’ll pee on the floor.",
                        "minibar": "No minibar? I’m gagging for a drink.",
                        "acUnit": "No AC? I’ll freeze my ass off."
                        };
                        if(this.statisfaction< 0.5){
                            //TODO unhappy
                            var bad =arr_diff(roomHas,customerWants)[0];
                            console.log("bad" + bad);
                            gameWorld.bubbleCallback(this, negative[bad]);

                        }else{
                            var good = intersect_safe(roomHas,customerWants)[0];
                            console.log("good:" + good);
                            gameWorld.bubbleCallback(this, positive[good]);

                        }
                    }
                    //console.log(this.name + " " + "Room: " + this.chosenRoom + " M0ney: " + this.maximumPrice + " statetime: " + this.statetime + " No of NIghts: " + this.daysToStay);
                    this.daysToStay--;
                    gameWorld.money += this.chosenRoom.price;
                    kaching.play();
                    this.maximumPrice -= this.chosenRoom.price;
                    //console.log(this.daysToStay + " " + this.maximumPrice);
                    if (this.daysToStay <= 0 || this.maximumPrice <= 0) {
                        this.statusCurrent = "going";
                        if (Math.random() > 0.2) {
                            this.chosenRoom.statusCurrent = "dirty";
                            if (gameWorld.updateRoomStatusCallback) {
                                gameWorld.updateRoomStatusCallback(this.chosenRoom);
                            }
                        }
                        else {
                            this.chosenRoom.statusCurrent = "free";
                        }
                        if (gameWorld.customerLeaveCallback) {
                            gameWorld.customerLeaveCallback(this);
                        }
                        if (Math.random() < this.reviewChance) {
                            this.writeReview();

                        }
                    }
                    this.statetime = 0;
                }
                break;

        }
    };

    function arr_diff (a1, a2) {

        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    }

    function intersect_safe(a, b)
    {
        var ai=0, bi=0;
        var result = [];

        while( ai < a.length && bi < b.length )
        {
            if      (a[ai] < b[bi] ){ ai++; }
            else if (a[ai] > b[bi] ){ bi++; }
            else /* they're equal */
            {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }

        return result;
    }

    this.writeReview = function () {
        console.log("Statisfaction: " + this.statisfaction);
        this.starsForReview = Math.round(this.statisfaction * 0.2);
        someTempVariable = Math.random();
        if (someTempVariable > 0.7) {
            if (this.starsForReview < 5) {
                this.starsForReview++;
            }
        }
        else if (someTempVariable < 0.2) {
            if (this.starsForReview > 2) {
                this.starsForReview--;
            }
        }
        gameWorld.reviewList.push(this.starsForReview);
        console.log("New Review: " + this.starsForReview);
        if (gameWorld.newReviewCallback) {
            gameWorld.newReviewCallback("a new review was send - " + this.starsForReview + " Stars");
        }
        console.log("Review: " + this.starsForReview);
    };

}

// gets ["receptionist", "cleaning", "kitchen","bar", "masseur", "Chief Onanating Officer"] and randomly generates price and quality
function Worker(type) {
    this.statusArray = [WORKER_STATE.TO_HIRE, WORKER_STATE.IDLE, WORKER_STATE.WORKING];
    this.statusCurrent = WORKER_STATE.TO_HIRE;
    this.paymentIntervallCounter = 0;
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.name = generateName(1);
    this.statetime = 0;
    this.workTaskRoom = null;
    this.quality = Math.floor(Math.random() * 5) + 1;

    this.type = type;
    switch (this.type) {
        case "receptionist":
            this.price = Math.floor(((Math.random() * 150) + 50) * this.quality);
            break;
        case "cleaning":
            this.price = Math.floor(((Math.random() * 100) + 50) * this.quality);
            break;
        // case "kitchen":
        //     this.price = Math.floor(((Math.random() * 150) + 50)*this.quality);
        //     break;
        // case "bar":
        //     this.price = Math.floor(((Math.random() * 200) + 50)*this.quality);
        //     break;
        // case "masseur":
        //     this.price = Math.floor(((Math.random() * 200) + 50)*this.quality);
        //     break;
        // case "Chief Operating Officer":
        //     this.price = Math.floor(((Math.random() * 300) + 50)*this.quality);
        //     break;
    }
    this.quality = Math.floor((Math.random() * 5) + 1);
    this.cleanTaskTime = (10 - this.quality) * 2500;

    this.update = function (deltaTime) {
        this.statetime += deltaTime;
        if (this.statusCurrent != WORKER_STATE.TO_HIRE) {
            this.paymentIntervallCounter += deltaTime;
            if (this.paymentIntervallCounter >= GAMELOGIC.MSPERDAY) {
                gameWorld.money -= this.price;
                this.paymentIntervallCounter = 0;
            }
        }
        if (this.statusCurrent === WORKER_STATE.IDLE && this.type === "cleaning") {
            for (var i = 0; i < gameWorld.roomList.length; i++) {
                var obj = gameWorld.roomList[i];
                if (obj.statusCurrent === "dirty") {
                    this.statusCurrent = WORKER_STATE.WORKING;
                    obj.statusCurrent = "cleaning";
                    this.workTaskRoom = obj;
                    this.statetime = 0;
                    if (gameWorld.doCleaningCallback) {
                        gameWorld.doCleaningCallback(this);
                    }

                    break;
                }

            }
        }
        if (this.statusCurrent === "working" && this.type === "cleaning") {
            if (this.statetime >= this.cleanTaskTime) {
                this.statusCurrent = "idle";
                this.workTaskRoom.statusCurrent = "free";
                if (gameWorld.updateRoomStatusCallback) {
                    gameWorld.updateRoomStatusCallback(this.workTaskRoom);
                }
                this.workTaskRoom = null;
                this.statetime = 0;
                if (gameWorld.doCleaningCallback) {
                    gameWorld.doCleaningCallback(this);
                }
            }
        }

    };
}


function init() {

    var room = new Room();
    room.posX = 4;
    room.posY = 19;
    room.length = 6;
    room.height = 6;
    room.activated = true;
    room.name = "Room 101";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 11;
    room.posY = 19;
    room.length = 5;
    room.height = 6;
    room.activated = true;
    room.name = "Room 102";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 33;
    room.posY = 19;
    room.length = 5;
    room.height = 6;
    room.name = "Room 103";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 39;
    room.posY = 19;
    room.length = 7;
    room.height = 6;
    room.name = "Room 104";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 4;
    room.posY = 13;
    room.length = 4;
    room.height = 5;
    room.name = "Room 105";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 4;
    room.posY = 7;
    room.length = 4;
    room.height = 5;
    room.name = "Room Blue";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 4;
    room.posY = 1;
    room.length = 6;
    room.height = 5;
    room.name = "Room Red";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 11;
    room.posY = 1;
    room.length = 7;
    room.height = 5;
    room.name = "Suite \"Lukas\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 11;
    room.posY = 9;
    room.length = 5;
    room.height = 7;
    room.name = "Suite \"Gabe\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 17;
    room.posY = 9;
    room.length = 6;
    room.height = 7;
    room.name = "Suite \"Zelle\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 19;
    room.posY = 1;
    room.length = 11;
    room.height = 5;
    room.name = "Suite \"Phoe\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 26;
    room.posY = 9;
    room.length = 6;
    room.height = 7;
    room.name = "Suite \"Veit\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 31;
    room.posY = 1;
    room.length = 7;
    room.height = 5;
    room.name = "Suite \"Lorenz\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 39;
    room.posY = 1;
    room.length = 7;
    room.height = 5;
    room.name = "Baum des Lebens";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 41;
    room.posY = 7;
    room.length = 5;
    room.height = 5;
    room.name = "\"Spielzimmer\"";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 41;
    room.posY = 13;
    room.length = 5;
    room.height = 5;
    room.name = "Room 8541";
    gameWorld.roomList.push(room);

    var room = new Room();
    room.posX = 33;
    room.posY = 9;
    room.length = 5;
    room.height = 7;
    room.name = "Room 100";
    gameWorld.roomList.push(room);


    var worker1 = new Worker("cleaning");
    worker1.statusCurrent = WORKER_STATE.TO_HIRE;
    gameWorld.workerList.push(worker1);


    var worker2 = new Worker("cleaning");
    worker2.statusCurrent = WORKER_STATE.TO_HIRE;
    gameWorld.workerList.push(worker2);


    var worker3 = new Worker("cleaning");
    worker3.statusCurrent = WORKER_STATE.TO_HIRE;
    gameWorld.workerList.push(worker3);


    var worker4 = new Worker("cleaning");
    worker4.statusCurrent = WORKER_STATE.TO_HIRE;
    gameWorld.workerList.push(worker4);


    var worker5 = new Worker("cleaning");
    worker5.statusCurrent = WORKER_STATE.TO_HIRE;
    gameWorld.workerList.push(worker5);


}

function Room() {
    this.posX = 0;
    this.posY = 0;
    this.length = 0;
    this.height = 0;
    this.name = "No Room Name";
    this.price = 120;
    this.singleBed = false;
    this.doubleBed = false;
    this.childBed = false;
    this.luxuryBed = false;
    this.plant = false;
    this.view = false;
    this.entertainment = false;
    this.bath = false;
    this.minibar = false;
    this.acUnit = false;
    this.activated = false;
    this.price_to_buy = 1200;
    this.statusArray = ["free", "taken", "dirty", "cleaning"];
    this.statusCurrent = "free";

    this.getFeatures = function () {

        return [this.singleBed, this.doubleBed, this.childBed, this.luxuryBed, this.plant, this.view, this.entertainment, this.bath, this.minibar, this.acUnit];
    };

    this.returnRoomFeaturesAsArray = function () {
        var returnArray = [];
        if (this.singleBed) {
            returnArray.push(SINGLE_FEATURE_TYPE.SINGLE_BED);
        }
        if (this.doubleBed) {
            returnArray.push(SINGLE_FEATURE_TYPE.DOUBLE_BED);
        }
        if (this.childBed) {
            returnArray.push(SINGLE_FEATURE_TYPE.CHILD_BED);
        }
        if (this.luxuryBed) {
            returnArray.push(SINGLE_FEATURE_TYPE.LUXURY_BED);
        }
        if (this.plant) {
            returnArray.push(SINGLE_FEATURE_TYPE.PLANT);
        }
        if (this.view) {
            returnArray.push(SINGLE_FEATURE_TYPE.VIEW);
        }
        if (this.entertainment) {
            returnArray.push(SINGLE_FEATURE_TYPE.ENTERTAINMENT);
        }
        if (this.bath) {
            returnArray.push(SINGLE_FEATURE_TYPE.BATH);
        }
        if (this.minibar) {
            returnArray.push(SINGLE_FEATURE_TYPE.MINIBAR);
        }
        if (this.acUnit) {
            returnArray.push(SINGLE_FEATURE_TYPE.ACUNIT);
        }
        return returnArray;
    };

    this.update = function (deltaTime) {
        //Update Function
    };

    this.buy = function () {
        this.activated = true;
    }
}


//FUNCTION TAKES GUEST -> CHECKS HIS NEEDS AND GIVES BACK THE ROOM HE WANTS TO STAY IN AND HIS SATISFACTION. IT ALSO SETS THE ROOM TO BUSY.
function customer(guestObj) {

    var customerSatisfaction = 0; // 0 to 1 -> Erfüllte/Gestellte Wünsche
    var satisfiedRequirements = 0;
    var satisfactionArray = [];
    for (k = 0; k < gameWorld.roomList.length; k++) {
        if ((gameWorld.roomList[k].statusCurrent === "free" && gameWorld.roomList[k].activated === true) && (gameWorld.roomList[k].price <= guestObj.maximumPrice)) {
            for (i = 0; i < guestObj.requirementArray.length; i++) {
                for (j = 0; j < gameWorld.roomList[k].returnRoomFeaturesAsArray().length; j++) {
                    if (guestObj.requirementArray[i] === gameWorld.roomList[k].returnRoomFeaturesAsArray()[j]) {
                        satisfiedRequirements++;
                    }
                }
                for (j = 0; j < gameWorld.getActiveGlobalFeatureNames().length; j++) {
                    if (guestObj.requirementArray[i] === gameWorld.getActiveGlobalFeatureNames()[j]) {
                        satisfiedRequirements++;
                    }
                }
            }
        }
        satisfactionArray[k] = satisfiedRequirements / guestObj.noOfRequirements;
        satisfiedRequirements = 0;
    }
    var roomChosen = indexOfMax(satisfactionArray);
    guestObj.statisfaction = satisfactionArray[roomChosen];
    if (satisfactionArray[roomChosen] <= 0.3) {

    }
    else {
        gameWorld.roomList[roomChosen].statusCurrent = "taken";
        guestObj.statusCurrent = "staying";
        guestObj.chosenRoom = gameWorld.roomList[roomChosen];
        guestObj.statisfaction = satisfactionArray[roomChosen];
        if (gameWorld.customerArrivalCallback && guestObj.chosenRoom) {
            gameWorld.customerArrivalCallback(guestObj);
        }
    }
    //return [roomChosen, satisfactionArray[roomChosen]];
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}


function generateName(quantity) {
    var firstNames = [
        'Vinicius',
        'Talita',
        'Maria',
        'João',
        'José',
        'Marcos',
        'Donald',
        'Severius',
        'John',
        'Jack',
        'Jimmy',
        'Martha',
        'Bruce',
        'Clark',
        'Gal',
        'Gloria',
        'Vix',
        'Sterling',
        'Obi',
        'Lukas',
        'Lorenz',
        'Hassan',
        'Super'

    ];
    var middleNames = [
        'Costa',
        'Araújo',
        'Rodrigues',
        'Pereira',
        'Soares',
        'Linda',
        'Hidalgo',
        'Ruth',
        'Roald',
        'Linus', 'Hosé',
        'Mallory', 'Wan', 'Zelle', 'Adolf', 'Jussuf', '"The Killer"', '"Pump it Up!"'
    ];
    var lastNames = [
        'Pires',
        'Alves',
        'Álvares',
        'Moreira',
        'Ferreira',
        'Wayne',
        'Kent',
        'Trump',
        'Dahl',
        'Kenobi',
        'Skywalker',
        'Archer',
        'Schuerzenbacher',
        'Mario'

    ];

    var maxNames = firstNames.length * middleNames.length * lastNames.length;
    if (quantity > maxNames) {
        throw "Quantity greater than possible matches. Possible matches: " + maxNames;
    }
    var names = [];
    while (names.length < quantity) {
        var name = "";
        var first = Math.floor(Math.random() * firstNames.length);
        name += firstNames[first];
        var middle = Math.floor(Math.random() * middleNames.length);
        name += " " + middleNames[middle];
        var last = Math.floor(Math.random() * lastNames.length);
        name += " " + lastNames[last];

        if (names.indexOf(name) === -1) {
            names.push(name);
        }
    }
    return names;
}

function GlobalFeatureType(name, readableName, price) {
    this.readableName = readableName;
    this.name = name;
    this.active = false;
    this.price = price;
}