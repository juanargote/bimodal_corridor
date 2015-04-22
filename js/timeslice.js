function TimeSlice(time,dt) {
    this.startTime = time;
    this.endTime = time + dt;
    this.timeInterval = dt;
    this.arrivalTime = time;
    this.arrivalTimeIndex = null;
    this.departureTime = time;
    this.queue = [];
    this.next = null;
    this.delay = 0;
}

TimeSlice.prototype = {
    constructor:TimeSlice,
    setArrivalTimeIndex:function(arrivalTimeIndex) {
        this.arrivalTimeIndex = arrivalTimeIndex;
    },
    setNext:function(timeSlice) {
        this.next = timeSlice;
    },
    queueUser:function(user) {
        this.queue.push(user);
    },
    setDelay:function(delay) {
        this.delay = delay;
    },
    serve:function(capacity) {
        if (this.queue.length > 0) {
            // Assign delay equal to the work left in the queue
            // divided by the service rate
            var timeLeftToServeQueue = this.queue.reduce(function(a,b){return {workLeft: strip(a.workLeft + b.workLeft)}}).workLeft;
            this.setDelay(timeLeftToServeQueue);
            this.departureTime = this.startTime + timeLeftToServeQueue;
            
            // Pop out served users from the queue and update 
            // their attributes (e.g. departure time...)
            var bottleneckWorkLeft = this.timeInterval;
            var currentServingTime = this.startTime;
            while (bottleneckWorkLeft > 0 && this.queue.length > 0) {
                if (bottleneckWorkLeft >= this.queue[0].workLeft) {
                    var necessaryWorkForNextUser = this.queue[0].workLeft; 
                    bottleneckWorkLeft -= necessaryWorkForNextUser;
                    this.queue[0].workLeft = 0
                    currentServingTime += necessaryWorkForNextUser;
                    var userServed = this.queue.shift();
                    userServed.departureTime = currentServingTime;
                } else { // Not enough bottleneckWorkLeft to serve the next user
                    this.queue[0].workLeft -= bottleneckWorkLeft;
                    bottleneckWorkLeft = 0;
                }
            }
            // Update the queue on the next time slice 
            // by prepending the unserved users and removing them from the current queue
            if (this.next != null) {
                this.next.queue = this.queue.concat(this.next.queue);
                this.queue = [];
            }
        } else {
            this.arrivalTime = this.startTime;
            this.departureTime = this.startTime + 1/capacity;
            this.delay = 1/capacity;
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