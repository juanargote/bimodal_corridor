/*
This code snippet is necessary to be able to import d3 in the worker script.
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

/*
This is the worker logic, that includes all the tasks necessary in the simulation.
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