/**
 * Created by Veit on the Death S.
 */

var gameWorld = {

    guestList: [],
    roomList: [],
    workerList: [],

    money: 1000,
    stars: 1,

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
    
    
    upgradeRoom: function (Room, feature) {
        switch(feature) {
            case singleBed:
                Room.singleBed = true;
                this.money = this.money - 1000;
                break;
            case doubleBed:
                Room.doubleBed = true;
                this.money = this.money - 1000;
                break;
            case childBed:
                Room.childBed = true;
                this.money = this.money - 1000;
                break;
            case luxuryBed:
                Room.luxuryBed = true;
                this.money = this.money - 1000;
                break;
            case plant:
                Room.plant = true;
                this.money = this.money - 1000;
                break;
            case view:
                Room.view = true;
                this.money = this.money - 1000;
                break;
            case entertainment:
                Room.entertainment = true;
                this.money = this.money - 1000;
                break;
            case bath:
                Room.bath = true;
                this.money = this.money - 1000;
                break;
            case minibar:
                Room.minibar = true;
                this.money = this.money - 1000;
                break;
            case acUnit:
                Room.acUnits = true;
                this.money = this.money - 1000;
                break;
        }
    }




};

function Guest () {
    this.update = function(deltaTime) {
        //Update Function
    };
}


function Worker () {
    this.update = function (deltaTime) {
        //Update Function
    };
}

function Room () {
        var posX = 0;
        var posY = 0;
        var length = 0;
        var heigth = 0;
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
        return [singleBed,doubleBed,childBed,luxuryBed,plant,view,entertainment,bath,minibar,acUnit];
    };
    
    this.update = function (deltaTime) {
        //Update Function
    };
}

