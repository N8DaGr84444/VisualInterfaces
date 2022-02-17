class V5 {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 10, bottom: 30, right: 50, left: 100 }
        }
  
        this.data = _data;
    
        // Call a class function
        this.initVis();
    }
  
    initVis() {
        
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

        // scales
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);
        
        vis.yScale = d3.scaleBand()
            .range([0, vis.height]);

        // init axis
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // draw axis
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis');
    }

    //leave this empty for now
    updateVis() { 
        let vis = this;

        // process data
        vis.processedData = []
        let totalDays = vis.data[0].total
        vis.data.forEach(d => {
            vis.processedData.push({"cat": d.cat, "stat": d.stat / 365 * 100})
        });

        // set scale domains
        vis.xScale.domain([0, d3.max(vis.processedData, d => d.stat)]);
        vis.yScale.domain(vis.processedData.map(d => d.cat))
            .paddingInner(0.1);

        // configure ticks
        vis.xAxis.tickSizeOuter(0);
        vis.yAxis.tickSizeOuter(0);

        vis.renderVis();
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        // Add rectangles
        vis.chart.selectAll('rect')
            .data(vis.processedData)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', d => vis.xScale(d.stat))
                .attr('height', vis.yScale.bandwidth())
                .attr('y', d => vis.yScale(d.cat))
                .attr('x', 0);
        
        // Draw axis
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }  
}