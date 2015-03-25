/**
*This code snippet is necessary to be able to import d3 in the worker script.
*/
var noop = function() {
    return new Function();
};

var window = noop();

window.CSSStyleDeclaration = noop();
window.CSSStyleDeclaration.setProperty = noop();

window.Element = noop();
window.Element.setAttribute = noop();
window.Element.setAttributeNS = noop();

window.navigator = noop();

var document = noop();

document.documentElement = noop();
document.documentElement.style = noop();
importScripts('d3.min.js');
importScripts('user.js');
importScripts('bottleneck.js');
importScripts('timeslice.js');

/**
* Define useful constants
*/
var constants = Object.freeze({
    EULER_MASCHERONI: 0.57721566490153286
})

/**
*This is the worker logic, that includes all the tasks necessary in the simulation.
*/
workerPost = self.webkitPostMessage || self.postMessage;

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            var result = run(data)

            // Note: workers can't post dictionaries that contain functions. 
            workerPost({
                type: "result",
                value: result
            });
            self.close();
            break;
        default:
            workerPost('Unknown command: ' + data.msg);
    };
}, false);

function run(scenario) {
    var result = {};
    workerPost({
        type: 'progress',
        value: 'Beginning the run process.'
    })

    // Initialize the scenario components: users - timeSlice - bottleneck

    // Initialize users
    var userArray = [];
    var gumbelParameters = getGumbelParameters(0,1);
    for (i=0; i < scenario.N; i++) {
        var type = getInitialUserType(scenario.alpha,scenario.beta,scenario.initialTransitChoice);
        var errorTransit = gumbelRandom(gumbelParameters[0],gumbelParameters[1]);
        var errorCar = gumbelRandom(gumbelParameters[0],gumbelParameters[1]);
        var user = new User(type,scenario.wishedTime,errorTransit,errorCar,scenario.e,scenario.L,scenario.X);
        userArray.push(user);
    }

    // Initialize bottleneck and timeSlices
    var bottleneckCapacity = scenario.N*scenario.e*scenario.L/(scenario.e+scenario.L);
    var bottleneck = new Bottleneck(bottleneckCapacity);
    
    var timeSliceArray = [];
    var totalTimeInterval = 2*scenario.N / bottleneckCapacity;
    var time = scenario.wishedTime + totalTimeInterval / 2;
    var timeStep = totalTimeInterval / scenario.N;
    var timeSlice = new TimeSlice(time,timeStep);
    var nextTimeSlice = null;
    timeSliceArray.unshift(timeSlice);

    for (i=0; i < totalTimeInterval / timeStep; i++) {
        nextTimeSlice = timeSlice;
        time -= timeStep;
        var timeSlice = new TimeSlice(time,timeStep);
        timeSlice.setNext(nextTimeSlice);
        timeSliceArray.unshift(timeSlice)
    }

    bottleneck.setTimeSliceArray(timeSliceArray);

    // Set the bottleneck car users
    bottleneck.setUserArray(userArray.filter(function(d){return d.type == userType.CAR || d.type == userType.CHOICE_CAR}));
    bottleneck.initializeQueue();
    
    // Simulate the bottleneck physics until equilibrium with current car and choice_car users

    // Simulate the decision process between car and transit

    // Return the results
    return result;
}

/**
* Generates a random user type
* @param {Number} alpha [Ratio of TRANSIT users]
* @param {Number} beta [Ratio of CAR users]
* @param {Number} initialTransitChoice [Ratio of initial CHOICE_TRANSIT users]
* @return {userType} userType
*/
function getInitialUserType(alpha,beta,initialTransitChoice) {
    if (alpha + beta + initialTransitChoice <= 1 && 0 <= alpha + beta + initialTransitChoice ) {
        var draw = Math.random();
        if (draw < beta) {
            return userType.CAR;
        } else if (beta <= draw && draw < alpha + beta) {
            return userType.TRANSIT;
        } else if (beta > 1 - initialTransitChoice) {
            return userType.CHOICE_TRANSIT;
        } else {
            return userType.CHOICE_CAR;
        }
    } else {
        throw new Error('getInitialUserType(): The sum of the arguments must be between 0 and 1.');
    }
}

/**
* Generates a random draw from a Gumbel distribution
* @param {Number} beta [Scale parameter]
* @param {Number} mu [Location parameter]
* @return {Number} random draw
*/
function gumbelRandom(mu,beta) {
    return mu - beta * Math.log(-Math.log(Math.random()));
}

/**
* Obtain the Gumbel distribution parameters given a mean and variance
* @param {Number} mean
* @param {Number} variance
* @return {Array} Array containing the parameters mu and beta 
*/
function getGumbelParameters(mean,variance) {
    var params = [];
    var beta = Math.sqrt(6*variance/Math.pow(Math.PI,2));
    var mu = - constants.EULER_MASCHERONI * beta;
    params.push(mu);
    params.push(beta);
    return params
}