// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialise a X axis:
var x = d3.scaleTime().range([0, width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")

// Initialize an Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
    .attr("class", "myYaxis")

// Create a function that takes a dataset as input and update the plot:
function update(inc) {
    const data = inc.map(function (d) {
        return { date: d3.timeParse("%Y-%m-%d")(d.date), count: d.count }
    })

    // Create the X axis:
    x.domain([d3.min(data, function (d) { return d.date }), d3.max(data, function (d) { return d.date })]);
    svg.selectAll(".myXaxis")
        .transition()
        .call(xAxis);

    // create the Y axis
    y.domain([0, d3.max(data, function (d) { return d.count })]);
    svg.selectAll(".myYaxis")
        .transition()
        .call(yAxis);

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest")
        .data([data], function (d) { return d.date });

    // Updata the line
    u
        .enter()
        .append("path")
        .attr("class", "lineTest")
        .merge(u)
        .transition()
        .attr("d", d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.count); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
}

d3.select('#dropdown')
    .on('change', function () {
        const country = d3.select(this).property('value');
        d3.json(`data/${country}.json`).then(update)
    })

d3.json("data/sweden.json").then(update)