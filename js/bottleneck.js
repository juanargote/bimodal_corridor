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
    }
}
