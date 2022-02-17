class V1 {

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
        
        // group the data: I want to draw one line per group
        vis.sumstat = d3.group(vis.data, d => d.cat); // nest function allows to group the calculation per level of a factor
    
        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
        // // Initialize axes
        // Add X axis
        vis.xScale = d3.scaleLinear().range([ 0, vis.width ]);
        vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0)
            .ticks(d3.count(vis.data, (d) => d.year) / 6);    
        // Year is divided by 3 cuz each year appears 3 times (median, max, and 90th percentile), and we only need
        // each year once. Then divided by 2 so only every other year appears (thus divided by 6).
        
        vis.xAxisG = vis.chart.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${vis.height})`)

        // Add Y axis
        vis.yScale = d3.scaleLinear().range([ vis.height, 0 ]);
        vis.yAxis = d3.axisLeft(vis.yScale).tickSizeOuter(0);

        vis.yAxisG = vis.chart.append("g")
            .attr("class", "axis y-axis");
  
    }

    updateVis() { 
        let vis = this;

        // Set scale domains
        vis.xScale.domain(d3.extent(vis.data, (d) => d.year))
        vis.yScale.domain([0, d3.max(vis.data, (d) => d.stat)])
                // color palette
        vis.colorScale = d3.scaleOrdinal()
                .range(['#e41a1c','#377eb8','#4daf4a'])

        vis.renderVis()
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        vis.chart.selectAll(".line")
            .data(vis.sumstat)
            .join("path")
                .attr("stroke", (d) => vis.colorScale(d[0]))
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr("d", function(d){
                    return d3.line()
                        .x((d) => vis.xScale(d.year))
                        .y((d) => vis.yScale(d.stat))
                        (d[1]) //this is the array of values 
                })
        
        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }  
}