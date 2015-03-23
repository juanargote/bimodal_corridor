var userType = Object.freeze({
    CAR:'car',
    TRANSIT:'transit',
    CHOICE_CAR:'choiceCar',
    CHOICE_TRANSIT:'choiceTransit'
});

function User(type,wishedTime,errorTransit,errorCar,e,L,X){
    this.type = type;
    this.wishedTime = wishedTime;
    this.departureTime = wishedTime;
    this.arrivalTime = wishedTime;
    this.errorTransit = errorTransit;
    this.errorCar = errorCar;
    this.e = e;
    this.L = L;
    this.bottleneckCost = 0;
    this.X = X;
}

User.prototype = {
    constructor: User,
    chooseMode:function(pi_t,pi_c){
        var carUtility = this.X + this.errorCar + this.bottleneckCost - pi_c;
        var transitUtility = this.errorTransit + pi_t;
        if (carUtility > transitUtility) {
            this.choice = choice.CAR;
        } else {
            this.choice = choice.TRANSIT;
        }
    },
    setArrivalTime:function(arrivalTime) {
        this.arrivalTime = arrivalTime;
    },
    setDepartureTime:function(departureTime) {
        this.departureTime = departureTime;
    },
    setbottleneckCost:function(bottleneckCost) {
        this.bottleneckCost = bottleneckCost;
    }
}