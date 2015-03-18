var scenarios = []
var results = []

/*
Define the simulation scenarios.
*/
scenarios.push({
    name: "Initial Scenario",
    N: 1000,
    alpha: 0,
    beta: 0,
    initialTransitChoice:0,
    wishedTime: 1,
    e: 0.5,
    L: 2,
    X: 4,
    cmd:'start',
})

console.table(scenarios)

scenarios.forEach(function(d,i,a) {
    var worker = new Worker('js/worker.js');
    worker.addEventListener('message', function(e) {
        test = e.data
        switch (e.data.type) {
            case 'progress':
                d3.select('#simulation-log').append('p').html(d.name + ': ' + e.data.value)
                console.log(e.data.value)
                break;
            case 'result':
                results.push(e.data.value)
                if (results.length == scenarios.length) {
                    VisualizeResults(results);
                }
                break;
        }
    }, false);
    worker.postMessage(d);    
})