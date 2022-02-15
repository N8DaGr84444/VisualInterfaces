class StackedAreaChart {

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
        
        vis.stack = d3.stack()
            .keys([0,1,2,3,4,5]);
        // Gropu data per category
        console.log('Grouping data')
        vis.groupedData = d3.groups(vis.data, d => d.year);
        console.log('Creating stack')
        vis.stack.value((d, key) => d[1][key].stat)
        vis.stackedData = vis.stack(vis.groupedData);

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        // Area
        console.log('setting svg area')
        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);
        vis.area = d3.area()
            .x((d,i) => vis.xScale(d.data[0]))
            .y0(d => vis.yScale(d[0]))
            .y1(d => vis.yScale(d[1]))
        
        // Set the scale input domains
        // vis.xScale.domain(d3.extent(vis.data, (d) => d.year));
        // vis.yScale.domain([0,d3.max(vis.stackedData[vis.stackedData.length - 1], (d) => d[1])]);
        // // Initialize axes
        // Add X axis --> it is a date format
        console.log('x axis')
        const x = d3.scaleLinear()
            .domain(d3.extent(vis.data, function(d) { return d.year; }))
            .range([ 0, vis.width ]);
        console.log('appending x axis')
        vis.chart.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x).ticks(d3.count(vis.data, function(d) { return d.year; }) /6));
        // Year is divided by 3 cuz each year appears 3 times (median, max, and 90th percentile), and we only need
        // each year once. Then divided by 2 so only every other year appears (thus divided by 6).

        // Add Y axis
        console.log('y axis')
        const y = d3.scaleLinear()
            .domain([0, d3.max(vis.data, function(d) { return +d.stat; })])
            .range([ vis.height, 0 ]);
        vis.chart.append("g")
            .call(d3.axisLeft(y));

        // // Draw the line
        // color palette
        console.log('color palette')
        // const color = d3.scaleOrdinal()
        //     .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'])
        vis.colorScale = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33']);
        vis.colorScale.domain([0,1,2,3,4,5]);
        console.log('Stacked data: ', vis.stackedData)
        vis.chart.selectAll('.area-path')
            .data(vis.stackedData)
            .join('path').transition()
                .attr('class', 'area-path')
                .attr('d', vis.area)
                .attr('fill', d => vis.colorScale(d.key));
                // .attr('fill', function(d){ return color(d[0]) });
    }

    //leave this empty for now
    updateVis() { 
        
    
    }
  
    //leave this empty for now...
    renderVis() { 
    
    }  
}