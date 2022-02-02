const router = new Navigo('/');

var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let meta;

// d3.json("meta.json").then(function (d) { meta = d });

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, width]);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")
    .call(d3.axisBottom().scale(x).tickSize(-height))

var y = d3.scaleLinear().range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft().scale(y).tickSize(-width));

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

const brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("end", update);

const surface = svg.append("g").attr("clip-path", "url(#clip)")

surface.append("g")
    .attr("class", "brush")
    .call(brush);

var idleTimeout
function idled() { idleTimeout = null; }

let data = []

function update(inc) {
    if (d3.event) {
        extent = d3.event.selection
        console.log(extent)

        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
            x.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]);
            y.domain([0, d3.max(data, d => d.count)]);
        } else {
            x.domain([x.invert(extent[0][0]), x.invert(extent[1][0])])
            y.domain([y.invert(extent[1][1]), y.invert(extent[0][1])])
            surface.select(".brush").call(brush.move, null)
        }

        xAxis.transition().duration(1000).call(d3.axisBottom().scale(x).tickSize(-height))
        yAxis.transition().duration(1000).call(d3.axisLeft().scale(y).tickSize(-width))
        surface
            .selectAll(".lineTest")
            .transition().duration(1000)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.count)))
    }
    else {
        console.log('No event...')
        data = [];
        for (const key in inc) {
            data.push({ date: d3.timeParse("%Y-%m-%d")(key), count: inc[key] })
        }
        data = data.sort((a, b) => a.date - b.date)

        x.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]);
        svg.selectAll(".myXaxis")
            .transition()
            .call(d3.axisBottom().scale(x).tickSize(-height));

        y.domain([0, d3.max(data, d => d.count)]);
        svg.selectAll(".myYaxis")
            .transition()
            .call(d3.axisLeft().scale(y).tickSize(-width));

        var updateSelection = surface.selectAll(".lineTest")
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
}

router.on('/', ({ data, params }) => {
    if (params) {
        d3.json(`data/${params.position}.json`).then(update)
        document.getElementById('dropdown').value = params.position;
    }
});

d3.select("#dropdown")
    .on("change", function () {
        console.log('changed')
        const position = d3.select(this).property("value");
        router.navigate(`/?position=${position}`);
    })

router.resolve();