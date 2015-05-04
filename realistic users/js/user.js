var userType = Object.freeze({
    CAR:'car',
    TRANSIT:'transit',
    CHOICE_CAR:'choiceCar',
    CHOICE_TRANSIT:'choiceTransit'
});

function User(id,type,wishedTime,errorTransit,errorCar,e,L,X,capacity){
    this.id = id;
    this.arrivalIndex = id;
    this.type = type;
    this.wishedTime = wishedTime;
    this.targetArrivalTime = wishedTime;
    this.departureTime = wishedTime;
    this.arrivalTime = wishedTime;
    this.errorTransit = errorTransit;
    this.errorCar = errorCar;
    this.e = e;
    this.L = L;
    this.bottleneckCost = 0;
    this.X = X;
    this.arrivalTimeIndex = null;
    this.work = 1 / capacity; // in time units
    this.workLeft = 1 / capacity;
    this.memory = d3.map();
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
    setArrivalTimeIndex:function(arrivalTimeIndex) {
        this.arrivalTimeIndex = arrivalTimeIndex;
    },
    setDepartureTime:function(departureTime) {
        this.departureTime = departureTime;
    },
    setbottleneckCost:function(bottleneckCost) {
        this.bottleneckCost = bottleneckCost;
    },
    setArrivalIndex:function(arrivalIndex){
        this.arrivalIndex = arrivalIndex;
    },
    resetWorkLeft:function() {
        this.workLeft = this.work;
    },
    setRandomArrivalTime:function() {
        var newArrivalTime = +0.01 * _.random(-5,5) + this.targetArrivalTime;
        this.arrivalTime = newArrivalTime;
    },
    chooseArrival:function(bottleneck) {
        
        /**
        * User with perfect information. The user knows the cost associated with
        * all possible arrival times and chooses accordingly.
        */

        // Determine the user's minimum cost
        var self = this;
        var change = 0;
        var minTargetArrivalTime = + _.min(this.memory.entries(),function(d){return d.value}).key


        if (minTargetArrivalTime != this.targetArrivalTime) {
            change = 1;
        }

        // Update the user's arrival time
        this.targetArrivalTime = minTargetArrivalTime;

        return change;
    },
    punctualityCost:function(delay) {
        if (delay >= 0) {
            return this.L * delay;
        } else {
            return this.e * (-delay);
        }
    },
    computeCostArrivingAtTimeSlice:function(timeSlice) {
        return strip(timeSlice.departureTime - timeSlice.arrivalTime + this.punctualityCost(timeSlice.departureTime - this.wishedTime));
    },
    computeCurrentCost:function() {
        return strip(this.departureTime - this.arrivalTime + this.punctualityCost(this.departureTime - this.wishedTime))
    },
    storeExperience:function() {
        // Delete a memory entry if the size is too large
        if (this.memory.size() > 20) {
            this.memory.remove(this.memory.keys()[0]);
        }
        // Store the entry
        this.memory.set(this.arrivalTime,this.computeCurrentCost());
    }
}

/**
* Return the index of an array's minimum value
* @param {Array} array
* @return {Number} minIndex
*/
function minIndex(array) {
    var min = array[0];
    var minIndex = 0;

    for (var i = 1; i < array.length; i++) {
        if (array[i] < min) {
            minIndex = i;
            min = array[i];
        }
    }
    return minIndex
}