document.addEventListener('DOMContentLoaded', () => {
  req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function() {
    json = JSON.parse(req.responseText);
    let dataset = json.data.map((arr) => [d3.timeParse('%Y-%m-%d')(arr[0]), arr[1]]);
    
    const w = 1000;
    const h = 600;
    const padding = 100;
    
    const xScale = d3.scaleTime()
                     .domain([d3.min(dataset, (d) => d[0]), d3.max(dataset, (d) => d[0])])
                     .range([padding, w - padding]);
    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([h - padding, padding]);
    const yScaleFactor = d3.max(dataset, (d) => d[1]) / (h - 2 * padding);
    
    const tooltip = d3.tip()
                      .attr('id', 'tooltip')
                      .offset([-10, 0])
                      .html((d, i) => {
                         let month = d3.timeFormat('%B');
                         let year = d3.timeFormat('%Y');
                         let str = year(d[0]);
                         tooltip.attr('data-date', json.data[i][0])
                         switch(month(d[0])) {
                           case 'January':
                             str += " Q1";
                             break;
                           case 'April':
                             str += " Q2";
                             break;
                           case 'July':
                             str += " Q3";
                             break;
                           case 'October':
                             str += " Q4";
                             break;
                         }
                         str += "<br>$" + d[1] + " Billion";
                         return str;
                      });
    
    const svg = d3.select('body')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)
                  .call(tooltip);
    
    d3.select('svg')
      .append('text')
      .text('United States GDP')
      .attr('id', 'title')
      .attr('x', 300)
      .attr('y', 60);
      
    d3.select('svg')
      .append('text')
      .text('Gross Domestic Product')
      .attr('class', 'axis-title').attr('transform', 'translate(45, 375)rotate(-90)');
    
    d3.select('svg')
      .append('text')
      .text('More information: https://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('x', 480)
      .attr('y', 550);
    
    svg.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('x', (d, i) => xScale(d[0]))
       .attr("data-date", (d, i) => json.data[i][0])
       .attr('y', (d, i) => yScale(d[1]))
       .attr("data-gdp", (d, i) => d[1])
       .attr('width', 3)
       .attr('height', (d, i) => d[1]/yScaleFactor)
       .attr('class', 'bar')
       .on('mouseover', tooltip.show)
       .on('mouseout', tooltip.hide);
    
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    
    svg.append('g')
       .attr('id', 'x-axis') 
       .attr('transform', 'translate(0,' + (h - padding) + ')')
       .call(xAxis);
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
  }
});