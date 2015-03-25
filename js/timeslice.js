function TimeSlice(time,dt) {
    this.startTime = time;
    this.endTime = time + dt;
    this.arrivalTime = time;
    this.departureTime = time;
    this.queue = [];
    this.next = null;
}

TimeSlice.prototype = {
    constructor:TimeSlice,
    setNext:function(timeSlice) {
        this.next = timeSlice;
    },
    queueUser:function(user) {
        this.queue.push(user);
    },
    serve:function(bottleneckCapacity) {
        // Pop out served users from the queue and update 
        // their attributes (e.g. departure time...)

        // Update the queue on the next time slice 
        // by prepending the unserved users

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