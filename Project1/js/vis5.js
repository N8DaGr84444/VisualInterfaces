class V5 {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 40, bottom: 35, right: 50, left: 70 },
            inputCounty: 'Honolulu'
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
        vis.chartWidth = vis.width / 2 - 50;

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
        
        // Add svg title
        vis.svg.append("text")
            .attr("y", 25)
            .attr("x", vis.chartWidth - 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text("Percentage of Days in Year Each Pollutant was Main Pollutant");
    
        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        vis.chart2 = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left + vis.chartWidth + 80},${vis.config.margin.top})`);

        // scales
        vis.hamiltonxScale = d3.scaleLinear()
            .range([0, vis.chartWidth]);
        vis.comparexScale = d3.scaleLinear()
            .range([0, vis.chartWidth]);
        
        vis.hamiltonyScale = d3.scaleBand()
            .range([0, vis.height]);
        vis.compareyScale = d3.scaleBand()
            .range([0, vis.height]);

        // init axis
        vis.hamiltonxAxis = d3.axisBottom(vis.hamiltonxScale);
        vis.hamiltonyAxis = d3.axisLeft(vis.hamiltonyScale);
        vis.comparexAxis = d3.axisBottom(vis.comparexScale);
        vis.compareyAxis = d3.axisLeft(vis.compareyScale);

        // draw axis
        vis.hamiltonxAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);          
        vis.hamiltonxAxisGroup.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Days (%)");

        vis.hamiltonyAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis');
        vis.hamiltonyAxisGroup.append("text")
            .attr("y", 0)
            .attr("dy", "-5.1em")
            .attr("x", - vis.height / 2 + 5)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Category");

        vis.comparexAxisGroup = vis.chart2.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);
        vis.comparexAxisGroup.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Days (%)");

        vis.compareyAxisGroup = vis.chart2.append("g")
            .attr('class', 'axis y-axis');
        vis.compareyAxisGroup.append("text")
            .attr("y", 0)
            .attr("dy", "-5.1em")
            .attr("x", - vis.height / 2 + 5)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Category");
    }

    //leave this empty for now
    updateVis() { 
        let vis = this;

        // Remove old lines
        vis.chart.selectAll("rect").remove();
        vis.chart2.selectAll("rect").remove();

        // Process data
        vis.hamiltonData = []
        vis.data.forEach(d => {
            if (d.county == "Hamilton") {
                vis.hamiltonData.push({"total": d.total, "cat": d.cat, "stat": d.stat});
            }
        }); 

        vis.compareData = []
        vis.data.forEach(d => {
            if (d.county == vis.config.inputCounty) {
                vis.compareData.push({"total": d.total, "cat": d.cat, "stat": d.stat});
            }
        });

        vis.hamiltonProcessedData = []
        vis.hamiltonData.forEach(d => {
            vis.hamiltonProcessedData.push({"cat": d.cat, "stat": d.stat / 365 * 100})
        });

        vis.compareProcessedData = []
        vis.compareData.forEach(d => {
            vis.compareProcessedData.push({"cat": d.cat, "stat": d.stat / 365 * 100})
        });

        // set scale domains
        vis.hamiltonxScale.domain([0, d3.max(vis.hamiltonProcessedData, d => d.stat)]);
        vis.hamiltonyScale.domain(vis.hamiltonProcessedData.map(d => d.cat))
            .paddingInner(0.1);

        vis.comparexScale.domain([0, d3.max(vis.compareProcessedData, d => d.stat)]);
        vis.compareyScale.domain(vis.compareProcessedData.map(d => d.cat))
            .paddingInner(0.1);

        // configure ticks
        vis.hamiltonxAxis.tickSizeOuter(0);
        vis.hamiltonyAxis.tickSizeOuter(0);

        vis.comparexAxis.tickSizeOuter(0);
        vis.compareyAxis.tickSizeOuter(0);

        vis.renderVis();
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        // Add rectangles
        vis.chart.selectAll('rect')
            .data(vis.hamiltonProcessedData)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', d => vis.hamiltonxScale(d.stat))
                .attr('height', vis.hamiltonyScale.bandwidth())
                .attr('y', d => vis.hamiltonyScale(d.cat))
                .attr('x', 0);

        vis.chart2.selectAll('rect')
            .data(vis.compareProcessedData)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', d => vis.comparexScale(d.stat))
                .attr('height', vis.compareyScale.bandwidth())
                .attr('y', d => vis.compareyScale(d.cat))
                .attr('x', 0);
        
        // Update axis
        vis.hamiltonxAxisGroup.call(vis.hamiltonxAxis);

        vis.comparexAxisGroup.call(vis.comparexAxis);

        vis.hamiltonyAxisGroup.call(vis.hamiltonyAxis);

        vis.compareyAxisGroup.call(vis.compareyAxis);
    }  
}