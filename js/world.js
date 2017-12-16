/**
 * Created by Veit on the Death S.
 */

var gameWorld = {

    guestList: [],
    roomList: [],
    workerList: [],
    globalUpgradesArray: ["wifi_room", "wifi_lobby", "seminarRoom", "massageParlor", "sauna", "saunaPlus", "pool", "outdoorPool", "fitnessStudio", "hotelBar", "restaurant"],
    localUpgradesArray: [SINGLE_FEATURE_TYPE.SINGLE_BED, SINGLE_FEATURE_TYPE.DOUBLE_BED, SINGLE_FEATURE_TYPE.CHILD_BED, SINGLE_FEATURE_TYPE.LUXURY_BED, SINGLE_FEATURE_TYPE.PLANT, SINGLE_FEATURE_TYPE.VIEW, SINGLE_FEATURE_TYPE.ENTERTAINMENT, SINGLE_FEATURE_TYPE.BATH, SINGLE_FEATURE_TYPE.MINIBAR, SINGLE_FEATURE_TYPE.ACUNIT],
    money: 1000,
    stars: 1,


    // GLOBAL UPGRADES WITH PRICE
    wifi_room: false,
    WIFI_ROOM_PRICE: 1000,

    wifi_lobby: false,
    WIFI_LOBBY_PRICE: 100,

    seminarRoom: false,
    SEMINARROOM_PRICE: 1000,

    massageParlor: false,
    MASSAGEPARLOR_PRICE: 1000,

    sauna: false,
    SAUNA_PRICE: 1000,

    saunaPlus: false,
    SAUNAPLUS_PRICE: 2000,

    pool: false,
    POOL_PRICE: 1000,

    outdoorPool: false,
    OUTDOORPOOL_PRICE: 2000,

    fitnessStudio: false,
    FITNESSSTUDIO_PRICE: 1000,

    hotelBar: false,
    HOTELBAR_PRICE: 1000,

    restaurant: false,
    RESTAURANT_PRICE: 1000,

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


    update: function (deltaTime) {
        alength = this.roomList.length;
        for (i = 0; i < alength; i++) {
            this.roomList[i].update(deltaTime);
        }
        alength = this.workerList.length;
        for (i = 0; i < alength; i++) {
            this.workerList[i].update(deltaTime);
        }
        alength = this.guestList.length;
        for (i = 0; i < alength; i++) {
            this.guestList[i].update(deltaTime);
        }
    },

    buyGlobalUpgrade: function (feature) {
        switch(feature) {
            case "wifi_room":
                this.wifi_room=true;
                this.money = this.money - this.WIFI_ROOM_PRICE;
                break;
            case "wifi_lobby":
                this.wifi_lobby=true;
                this.money = this.money - this.WIFI_LOBBY_PRICE;
                break;
            case "seminarRoom":
                this.seminarRoom=true;
                this.money = this.money = this.SEMINARROOM_PRICE;
                break;
            case "massageParlor":
                this.massageParlor=true;
                this.money=this.money-this.MASSAGEPARLOR_PRICE;
                break;
            case "sauna":
                this.sauna=true;
                this.money=this.money-this.SAUNA_PRICE;
                break;
            case "saunaPlus":
                this.saunaPlus=true;
                this.money=this.money-this.SAUNAPLUS_PRICE;
                break;
            case "pool":
                this.pool=true;
                this.money=this.money-this.POOL_PRICE;
                break;
            case "outdoorPool":
                this.outdoorPool=true;
                this.money=this.money-this.OUTDOORPOOL_PRICE;
                break;
            case "fitnessStudio":
                this.fitnessStudio=true;
                this.money=this.money-this.FITNESSSTUDIO_PRICE;
                break;
            case "hotelBar":
                this.hotelBar=true;
                this.money=this.money-this.HOTELBAR_PRICE;
                break;
            case "restaurant":
                this.restaurant=true;
                this.money=this.money-this.RESTAURANT_PRICE;
                break;
        }
    },
    
    upgradeRoom: function (Room, feature) {
        console.log(Room, feature);
        switch(feature) {
            case "singleBed":
                Room.singleBed = true;
                this.money = this.money - this.SINGLEBED_PRICE;
                break;
            case "doubleBed":
                Room.doubleBed = true;
                this.money = this.money - this.DOUBLEBED_PRICE;
                break;
            case "childBed":
                Room.childBed = true;
                this.money = this.money - this.CHILDBED_PRICE;
                break;
            case "luxuryBed":
                Room.luxuryBed = true;
                this.money = this.money - this.LUXURYBED_PRICE;
                break;
            case "plant":
                Room.plant = true;
                this.money = this.money - this.PLANT_PRICE;
                break;
            case "view":
                Room.view = true;
                this.money = this.money - this.VIEW_PRICE;
                break;
            case "entertainment":
                Room.entertainment = true;
                this.money = this.money - this.ENTERTAINMENT_PRICE;
                break;
            case "bath":
                Room.bath = true;
                this.money = this.money - this.BATH_PRICE;
                break;
            case "minibar":
                Room.minibar = true;
                this.money = this.money - this.MINIBAR_PRICE;
                break;
            case "acUnit":
                Room.acUnits = true;
                this.money = this.money - this.ACUNIT_PRICE;
                break;
        }
    }




};

function Guest (name) {
    this.name = name;
    this.noOfRequirements = Math.floor((Math.random() * 10) + 1);
    this.requirementArrayChoose = this.globalUpgradesArray.concat(this.localUpgradesArray);
    this.requirementArray = [];
    for (i = 0; i < this.noOfRequirements; i++) {
        this.requirementArray.concat(this.requirementArrayChoose[Math.floor(Math.random() * myArray.length)]);
    }
    this.maximumPrice = Math.floor((Math.random() * 1000) + 100);
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.statusArray = ["coming", "going", "staying"];
    this.statusCurrent = "coming";

    this.update = function(deltaTime) {
        //Update Function
    };
}

// gets ["receptionist", "cleaning", "kitchen","bar", "masseur", "Chief Operating Officer"] and randomly generates price and quality
function Worker (job) {
    this.job = type;
    switch (type) {
        case "receptionist":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 150) + 50)*this.quality);
            break;
        case "cleaning":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 100) + 50)*this.quality);
            break;
        case "kitchen":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 150) + 50)*this.quality);
            break;
        case "bar":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 200) + 50)*this.quality);
            break;
        case "masseur":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 200) + 50)*this.quality);
            break;
        case "Chief Operating Officer":
            this.quality = Math.floor((Math.random() * 5) + 1);
            this.price = Math.floor(((Math.random() * 300) + 50)*this.quality);
            break;
        default:

    }
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.update = function (deltaTime) {
        //Update Function
    };
}

function Room () {
        var posX = 0;
        var posY = 0;
        var length = 0;
        var heigth = 0;
        var roomNumber;
        var free = true;
        var price = 50;
        var singleBed = false;
        var doubleBed = false;
        var childBed = false;
        var luxuryBed = false;
        var plant = false;
        var view = false;
        var entertainment = false;
        var bath = false;
        var minibar = false;
        var acUnit = false;

    this.getFeatures = function(){
        console.log(this);

        return [this.singleBed,this.doubleBed,this.childBed,this.luxuryBed,this.plant,this.view,this.entertainment,this.bath,this.minibar,this.acUnit];
    };

    this.getRoomStatus = function(){
      return free;
    };

    this.getRoomPrice = function(){
        return price;
    };

    this.changeRoomBool = function(){
        if (free===true){
            free=false;
        } else if (free===false){
            free=true;
        }
    };
    
    this.update = function (deltaTime) {
        //Update Function
    };
}


//FUNCTION TAKES GUEST -> CHECKS HIS NEEDS AND GIVES BACK THE ROOM HE WANTS TO STAY IN AND HIS SATISFACTION. IT ALSO SETS THE ROOM TO BUSY.
function Customer (guestObj) {

    var customerSatisfaction = 0; // 0 to 1 -> Erfüllte/Gestellte Wünsche
    var satisfiedRequirements = 0;
    var satisfactionArray = [];
    for (k=0; i<this.roomList.length;k++) {
        if ((this.roomList[k].getRoomStatus() === true) && (this.roomList[k].getRoomPrice()<=guestObj.maximumPrice)) {
            for (i = 0; i < guestObj.requirementArray.length; i++) {
                for (j = 0; i < guestObj.requirementArrayChoose; j++) {
                    if (guestObj.requirementArray[i] === guestObj.requirementArrayChoose[j]) {
                        satisfiedRequirements++;
                    }
                }

            }
        }
        satisfactionArray[k] = satisfiedRequirements/guestObj.noOfRequirements;
    }
    var roomChosen = indexOfMax(satisfactionArray);
    this.roomList[roomChosen].changeRoomBool();
    guestObj.statusCurrent = "staying";
    return [roomChosen, satisfactionArray[roomChosen]];
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
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