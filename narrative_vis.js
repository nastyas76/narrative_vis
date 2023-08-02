var data = [4, 8, 15, 16, 23, 42];
document.getElementById("data").innerHTML= data;
d3.select(".chart")
  .selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("width", 19)
  .attr("x", function(d, i) { return 20 * i; })
  .attr("height", 0) 
  .attr("y", 420) 
  .transition().delay(500).duration(5000)
  .attr("height", function(d) { return 10 * d; }) // Set the target height
  .attr("y", function(d) { return 420 - 10 * d; }); // Set the target y position
