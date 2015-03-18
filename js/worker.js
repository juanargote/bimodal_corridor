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
importScripts('user.js')

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

    // Simulate the bottleneck physics until equilibrium with current car and choice_car users

    // Simulate the desicion process between car and transit

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
        throw new Error('getInitialUserType(): The arguments'' addition must be a number between 0 and 1.');
    }
}