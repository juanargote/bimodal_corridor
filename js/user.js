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
    chooseArrival:function(bottleneck) {
        
        /**
        * User with perfect information. The user knows the cost associated with
        * all possible arrival times and chooses accordingly.
        */

        // Determine the user's minimum cost
        var self = this;
        var change = 0;
        var costArray = bottleneck.timeSliceArray.map(function(d){
            return d.delay + self.punctualityCost(d.departureTime - self.wishedTime);
        }); 

        var minCostIndex = minIndex(costArray);
        if (minCostIndex != this.arrivalTimeIndex) {
            change = 1;
        }

        // Update the user's arrival time
        this.arrivalTime = bottleneck.timeSliceArray[minCostIndex].startTime;

        return change;
        /**
        * User with constrained choice. The user only considers arrival times
        * in the vecinity of its current choice.
        */
        // var currentCost = this.departureTime - this.arrivalTime + this.punctualityCost(this.departureTime - this.wishedTime)

        // // Look at arriving n time units earlier
        
        // // Look at arriving n time units later

    },
    punctualityCost:function(delay) {
        if (delay >= 0) {
            return this.L * delay;
        } else {
            return this.e * (-delay);
        }
    },
    computeCostArrivingAtTimeSlice:function(timeSlice){
        return strip(timeSlice.departureTime - timeSlice.arrivalTime + this.punctualityCost(timeSlice.departureTime - this.wishedTime));
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
