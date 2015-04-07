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
                this.userArray[userIdx].setArrivalTimeSliceId(timeSliceIdx);
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
            usersChanging += usersToChoose[i].chooseArrival(this);
        }
        return usersChanging;
    },
    sortArrivalIndex: function(){
        this.userArray.sort(compareArrivalTime);
        for (var i = 0; i < this.userArray.length; i++) {
            this.userArray[i].setArrivalIndex(i);
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