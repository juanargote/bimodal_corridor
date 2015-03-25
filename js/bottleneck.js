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
                (this.timeSliceArray[timeSliceIdx].endTime >= this.userArray[userIdx].arrivalTime)) {
                this.timeSliceArray[timeSliceIdx].queueUser(this.userArray[userIdx]);
                userIdx++;
                if (userIdx >= this.userArray.length) {
                    break;
                }
            }
        }
    }
}
