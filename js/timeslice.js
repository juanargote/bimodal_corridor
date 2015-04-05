function TimeSlice(time,dt) {
    this.startTime = time;
    this.endTime = time + dt;
    this.timeInterval = dt;
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
    serve:function(numberOfUsers) {
        if (this.queue.length > 0) {
            var newArrivalTime = 0;
            var newDepartureTime = 0;
            // Pop out served users from the queue and update 
            // their attributes (e.g. departure time...)
            for (var i = 0; i<numberOfUsers; i++){
                var user = this.queue.shift();
                newArrivalTime += user.arrivalTime;
                var thisDepartureTime = this.startTime + strip(i * this.timeInterval / numberOfUsers)
                newDepartureTime += thisDepartureTime;
                user.departureTime = thisDepartureTime;
                // Check if there are more users left to be served
                if (this.queue.length == 0) {
                    break;
                }
            }

            // Update the queue on the next time slice 
            // by prepending the unserved users and removing them from the current queue
            if (this.next != null) {
                this.next.queue = this.queue.concat(this.next.queue);
                this.queue = [];
            }

            // Update the time slice properties
            this.arrivalTime = newArrivalTime / numberOfUsers;
            this.departureTime = newDepartureTime / numberOfUsers;
        } else {
            this.arrivalTime = this.startTime;
            this.departureTime = this.startTime;
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