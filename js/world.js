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
    guestToDelete: null,
    toDelete: false,


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

    init: false,


    update: function (deltaTime) {
        if(!this.init){
            init();
            this.init = true;
        }
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
        if(alength<this.roomList.length){
            if(Math.random()<0.004){
                var guest = new Guest(generateName(1));
                gameWorld.guestList.push(guest);
                //LUKAS KOMM DICH
                console.log("LUKAS GEHE IN DIE LOBBY DICH");
                if(gameWorld.customerToLobbyCallback){
                    gameWorld.customerToLobbyCallback(guest);
                }
                //customer(guest);
                for(i=0; i<gameWorld.roomList.length; i++){
                    //console.log(gameWorld.roomList[i]);
                }
            }
        }
        if(this.toDelete){
            this.guestList.splice(this.guestList.indexOf(this.guestToDelete),1);
            // for (var i = 0; i < this.guestList.length; i++) {
            //     var obj = this.guestList[i];
            //     if(JSON.stringify(obj) === JSON.stringify(this.guestToDelete) ){
            //         this.guestList.splice(i,1);
            //     }
            // }
            this.toDelete=false;
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

function Guest (name) {
    this.name = name;
    this.statetime = 0;
    this.chosenRoom = null;
    this.statisfaction = 0;
    this.comingTime = Math.random()*3000;
    this.goingTime = Math.random()*3000;
    this.daysToStay =  Math.floor((Math.random() * 3) + 1);
    this.noOfRequirements = Math.floor((Math.random() * 10) + 1);
    this.requirementArrayChoose = gameWorld.globalUpgradesArray.concat(gameWorld.localUpgradesArray);
    this.requirementArray = [];
    for (i = 0; i < this.noOfRequirements; i++) {
        x = Math.floor(Math.random() * this.requirementArrayChoose.length);
        this.requirementArray.push(this.requirementArrayChoose[x]);
        this.requirementArrayChoose.splice(x, 1);
    }
    this.maximumPrice = Math.floor((Math.random() * 1000) + 100);
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.statusArray = ["coming", "going", "staying"];
    this.statusCurrent = "coming";

    this.update = function(deltaTime) {
        this.statetime+=deltaTime;
        switch(this.statusCurrent){
            case "coming":
                customer(this);
                if(this.statetime>=this.comingTime){
                    this.statusCurrent = "going";
                    this.statisfaction = 0;
                    this.statetime = 0;
                }
                break;
            case "going":
                if(this.statetime>=this.goingTime){
                    gameWorld.toDelete = true;
                    gameWorld.guestToDelete = this;
                    if(gameWorld.customerLeaveCallback){
                        gameWorld.customerLeaveCallback(this);
                    }
                }
                break;
            case "staying":
                if(this.statetime>=GAMELOGIC.MSPERDAY){
                    console.log(this.name + " " +"Room: "+this.chosenRoom + " M0ney: " + this.maximumPrice + " statetime: " + this.statetime + " No of NIghts: " + this.daysToStay);
                    this.daysToStay--;
                    gameWorld.money += this.chosenRoom.price;
                    this.maximumPrice -= this.chosenRoom.price;
                    console.log(this.daysToStay + " " + this.maximumPrice);
                    if(this.daysToStay <= 0 || this.maximumPrice<=0){
                        this.statusCurrent = "going";
                        if(Math.random()>0.5){
                            this.chosenRoom.statusCurrent = "dirty";
                            //TODO Lukas callback dirty
                        }
                        else{
                            this.chosenRoom.statusCurrent = "free";
                        }
                        console.log("LUKAS VERTSCHÜSS DICH");
                        if(gameWorld.customerLeaveCallback){
                            gameWorld.customerLeaveCallback(this);
                        }
                        //TODO HIER STERNE BEWERTUNGSCHANCE UND SO
                    }
                    this.statetime = 0;
                }
                break;

        }
    };
}

// gets ["receptionist", "cleaning", "kitchen","bar", "masseur", "Chief Onanating Officer"] and randomly generates price and quality
function Worker (type) {
    this.statusArray = ["working", "idle", "tohire"];
    this.statusCurrent = "tohire";
    this.paymentIntervallCounter =0;
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.name = generateName(1);
    this.statetime = 0;
    this.workTaskRoom = null;
    this.quality = Math.floor(Math.random() * 5) + 1;

    this.type = type;
    switch (this.type) {
        case "receptionist":
            this.price = Math.floor(((Math.random() * 150) + 50)*this.quality);
            break;
        case "cleaning":
            this.price = Math.floor(((Math.random() * 100) + 50)*this.quality);
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
    this.cleanTaskTime = (10 - this.quality)*1000;

    this.update = function(deltaTime) {
        this.statetime+=deltaTime;
        if(this.statusCurrent != "tohire"){
            this.paymentIntervallCounter+=deltaTime;
            if(this.paymentIntervallCounter>=GAMELOGIC.MSPERDAY)
            {
                gameWorld.money -= this.price;
                this.paymentIntervallCounter = 0;
            }
        }
        if(this.statusCurrent === "idle" && this.type === "cleaning"){
            for (var i = 0; i < gameWorld.roomList.length; i++) {
                var obj = gameWorld.roomList[i];
                if(obj.statusCurrent === "dirty"){
                    this.statusCurrent = "working";
                    obj.statusCurrent = "cleaning";
                    this.workTaskRoom = obj;
                    this.statetime = 0;
                    //TODO Lukas Entry for cleaning
                    break;
                }

            }
        }
        if(this.statusCurrent === "working" && this.type === "cleaning"){
            if(this.statetime >= this.cleanTaskTime){
                this.statusCurrent = "idle";
                this.workTaskRoom.statusCurrent = "free";
                this.statetime = 0;
                //TODO LUKAS zurück
            }
        }

    };
}


function init(){

    var room = new Room();
    room.posX = 4;
    room.posY = 19;
    room.length = 6;
    room.height = 6;
    room.singleBed = true;
    room.doubleBed = true;
    room.childBed = true;
    room.luxuryBed = true;
    room.plant = true;
    room.view = true;
    room.entertainment = true;
    room.bath = true;
    room.minibar = true;
    room.acUnit = true;
    room.name = "Room 101";
    gameWorld.roomList.push(room);
    
    var room = new Room();
    room.posX = 11;
    room.posY = 19;
    room.length = 5;
    room.height = 6;
    room.singleBed = true;
    room.doubleBed = true;
    room.childBed = true;
    room.luxuryBed = true;
    room.plant = true;
    room.view = true;
    room.entertainment = true;
    room.bath = true;
    room.minibar = true;
    room.acUnit = true;
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
    room.name = "Honeymoon Suite";
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

    var worker = new Worker("cleaning");
    worker.statusCurrent = "idle";
    gameWorld.workerList.push(worker);
    console.log(worker);

}

function Room () {
        this.posX = 0;
        this.posY = 0;
        this.length = 0;
        this.height = 0;
        this.name = "No Room Name";
        this.price = 50;
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
        this.price_to_buy = 10;
        this.statusArray = ["free", "taken", "dirty", "cleaning"];
        this.statusCurrent = "free";

    this.getFeatures = function(){

        return [this.singleBed,this.doubleBed,this.childBed,this.luxuryBed,this.plant,this.view,this.entertainment,this.bath,this.minibar,this.acUnit];
    };

    this.returnRoomFeaturesAsArray = function(){
        var returnArray = [];
        if(this.singleBed){returnArray.push(SINGLE_FEATURE_TYPE.SINGLE_BED);}
        if(this.doubleBed){returnArray.push(SINGLE_FEATURE_TYPE.DOUBLE_BED);}
        if(this.childBed){returnArray.push(SINGLE_FEATURE_TYPE.CHILD_BED);}
        if(this.luxuryBed){returnArray.push(SINGLE_FEATURE_TYPE.LUXURY_BED);}
        if(this.plant){returnArray.push(SINGLE_FEATURE_TYPE.PLANT);}
        if(this.view){returnArray.push(SINGLE_FEATURE_TYPE.VIEW);}
        if(this.entertainment){returnArray.push(SINGLE_FEATURE_TYPE.ENTERTAINMENT);}
        if(this.bath){returnArray.push(SINGLE_FEATURE_TYPE.BATH);}
        if(this.minibar){returnArray.push(SINGLE_FEATURE_TYPE.MINIBAR);}
        if(this.acUnit){returnArray.push(SINGLE_FEATURE_TYPE.ACUNIT);}
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
function customer (guestObj) {

    var customerSatisfaction = 0; // 0 to 1 -> Erfüllte/Gestellte Wünsche
    var satisfiedRequirements = 0;
    var satisfactionArray = [];
    for (k=0; k<gameWorld.roomList.length;k++) {
        if ((gameWorld.roomList[k].statusCurrent === "free") && (gameWorld.roomList[k].price<=guestObj.maximumPrice)) {
            for (i = 0; i < guestObj.requirementArray.length; i++) {
                for (j = 0; j < gameWorld.roomList[k].returnRoomFeaturesAsArray().length; j++) {
                     if (guestObj.requirementArray[i] === gameWorld.roomList[k].returnRoomFeaturesAsArray()[j]) {
                         satisfiedRequirements++;
                    }
                }

            }
        }
        satisfactionArray[k] = satisfiedRequirements/guestObj.noOfRequirements;
        satisfiedRequirements = 0;
    }
    //console.log(satisfactionArray)
    var roomChosen = indexOfMax(satisfactionArray);
    if(satisfactionArray[roomChosen] <= 0.3){

    }
    else {
        gameWorld.roomList[roomChosen].statusCurrent = "taken";
        guestObj.statusCurrent = "staying";
        console.log("LUKAS KOMM DICH");
        guestObj.chosenRoom = gameWorld.roomList[roomChosen];
        guestObj.statisfaction = satisfactionArray[roomChosen];
        //LUKAS KOMM DICH
        if(gameWorld.customerArrivalCallback && guestObj.chosenRoom){
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




function generateName(quantity){
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
        'Sterling', 'Obi', 'Lukas'

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
        'Linus',
        'Mallory', 'Wan', 'Zelle'

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
            'Schuerzenbacher'

    ];

    var maxNames = firstNames.length * middleNames.length * lastNames.length;
    if (quantity > maxNames) {
        throw "Quantity greater than possible matches. Possible matches: "+maxNames;
    }
    var names = [];
    while ( names.length < quantity ) {
        var name = "";
        var first = Math.floor( Math.random() * firstNames.length );
        name+= firstNames[first];
        var middle = Math.floor( Math.random() * middleNames.length );
        name+= " "+middleNames[middle];
        var last = Math.floor( Math.random() * lastNames.length );
        name+= " "+lastNames[last];

        if (names.indexOf(name)==-1) {
            names.push(name);
        }
    }
    return names;
}