class Line {

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
        const sumstat = d3.group(vis.data, d => d.cat); // nest function allows to group the calculation per level of a factor
        console.log('Sumstat: ', sumstat);
    
        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
    
        // // Initialize axes
        // Add X axis --> it is a date format
        console.log('x axis')
        const x = d3.scaleLinear()
            .domain(d3.extent(vis.data, function(d) { return d.year; }))
            .range([ 0, vis.width ]);
        console.log('appending x axis')
        vis.chart.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0)
                .ticks(d3.count(vis.data, function(d) { return d.year; }) /6));
        // Year is divided by 3 cuz each year appears 3 times (median, max, and 90th percentile), and we only need
        // each year once. Then divided by 2 so only every other year appears (thus divided by 6).

        // Add Y axis
        console.log('y axis')
        const y = d3.scaleLinear()
            .domain([0, d3.max(vis.data, function(d) { return d.stat; })])
            .range([ vis.height, 0 ]);
        vis.chart.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0));

        // // Draw the line
        // color palette
        console.log('color palette')
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a'])

        console.log('drawing line')
        vis.chart.selectAll(".line")
            .data(sumstat)
            .join("path")
                .attr("stroke", function(d){ return color(d[0]) })
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr("d", function(d){
                    console.log('function d: ', d)
                    return d3.line()
                        .x(function(d) { return x(d.year); })
                        .y(function(d) { return y(d.stat); })
                        (d[1]) //this is the array of values 
                })
  
    }

    //leave this empty for now
    updateVis() { 
        
    
    }
  
    //leave this empty for now...
    renderVis() { 
    
    }  
}