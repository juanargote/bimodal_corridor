/**
* Global Visualization Variables that need to be available to all functions
*
*/
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var yCost = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yCostAxis = d3.svg.axis()
    .scale(yCost)
    .orient("left");

var costData = [];

/**
* Plot the initial user visualization.
* @param {Array} userArray
*/
function initialUserVisualization(userArray){
    var svg = d3.select("#main").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([-2,4]).nice();
    y.domain([0,userArray.length]).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Time (hr)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Cumulative Users")

    svg.selectAll(".wished")
        .data(userArray,function(d){return d.id})
        .enter().append("circle")
            .attr("class", "wished")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.wishedTime); })
            .attr("cy", function(d) { return y(d.id); })
            .style("fill", function(d) { return color(0); });

    svg.selectAll(".arrival")
        .data(userArray,function(d){return d.id})
        .enter().append("circle")
            .attr("class", "arrival")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.arrivalTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); })
            .style("fill", function(d) { return color(1); });

    svg.selectAll(".departure")
        .data(userArray,function(d){return d.id})
        .enter().append("circle")
            .attr("class", "departure")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.departureTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); })
            .style("fill", function(d) { return color(2); });

    // var legend = svg.selectAll(".legend")
    //     .data(color.domain())
    //     .enter().append("g")
    //         .attr("class", "legend")
    //         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // legend.append("rect")
    //     .attr("x", width - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", color);

    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) { return d; });
}

/**
* Plot the expected user equilibrium under step wished curve.
* @param {Array} userArray
* @param {Number} capacity
*/
function visualizeExpectedEquilibrium(userArray,capacity){
    var line = d3.svg.line()
                .x(function(d){return x(d.x)})
                .y(function(d){return y(d.y)})

    var svg = d3.select("#main svg").select("g");

    var N = userArray.length;
    var e = userArray[0].e;
    var L = userArray[0].L;
    var TC = strip(N*e*L / (capacity * (e + L)));
    var NL = N*L/(e+L);
    var w = userArray[0].wishedTime;

    svg.append("path")
        .datum([{x:strip(w - NL / capacity),y:0},
            {x:w - TC,y:NL},
            {x:strip(w + (N - NL) / capacity),y:N}])
        .attr("class","line")
        .attr("id","expected-arrival")
        .attr("d",line)

    svg.append("path")
        .datum([{x:strip(w - NL / capacity),y:0},
            {x:strip(w + (N - NL) / capacity),y:N}])
        .attr("class","line")
        .attr("id","expected-departure")
        .attr("d",line)    
}

/**
* Update the user visualization after reaching a bottleneck equilibrium.
* @param {Array} userArray
*/
function updateUserBottleneckVisualization(userArray){
    var svg = d3.select("#main svg");
    var departures = svg.selectAll(".departure")
        .data(userArray,function(d){return d.id});

    departures.enter().append("circle")
            .attr("class", "departure")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.departureTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); })
            .style("fill", function(d) { return color(2); });

    departures.transition(2500)
            .attr("cx", function(d) { return x(d.departureTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); });

    departures.exit().transition(2500)
            .remove();
}

/**
* Update the user visualization.
* @param {Array} userArray
*/
function updateUserArrivalVisualization(userArray){
    var svg = d3.select("#main svg");
    var arrivals = svg.selectAll(".arrival")
        .data(userArray,function(d){return d.id});
    var wishedTimes = svg.selectAll(".wished")
        .data(userArray,function(d){return d.id});

    arrivals.enter().append("circle")
            .attr("class", "arrival")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.arrivalTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); })
            .style("fill", function(d) { return color(1); });

    arrivals.transition(2500)
            .attr("cx", function(d) { return x(d.arrivalTime); })
            .attr("cy", function(d) { return y(d.arrivalIndex); });

    arrivals.exit().transition(2500)
            .remove();

    wishedTimes.enter().append("circle")
            .attr("class", "wished")
            .attr("r", 3.5)
            .attr("cy", function(d) { return y(d.arrivalIndex); })
            .style("fill", function(d) { return color(0); });

    wishedTimes.transition(2500)
            .attr("cy", function(d) { return y(d.arrivalIndex); });

    wishedTimes.exit().transition(2500)
            .remove();
}

/**
* Plot the initial user visualization.
* @param {Array} userArray
*/
function initialCostVisualization(timeSliceArray,wishedTime,e,L){
    
    var costLine = d3.select("#cost-line")

    costData = timeSliceArray.map(function(timeSlice){
            var delayOnDeparture = (+timeSlice.startTime + timeSlice.delay) - wishedTime;
            var cost = (delayOnDeparture >= 0) ? +L * delayOnDeparture : -e * delayOnDeparture;
            return {'startTime':strip(timeSlice.startTime),
                'cost':timeSlice.delay + cost}; 
        })

    var line = d3.svg.line()
            .x(function(d){return x(d.startTime)})
            .y(function(d){return yCost(d.cost)});

    if (costLine.empty()) {
        var svg = d3.select("#main").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        yCost.domain(d3.extent(costData.map(function(d){return d.cost}))).nice();
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Time (hr)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yCostAxis)
            .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Cumulative Users")

        svg.append("path")
                .datum(costData)
                .attr("class", "line")
                .attr("id","cost-line")
                .attr("d",line);
    } else {
        costLine.datum(costData).transition().attr("d",line)
    }

}

/**
* Update the user cost
* @param{Array} timeSliceArray
*/