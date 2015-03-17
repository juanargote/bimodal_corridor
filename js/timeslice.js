function TimeSlice(time) {
    this.time = time;
    this.arrivalTime = 0;
    this.departureTime = 0;
    queue = [];
    next = null;
}

TimeSlice.prototype = {
    constructor:TimeSlice,
    setNext:function(timeSlice) {
        this.next = timeSlice;
    },
    serve:function() {
        // Pop out served users from the queue and update 
        // their attributes (e.g. departure time...)

        // Update the queue on the next time slice 
        // by prepending the unserved users

    }
}

