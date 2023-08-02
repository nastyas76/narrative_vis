

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
