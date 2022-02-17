class V3Bar {

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
        vis.xScale = d3.scaleBand()
            .domain(vis.data.map(d => d.year))
            .range([0, vis.width])
            .paddingInner(0.1);
        
        vis.yScale = d3.scaleLinear()
            .domain([d3.max(vis.data, d => d.stat), 0])
            .range([0, vis.height]);

        // init axis
        vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0)
            .tickValues(vis.xScale.domain().filter(function(d,i){ return !(i%2)}));
        vis.yAxis = d3.axisLeft(vis.yScale).tickSizeOuter(0);

        // draw axis
        vis.xAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
            .call(vis.xAxis);
        
        vis.yAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        // Add rectangles
        vis.chart.selectAll('rect')
            .data(vis.data)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(d.stat))
                .attr('y', d => vis.yScale(d.stat))
                .attr('x', d => vis.xScale(d.year));
    }

    //leave this empty for now
    updateVis() { 
        
    
    }
  
    //leave this empty for now...
    renderVis() { 
    
    }  
}