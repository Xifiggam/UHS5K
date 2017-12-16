
//Random Requirements between 1-10 with random intensity.
function Guest (type) {
    this.name = type;
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
    this.statusCurrent;
}

function Customer (guestObj) {

    guestObj.requirementArray


}


// Upgrades that are available globally for the Hotel. Customers can have "requirements" drawn from this.
GobalUpgrades = {
    globalUpgradesArray: ["wifi_room", "wifi_lobby", "seminarRoom", "massageParlor", "sauna", "saunaPlus", "pool", "outdoorPool", "fitnessStudio", "hotelBar", "restaurant"],
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
    SAUNAPLUS_Price: 2000,

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

};

// Rooms can have this upgrades. Customers will choose the room that satisfies most of their needs and fits their price.

var localUpgrades = {
    localUpgradesArray: ["singleBed", "doubleBed", "childBed", "luxuryBed", "plant", "view", "entertainment", "bath", "minibar", "acUnit"],
     singleBed: false,
    SINGLEBED_PRICE: 100,
     doubleBed: false,
    DOUBLEBED_PRICE: 100,
     childBed: false,
    CHILDBED_PRICE: 100,
     luxuryBed: false,
    LUXURYBED_PRICE: 1000,
     plant: false,
    PLANT_PRICE: 1000,
     view: false,
    VIEW_PRICE: 1000,
     entertainment: false,
    ENTERTAINMENT_PRICE: false,
     bath: false,
    BATH_PRICE: 1000,
     minibar: false,
    MINIBAR_PRICE: false,
     acUnit: false,
    ACUNIT_PRICE: 1000

};

var Rooms ={


}


// gets ["receptionist", "cleaning", "kitchen","bar", "masseur", "Chief Operating Officer"] and randomly generates price and quality
function Personal (type) {
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

}



var Events = {
    var hygienecontrol;
    var naturaldesasater;
    var taxincrease;
    var taxdecrease;
    var conference;
    var footballgame;
    var holidays;
    var culturalWeek;
    var culinaryWeek;

}

var GroupEvents = {
    var hooligans;
    var rockstars;
    var pensioners;
    var family;
    var honeymoon;
    var company;

}

var Marketing = {

}

var Platform = {

}



try {
    var names = RandomNames.generate(150);
    for (var i=0; i<names.length; i++) {
        document.write(names[i]+'<br/>');
    }
    document.write('<br /><strong>Total names:</strong> '+names.length);
} catch (e) {
    document.write(e);
}