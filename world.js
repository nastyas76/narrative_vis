
var values = ['CO2 Emissions', 'Out of Pocket Health Expenditure (%)', 'Urban Population']

var GDPSlider = document.getElementById("slider");
var categorySelector = document.getElementById("category");

var index = 0;
var forthIndex = 0;

var allData;

d3.csv("https://nastyas76.github.io/narrative_vis/world-data-23-adjusted.csv").then(function (data) {

    allData = data;

    var min = Math.min.apply(null, data.map(function (a) { return a.GDP; }))
        , max = Math.max.apply(null, data.map(function (a) { return a.GDP; }))


    
    displayChart(allData, values[index]);

    var previousButton = document.getElementById("previousButton");
    var nextButton = document.getElementById("nextButton");

    previousButton.classList.add("hidden")

    previousButton.addEventListener('click', () => {
            index--;
        
        // Hide/Show Next Button and forth div based on the index value
        if (index <= 0) {
            index = 0;
            previousButton.classList.add("hidden");
            displayChart(allData, values[index]);
        } else {
            nextButton.classList.remove("hidden");
            document.getElementById("forth").classList.add("hidden");
            displayChart(allData, values[index]);
        }
        
    })

    nextButton.addEventListener('click', () => {
        index++;
        if (index >= 3) {
            index = 3;
            GDPSlider.min = min;
            GDPSlider.max = max;
            nextButton.classList.add("hidden")
            document.getElementById("forth").classList.remove("hidden");
            document.getElementById('chart').innerHTML = ''; 
            displayChart(allData, values[forthIndex]);
        }
        if (index >= 0 && index < 3) {
            previousButton.classList.remove("hidden")
            document.getElementById("forth").classList.add("hidden");
            displayChart(allData, values[index]);
        }
    })

    GDPSlider.addEventListener("input", function () {
        document.getElementById("rangevalue").innerHTML = GDPSlider.value;
        displayChart(allData, values[forthIndex])
    }, false);

    categorySelector.addEventListener("change", function () {
        forthIndex = categorySelector.value;
        displayChart(allData, values[forthIndex])
    }, false);


});


function displayChart(values, property) {
    var chartData = values;
    var minGDP = 0
    if (!document.getElementById("forth").classList.contains("hidden")) {
        minGDP = GDPSlider.value
    }

    // reset chart area
    document.getElementById('chart').innerHTML = '';

    chartData = values.filter(function (d) { return d.GDP > minGDP; });

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

    chartData.forEach(function (d) {
        d['Life expectancy'] = +d['Life expectancy'];
        d[property] = +d[property];
        d.GDP = +d.GDP;
    });
    

    x.domain([0,d3.extent(chartData, function (d) { return d[property]; })[1]]).nice();
    y.domain(d3.extent(chartData, function (d) { return d['Life expectancy']; })).nice();
    var totalGDP = d3.sum(chartData, function (d) { return d.GDP; });

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

    var filteredData = chartData.filter(function (d) { return (d.GDP / totalGDP) < 0.035; });

    var meanX = d3.deviation(filteredData, function (d) { return x(d[property]); });
    var meanY = d3.deviation(filteredData, function (d) { return y(d['Life expectancy']); });
    var avg = d3.mean(filteredData, function (d) { return x(d[property]); });

    var annotations = [{
        note: {
            label: `This is the mean of the graph. It shows a trend of low ${property.toLowerCase()} and high life expectancy.`,
            title: "Mean"
        },
        x: meanX,
        y: meanY,
        dy: meanY -80,
        dx: 80,
        subject: { radius: 30, radiusPadding: 10 },
    }];


    if (document.getElementById("forth").classList.contains("hidden")) {
        svg.selectAll(".dot")
            .data(chartData)
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
            .style("font-size", 15)
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
        .data(chartData);

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
        
    }


    if (property == 'CO2 Emissions') {
        document.getElementById("description").innerHTML = "In this visualization, we can see that there is a negative correlation between CO2 emissions and life expectancy. This means that as CO2 emissions increase, life expectancy decreases. This is because CO2 emissions are a proxy for pollution, and pollution is bad for health. This is a trend that is seen in many countries, and is a major reason why countries are trying to reduce their CO2 emissions."

    } else if (property == 'Out of Pocket Health Expenditure (%)') {
        document.getElementById("description").innerHTML = "Here, a negative correlation between out of pocket health expenditure and life expectancy can be seen. This means that as out of pocket health expenditure increases, life expectancy decreases. This is because out of pocket health expenditure is a proxy for the quality of healthcare. This is a trend that is seen in many countries, and is a major reason why it is a good idea for countries to reduce their out of pocket health expenditure."

    } else if (property == 'Urban Population') {
        document.getElementById("description").innerHTML = "A negative correlation also dominates this graph. This means that as urban population increases, life expectancy decreases. This is because urban population is a proxy for pollution, and pollution has adverse effects on health. A reduction in pollution in urban areas, which are known to be a major source of CO2 emissions, by switching to greener practices and cars, would be a way to reduce the effects of large urban populations on life expectancy."

    } else {
        document.getElementById("description").innerHTML = ""
    }

}
