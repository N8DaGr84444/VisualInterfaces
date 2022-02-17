class V2 {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 140,
        margin: { top: 10, bottom: 30, right: 50, left: 50 }
    };
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear().range([0, vis.width]);

    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.colorScale = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33']);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.format("d")); // Remove thousand comma

    vis.yAxis = d3.axisLeft(vis.yScale);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chartContainer = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.chart = vis.chartContainer.append("g");

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");

    vis.stack = d3.stack().keys([0, 1, 2, 3, 4, 5]);

    // vis.axisTitle = vis.chartContainer
    //   .append("text")
    //   .attr("class", "axis-label")
    //   .attr("y", -18)
    //   .attr("x", -25)
    //   .attr("dy", "0.35em")
    //   .text("Trillion m³");

    /*
    // We need to make sure that the tracking area is on top of other chart elements
    vis.marks = vis.chart.append('g');
    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

        //(event,d) => {

    // Empty tooltip group (hidden by default)
    vis.tooltip = vis.chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    vis.tooltip.append('text');
    */
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    // Group the data per year
    vis.groupedData = d3.groups(vis.data, (d) => d.year);

    // Prepare the data for rendering
    vis.stack.value((d, key) => d[1][key].stat);
    vis.stackedData = vis.stack(vis.groupedData);

    vis.area = d3.area()
      .x((d, i) => vis.xScale(d.data[0]))
      .y0((d) => vis.yScale(d[0]))
      .y1((d) => vis.yScale(d[1]));
    //.curve(d3.curveStepAfter);

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, (d) => d.year));
    vis.xAxis.tickSizeOuter(0);
    vis.colorScale.domain([0, 1, 2, 3, 4, 5]);

    vis.yScale.domain([0, d3.max(vis.stackedData[vis.stackedData.length - 1], (d) => d[1])]);
    // vis.yScale.domain([0, 365]);
    // vis.yAxis.tickFormat((d) => d / 1000);
    vis.yAxis.tickSizeOuter(0);

    // vis.yScale = d3.scaleLinear()
    //     .domain([0, 365])
    //     .range([vis.height, 0]); 

    vis.renderVis();
  }

  /**
   * This function contains the D3 code for binding data to visual elements
   * Important: the chart is not interactive yet and renderVis() is intended
   * to be called only once; otherwise new paths would be added on top
   */
  renderVis() {
    let vis = this;

    // Add line path
    console.log(vis.stackedData);
    vis.chart
      .selectAll(".area-path")
      .data(vis.stackedData)
      .join("path")
      .transition()
      .attr("class", "area-path")
      .attr("d", vis.area)
      .attr("fill", (d) => vis.colorScale(d.key));
    
    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
