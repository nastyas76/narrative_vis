var data = [4, 8, 15, 16, 23, 42];
document.getElementById("data").innerHTML= data;
d3.select(".chart")
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("width", 19)
    .attr("x", function(d,i) {return 20*i;})
    .attr("height", 20)
    .attr("y", 400)
    .transition()
    .attr("height", function(d) { return 10*d; })
    .attr("y", function(d) { return 400 - d; })
