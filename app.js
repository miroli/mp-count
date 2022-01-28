var margin = { top: 10, right: 30, bottom: 30, left: 20 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, width]);
var xAxis = d3.axisBottom().scale(x).tickSize(-height);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")

var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y).tickSize(-width)
svg.append("g")
    .attr("class", "myYaxis")

function update(inc) {
    const data = []
    for (const key in inc) {
        data.push({ date: d3.timeParse("%Y-%m-%d")(key), count: inc[key] })
    }

    x.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]);
    svg.selectAll(".myXaxis")
        .transition()
        .call(xAxis);

    y.domain([0, d3.max(data, d => d.count)]);
    svg.selectAll(".myYaxis")
        .transition()
        .call(yAxis);

    var updateSelection = svg.selectAll(".lineTest")
        .data([data], d => d.date);

    updateSelection
        .enter()
        .append("path")
        .attr("class", "lineTest")
        .merge(updateSelection)
        .transition()
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.count)))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
}

d3.select("#dropdown")
    .on("change", function () {
        const country = d3.select(this).property("value");
        d3.json(`data/${country}.json`).then(update)
    })

d3.json("data/Q19269361.json").then(update)