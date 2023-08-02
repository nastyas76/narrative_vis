

d3.csv("https://nastyas76.github.io/narrative_vis/adult_census.csv").then(function(data) {
    processData(data);
  }).catch(function(error) {
    console.error("Error loading CSV file:", error);
  });
  
  function processData(data) {
    // Here, you can process the data as needed
    // 'data' will be an array of objects, where each object represents a row in the CSV file
    // You can access specific columns using object properties
  
    // For example, let's log the data to the console:
    console.log(data);
  }


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
  .attr("height", function(d) { return 10 * d; }) 
  .attr("y", function(d) { return 420 - 10 * d; }); 
