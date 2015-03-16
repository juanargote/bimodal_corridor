var userType = Object.freeze({
    CAR:'car',
    TRANSIT:'transit',
    CHOICE_CAR:'choiceCar',
    CHOICE_TRANSIT:'choiceTransit'
});

var choice = Object.freeze({
    CAR:'car',
    TRANSIT:'transit'
})

function User(type,choice,wishedTime,errorTransit,errorCar,e,L,X){
    this.type = type;
    this.choice = choice;
    this.wishedTime = wishedTime;
    this.departureTime = wishedTime;
    this.errorTransit = errorTransit;
    this.errorCar = errorCar;
    this.e = e;
    this.L = L;
    this.vickreyCost = 0;
    this.X = X;
}

User.prototype = {
    constructor: User,
    chooseMode:function(pi_t,pi_c){
        var carUtility = this.X + this.errorCar - pi_c;
        var transitUtility = this.errorTransit + pi_t;
        if (carUtility > transitUtility) {
            this.choice = choice.CAR;
        } else {
            this.choice = choice.TRANSIT;
        }
    }
}