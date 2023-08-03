const margin = { top: 10, right: 10, bottom: 20, left: 20 };
const height = 500;
const width = 700;

d3.csv("https://nastyas76.github.io/narrative_vis/world-data-23_adjusted.csv", function(data) {
  console.log(data);

  dataTop20 = data.sort(function(a, b) { return +a.GDP - +b.GDP; })
                  .filter(function(d, i) { return i < 20; });

  x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d['Co2-Emissions'])])
    .range([margin.left, width - margin.right])
    .nice();

  y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d['Life expectancy'])])
    .range([height - margin.bottom, margin.top])
    .nice();

  color = d3.scaleOrdinal()
    .domain(data.map(d => d.Country))
    .range(d3.schemeTableau10);

  size = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.GDP))
    .range([4, 35]);

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    // Add x-axis title 'text' element.
    .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('x', width - margin.right)
      .attr('y', -10)
      .text('Co2 Emissions');

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y))
    // Add y-axis title 'text' element.
    .append('text')
      .attr('transform', `translate(20, ${margin.top}) rotate(-90)`)
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Life Expectancy');

  const countries = svg
    .selectAll('circle')
    .data(dataTop20)
    .join('circle')
      .sort((a, b) => b.pop - a.pop) 
      .attr('class', 'country')
      .attr('opacity', 0.75)
      .attr('fill', d => color(d.Country))
      .attr('cx', d => x(d['Co2-Emissions']))  
      .attr('cy', d => y(d['Life expectancy']))
      .attr('r', d => size(d.GDP));

  // add a tooltip
  countries
    .append('title')
    .text(d => d.Country);

  // Add mouse hover interactions, using D3 to update attributes directly.
  // In a stand-alone context, we could also use stylesheets with 'circle:hover'.
  countries
    // The 'on()' method registers an event listener function
    .on('mouseover', function() {
      // The 'this' variable refers to the underlying SVG element.
      // We can select it directly, then use D3 attribute setters.
      // (Note that 'this' is set when using "function() {}" definitions,
      //  but *not* when using arrow function "() => {}" definitions.)
      d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
    })
    .on('mouseout', function() {
      // Setting the stroke color to null removes it entirely.
      d3.select(this).attr('stroke', null);
    });

    // Add a legend.



    // Add a title.
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text('Top 20 Countries by GDP');


});

