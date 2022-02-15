class Vis3C {

  constructor(_config, _data) {
      this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 500,
          containerHeight: _config.containerHeight || 140,
          margin: { top: 10, bottom: 30, right: 50, left: 50 }
      }

      this.data = _data;
  
      // Call a class function
      this.initVis();
  }

  initVis() {
      console.log('init vis')
      let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                      //so it is good to create a variable that is a reference to 'this' class instance
  
      //set up the width and height of the area where visualizations will go- factoring in margins               
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      // // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // // Append group element that will contain our actual chart (see margin convention)
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      	// Initialize linear and ordinal scales (input domain and output range)
      // const yScale = d3.scaleLinear()
      //   .domain([0, d3.max(vis.data, d => d.stat)]) //max from sales field in the objects in the data array
      //   .range([0, vis.width]); 

      // const xScale = d3.scaleBand()
      //   .domain(vis.data.map(d => d.year)) //list of the month field in the objects in the data array
      //   .range([0, vis.height])
      //   .paddingInner(0.1);
      console.log('define scales')
      const xScale = d3.scaleBand().range ([0, vis.width]).padding(0.4);
      const yScale = d3.scaleLinear().range ([vis.height, 0]);
      console.log('define scale domains')
      xScale.domain(vis.data.map(d => d.year));
      yScale.domain([0, d3.max(vis.data, d=> d.stat)]);
      console.log('define axis')

      vis.chart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

      vis.chart.append("g")
        .call(d3.axisLeft(yScale));
        // .call(d3.axisLeft(yScale).tickFormat(function(d){
        //     return "$" + d;
        // }).ticks(10))
        // .append("text")
        // .attr("y", 6)
        // .attr("dy", "0.71em")
        // .attr("text-anchor", "end")
        // .text("value");
      // Initialize axes
      // const xAxis = d3.axisBottom(xScale);
      // const yAxis = d3.axisLeft(yScale);
      // // Draw the axis
      // console.log('draw x axis')
      // const xAxisGroup = vis.chart.append('g')
      //   .attr('class', 'axis x-axis') 
      //   .call(xAxis);
      // console.log('draw y axis')
      // const yAxisGroup = vis.chart.append('g')
      //   .attr('class', 'axis y-axis')
      //   .call(yAxis);

      console.log('drawing line')
      // vis.chart.selectAll(".line")
      //     .data(sumstat)
      //     .join("path")
      //         .attr("stroke", function(d){ return color(d[0]) })
      //         .attr('fill', 'none')
      //         .attr('stroke-width', 2)
      //         .attr("d", function(d){
      //             console.log('function d: ', d)
      //             return d3.line()
      //                 .x(function(d) { return x(d.year); })
      //                 .y(function(d) { return y(d.stat); })
      //                 (d[1]) //this is the array of values 
      //         })
          // Add rectangles
      // vis.chart.selectAll('rect')
      //   .data(vis.data)
      //   .enter()
      //   .append('rect')
      //     .attr('class', 'bar')
      //     .attr('fill', 'steelblue')
      //     .attr('width', d => xScale(d.year))
      //     .attr('height', yScale.bandwidth())
      //     .attr('y', d => yScale(d.stat))
      //     .attr('x', 0);

  }

  //leave this empty for now
  updateVis() { 
      
  
  }

  //leave this empty for now...
  renderVis() { 
  
  }  
}