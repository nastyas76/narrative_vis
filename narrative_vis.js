//load data
async function init() {
  data = await d3.csv("https://nastyas76.github.io/narrative_vis/adult_census.csv");
  console.log(data);

  // Convert numeric values to numbers
  data.forEach(d => {
    d.age = +d.age;
    d.education = +d.education;
    d.income = +d.income;
  }
  );
  // initialize scene index and render first scene
  let sceneIndex = 0;
  renderScene(sceneIndex);

  // Handle "Next Scene" button click
  const nextButton = document.getElementById("nextButton");
  nextButton.addEventListener("click", function() {
    sceneIndex++;
    if (sceneIndex >= scenes.length) {
      sceneIndex = 0;
    }
    renderScene(sceneIndex);
  }
  );
  // Function to render each scene
  function renderScene(index) {
    const scene = scenes[index];
    const xLabel = scene.xLabel;
    const yLabel = scene.yLabel;
    const xDataKey = scene.xDataKey;
    const yDataKey = scene.yDataKey;


    // Remove existing SVG
    d3.select("#chart").selectAll("svg").remove();

    // Set up SVG dimensions
    const margin = {
      top: 30,
      right: 30,
      bottom: 50,
      left: 60
    };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom; 

    // Create SVG element
    const svg = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    console.log(svg);

    // Set up scales
    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d[xDataKey])).range([0, width]);
    const yScale = d3.scaleLinear().domain(d3.extent(data, d => d[yDataKey])).range([height, 0]);


    // Draw the bar chart
    svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", d => xScale(d[xDataKey])).attr("width", 10).attr("y", d => yScale(d[yDataKey])).attr("height", d => height - yScale(d[yDataKey]));

    // Add axis labels
    svg.append("text").attr("class", "axis-label").attr("x", width / 2).attr("y", height + 40).attr("text-anchor", "middle").text(xLabel);
    svg.append("text").attr("class", "axis-label").attr("x", -height / 2).attr("y", -40).attr("text-anchor", "middle").attr("transform", "rotate(-90)").text(yLabel);
    
    // Add chart title
    svg.append("text").attr("class", "chart-title").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").text(scene.title);

    // Add axis titles
    svg.append("text").attr("class", "axis-title").attr("x", width / 2).attr("y", height + 40).attr("text-anchor", "middle").text(xLabel);
    svg.append("text").attr("class", "axis-title").attr("x", -height / 2).attr("y", -40).attr("text-anchor", "middle").attr("transform", "rotate(-90)").text(yLabel);
  }

// Constants for the scenes
const scenes = [
  {
    title: "Scene 1: Relationship between Age and Education",
    xLabel: "Age",
    yLabel: "Education",
    xDataKey: "age",
    yDataKey: "education",
  },
  {
    title: "Scene 2: Relationship between Age and Income",
    xLabel: "Age",
    yLabel: "Income",
    xDataKey: "age",
    yDataKey: "income",
  },
  {
    title: "Scene 3: Relationship between Education and Income",
    xLabel: "Education",
    yLabel: "Income",
    xDataKey: "education",
    yDataKey: "income",
  },
  {
    title: "Scene 4: Interactive Exploration",
    xLabel: "Age",
    yLabel: "Education",
    xDataKey: "age",
    yDataKey: "education",
  },
];


d3.csv("https://nastyas76.github.io/narrative_vis/adult_census.csv").then(function(data) {
  processData(data);
}).catch(function(error) {
  console.error("Error loading CSV file:", error);
});

function processData(data) {
  // Convert numeric values to numbers
  data.forEach(d => {
    d.age = +d.age;
    d.education = +d.education;
    d.income = +d.income;
  });

  // Initialize scene index and render first scene
  let sceneIndex = 0;
  renderScene(sceneIndex);

  // Handle "Next Scene" button click
  const nextButton = document.getElementById("nextButton");
  nextButton.addEventListener("click", function() {
    sceneIndex++;
    if (sceneIndex >= scenes.length) {
      sceneIndex = 0;
    }
    renderScene(sceneIndex);
  });

  // Function to render each scene
  function renderScene(index) {
    const scene = scenes[index];
    const xLabel = scene.xLabel;
    const yLabel = scene.yLabel;
    const xDataKey = scene.xDataKey;
    const yDataKey = scene.yDataKey;

    // Remove existing SVG
    d3.select("#chart").selectAll("svg").remove();

    // Set up SVG dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d[xDataKey])).range([0, width]);
    const yScale = d3.scaleLinear().domain(d3.extent(data, d => d[yDataKey])).range([height, 0]);

    // Draw the bar chart
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d[xDataKey]))
      .attr("width", 10)
      .attr("y", d => yScale(d[yDataKey]))
      .attr("height", d => height - yScale(d[yDataKey]));

    // Add axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text(xLabel);

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text(yLabel);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(scene.title);
  }
  }
}

init();
