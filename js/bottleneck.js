function Bottleneck(capacity){
    this.timeSliceArray = [];
    this.capacity = capacity;
    this.userArray = [];
}

Bottleneck.prototype = {
    constructor: Bottleneck,
    setUserArray:function(userArray) {
        this.userArray = userArray;
    },
    setTimeSliceArray:function(timeSliceArray) {
        this.timeSliceArray = timeSliceArray;
    },
    initializeQueue:function() {
        var userIdx = 0;
        for (var timeSliceIdx = 0; timeSliceIdx < this.timeSliceArray.length; timeSliceIdx++) {
            if (userIdx >= this.userArray.length) {
                break;
            }
            while (this.timeSliceArray[timeSliceIdx].startTime <= this.userArray[userIdx].arrivalTime && 
                (this.timeSliceArray[timeSliceIdx].endTime > this.userArray[userIdx].arrivalTime)) {
                this.timeSliceArray[timeSliceIdx].queueUser(this.userArray[userIdx]);
                this.userArray[userIdx].setArrivalTimeIndex(timeSliceIdx);
                userIdx++;
                if (userIdx >= this.userArray.length) {
                    break;
                }
            }
        }
    },
    emptyQueue: function() {
        for (var timeSliceIdx = 0; timeSliceIdx < this.timeSliceArray.length; timeSliceIdx++) {
            this.timeSliceArray[timeSliceIdx].queue = [];
        }
    },
    serveQueue: function() {
        this.userArray.forEach(function(d){d.resetWorkLeft();})
        for (var i = 0; i < this.timeSliceArray.length; i++) {
            this.timeSliceArray[i].serve(this.capacity);
        }
    },
    chooseArrival: function(p) {
        var usersToChoose = this.userArray.filter(function(d){return Math.random() < p});
        var usersChanging = 0;
        for (var i = 0; i < usersToChoose.length; i++) {
            // usersChanging += usersToChoose[i].chooseArrival(this);
            usersChanging += usersToChoose[i].chooseCloseArrival(this);
        }
        return usersChanging;
    },
    sortArrivalIndex: function(){
        this.userArray.sort(compareArrivalTime);
        for (var i = 0; i < this.userArray.length; i++) {
            this.userArray[i].setArrivalIndex(i);
        }
    },
    computeCost: function(){
        /**
        * Iterative function to assign delays to timeslices
        */
        var timeSliceIndex = 0;

        // Assign 0 costs at the initial and final timeSlices
        // Note that this method requires a sorted userArray by arrival time
        for (var j = 0; j < this.timeSliceArray.length; j++) {
            if (this.timeSliceArray[j].startTime < this.userArray[0].arrivalTime) {
                this.timeSliceArray[j].setDelay(0);
                timeSliceIndex++;
            } else {
                break;
            }
        }

        for (var j = this.timeSliceArray.length-1; j >= 0; j--) {
            if (this.userArray[this.userArray.length-1].departureTime <= this.timeSliceArray[j].startTime) {
                this.timeSliceArray[j].setDelay(0);
            } else {
                break;
            }
        }

        // Iterative delay assignment
        var userIndex = 0;
        var firstUserFromArrivalBatch = this.userArray[userIndex];
        var lastUserFromArrivalBatch = this.userArray[userIndex];
        while (timeSliceIndex < this.timeSliceArray.length - 1 && this.timeSliceArray[timeSliceIndex].startTime < this.userArray[this.userArray.length - 1].departureTime ) {

            if (userIndex >= this.userArray.length - 1) {
                var timeSliceDelay = this.delayCalculation(lastUserFromArrivalBatch,this.timeSliceArray[timeSliceIndex]);
                this.timeSliceArray[timeSliceIndex].setDelay(timeSliceDelay);    
                timeSliceIndex++;
            } else {
                if (this.timeSliceArray[timeSliceIndex].startTime >= firstUserFromArrivalBatch.arrivalTime) { 
                    if (firstUserFromArrivalBatch.arrivalTime == this.userArray[userIndex + 1].arrivalTime) {
                        lastUserFromArrivalBatch = this.userArray[userIndex+1];
                    } else {
                        firstUserFromArrivalBatch = this.userArray[userIndex+1];
                    }
                    userIndex++;
                } else {
                    var timeSliceDelay = this.delayCalculation(lastUserFromArrivalBatch,this.timeSliceArray[timeSliceIndex]);
                    this.timeSliceArray[timeSliceIndex].setDelay(timeSliceDelay);    
                    timeSliceIndex++;
                    if (this.timeSliceArray[timeSliceIndex].startTime >= firstUserFromArrivalBatch.arrivalTime) {
                        lastUserFromArrivalBatch = this.userArray[userIndex];
                    }
                } 
            }
        }
    },
    delayCalculation: function(user,timeSlice) {
        if (user.departureTime <= timeSlice.startTime) {
            return 0;
        } else {
            return strip(user.departureTime - timeSlice.startTime);
        }
    },
    setOptimalArrival:function() {
        var N = this.userArray.length;
        var e = this.userArray[0].e;
        var L = this.userArray[0].L;
        var TC = strip(N*e*L / (this.capacity * (e + L)));
        var NL = N*L/(e+L);
        var w = this.userArray[0].wishedTime;
        console.log(N);
        console.log(e);
        console.log(L);
        console.log(TC);
        console.log(NL);
        console.log(w);

        for (var i = 0; i < this.userArray.length; i++) {
            if (this.userArray[i].arrivalIndex <= NL) {
                var arrivalTime = this.userArray[i].wishedTime - TC - strip((NL - this.userArray[i].arrivalIndex) / (this.capacity / (1 - e)))
            } else {
                var arrivalTime = this.userArray[i].wishedTime - TC + strip((this.userArray[i].arrivalIndex - NL) / (this.capacity / (1 + L)))
            }
            console.log(arrivalTime)
            this.userArray[i].setArrivalTime(arrivalTime);
        }
    }
}

/**
* Avoid rounding errors in javascript
* @param {Number}
* @return {Number}
*/
function strip(number) {
    return (parseFloat(number.toPrecision(12)));
}

/**
* Compare arrivalTime to sort by it
* @param {User} a
* @param {User} b
* @return {Number}
*/
function compareArrivalTime(a,b) {
    if (a.arrivalTime < b.arrivalTime) {
        return -1;
    }
    if (a.arrivalTime > b.arrivalTime) {
        return 1;
    }
    return 0;
}