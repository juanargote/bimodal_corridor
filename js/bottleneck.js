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
        var leftCapacity = this.capacity;
        for (var i = 0; i < this.timeSliceArray.length; i++) {
            var usersToServe = strip(Math.floor(leftCapacity * this.timeSliceArray[i].timeInterval));
            this.timeSliceArray[i].serve(usersToServe);
            leftCapacity += strip((leftCapacity * this.timeSliceArray[i].timeInterval - usersToServe) / this.timeSliceArray[i].timeInterval);
        }
    },
    chooseArrival: function(p) {
        var usersToChoose = this.userArray.filter(function(d){return Math.random() < p});
        for (var i = 0; i < usersToChoose.length; i++) {
            usersToChoose[i].chooseArrival(this);
        }
        return 
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