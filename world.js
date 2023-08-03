
var values = ['Co2-Emissions', 'Out of pocket health expenditure', 'Urban_population']

var GDPSlider = document.getElementById("slider");
var categorySelector = document.getElementById("category");

var index = 0;

d3.csv("https://nastyas76.github.io/narrative_vis/world-data-23-adjusted.csv").then(function (data) {


    var min = Math.min.apply(null, data.map(function (a) { return a.GDP; }))
        , max = Math.max.apply(null, data.map(function (a) { return a.GDP; }))



    displayChart(data, values[index]);

    var previousButton = document.getElementById("previousButton");
    var nextButton = document.getElementById("nextButton");

    previousButton.classList.add("hidden")

    previousButton.addEventListener('click', () => {
        index--;
        displayChart(data, values[index]);
        if (index <= 0) {
            index = 0;
            previousButton.classList.add("hidden")
            document.getElementById("forth").classList.remove("hidden");
        }
        if (index < 3) {
            // hide div
            nextButton.classList.remove("hidden")
            document.getElementById("forth").classList.add("hidden");
        }
    })

    nextButton.addEventListener('click', () => {
        index++;
        displayChart(data, values[index]);
        if (index >= 3) {
            index = 3;
            GDPSlider.min = min;
            GDPSlider.max = max;
            nextButton.classList.add("hidden")
            document.getElementById("forth").classList.remove("hidden");
            console.log("should be displayed")
        }
        if (index > 0 && index < 3) {
            previousButton.classList.remove("hidden")
            document.getElementById("forth").classList.add("hidden");
        }
    })

    GDPSlider.addEventListener("change", function () {
        document.getElementById("rangevalue").innerHTML = GDPSlider.value;
        displayChart(data, values[index])
    }, false);

    categorySelector.addEventListener("change", function () {
        index = categorySelector.value;
        displayChart(data, values[index])
    }, false);


});


function displayChart(values, property) {
    var minGDP = 0
    if (!document.getElementById("forth").classList.contains("hidden")) {
        minGDP = GDPSlider.value
    }
    // reset chart area
    data = values.filter(function (d) { return d.GDP > minGDP; });


     var minGDP = 0;
    if (!document.getElementById("forth").classList.contains("hidden")) {
        minGDP = GDPSlider.value;
    }
    // reset chart area
    data = values.filter(function (d) { return d.GDP > minGDP; });

    document.getElementById('chart').innerHTML = '';


    document.getElementById('chart').innerHTML = '';

    var margin = { top: 60, right: 20, bottom: 30, left: 100 },
        width = window.innerWidth - 100 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (d) {
        d['Life expectancy'] = +d['Life expectancy'];
        d[property] = +d[property];
        d.GDP = +d.GDP;
    });

    x.domain(d3.extent(data, function (d) { return d[property]; })).nice();
    y.domain(d3.extent(data, function (d) { return d['Life expectancy']; })).nice();
    var totalGDP = d3.sum(data, function (d) { return d.GDP; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr('x', width - margin.right)
        .attr("y", -10)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(property);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".71em")
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text("Life Expectancy")

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top + 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(`Graph of ${property} verses Life expectancy by Country`);

    // var zoom = d3.zoom()
    //     .scaleExtent([1, 10])
    //     .translateExtent([[0, 0], [width, height],])
    //     .on("zoom", function () {
    //         svg.attr("transform", d3.event.transform);
    //         x.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    //         y.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    //     });

    // if (!document.getElementById("forth").classList.contains("hidden")) {
    //     // svg.call(zoom);
    // }

    var legend = svg.append("g")
        .attr("class", "legend")
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    // Draw rects, and color them by original_index
    legend.append("rect")
        .attr("width", 100)
        .attr("height", 50)
        .style("fill", "red");

    legend.append("text")
        .attr("x", width - 24)
        .attr("dy", "0.50em")
        .text(function (d) { return d.Country; });

    var filteredData = data.filter(function (d) { return (d.GDP / totalGDP) < 0.035; });

    var meanX = d3.deviation(filteredData, function (d) { return x(d[property]); });
    var meanY = d3.deviation(filteredData, function (d) { return y(d['Life expectancy']); });

    var annotations = [{
        note: {
            label: "These countries have low CO2 emissions and high life expectancy",
            title: "Cluster of Countries"
        },
        x: meanX,
        y: meanY,
        dy: -50,
        dx: 50,
        subject: { radius: 50, radiusPadding: 10 },
    }];


    if (document.getElementById("forth").classList.contains("hidden")) {
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function (d) { return Math.max(3.5, (d.GDP / (totalGDP)) * 100); })
            .attr("cx", function (d) { return x(d[property]); })
            .attr("cy", function (d) { return y(d['Life expectancy']); })
            .style("fill", function (d) { return color(d.Country); })
            var makeAnnotations = d3.annotation()
            .annotations(annotations);

        // Add the annotation to the chart
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);

        // Draw a circle around each cluster
        svg.append("circle")
            .attr("class", "cluster-circle")
            .attr("cx", meanX)
            .attr("cy", meanY)
            .attr("r", 70)
            .style("fill", "none")
            .style("stroke", "black");
    } else {
        var dots = svg.selectAll(".dot")
        .data(data);

        dots.enter().append("circle")
            .attr("class", "dot")
            .merge(dots) // Merge the enter and update selections
            .attr("r", function (d) { return Math.max(3.5, (d.GDP / (totalGDP)) * 100); })
            .attr("cx", function (d) { return x(d[property]); })
            .attr("cy", function (d) { return y(d['Life expectancy']); })
            .style("fill", function (d) { return color(d.Country); })
            .on('mouseover', function () {
                d3.select(this).attr('stroke', '#000').attr('stroke-width', 1);
            })
            .on('mouseout', function () {
                d3.select(this).attr('stroke', null);
            })
            .append('title')
            .text(function (d) { return `Country: ${d.Country} \n${property}: ${d[property]}\nLife Expectancy: ${d['Life expectancy']}` });

        dots.exit().remove(); 

        // svg.selectAll(".dot")
        //     .data(data)
        //     .enter().append("circle")
        //     .attr("class", "dot")
        //     .attr("r", function (d) { return Math.max(3.5, (d.GDP / (totalGDP)) * 100); })
        //     .attr("cx", function (d) { return x(d[property]); })
        //     .attr("cy", function (d) { return y(d['Life expectancy']); })
        //     .style("fill", function (d) { return color(d.Country); })
        //     .on('mouseover', function () {
        //         d3.select(this).attr('stroke', '#000').attr('stroke-width', 1);
        //     })
        //     .on('mouseout', function () {
        //         d3.select(this).attr('stroke', null);
        //     })
        //     .append('title')
        //     .text(function (d) { return `Country: ${d.Country} \n${property}: ${d[property]}\nLife Expectancy: ${d['Life expectancy']}` });
        
    }



    if (property == 'Co2-Emissions') {
        document.getElementById("description").innerHTML = "Description for Co2 Emissions"

    } else if (property == 'Out of pocket health expenditure') {
        document.getElementById("description").innerHTML = "Description forOut of pocket health expenditure"

    } else if (property == 'Urban_population') {
        document.getElementById("description").innerHTML = "Description for Urban_population"

    } else {
        document.getElementById("description").innerHTML = ""
    }

}


