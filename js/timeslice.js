function TimeSlice(time) {
    this.time = time;
    this.arrivalTime = 0;
    this.departureTime = 0;
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

