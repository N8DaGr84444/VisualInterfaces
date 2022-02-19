class V3 {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 40, bottom: 35, right: 50, left: 50 },
            inputCounty: 'Honolulu',
            tooltipPadding: _config.tooltipPadding || 15
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
        vis.chartWidth = vis.width / 2 - 30;

        // // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        // Add svg title
        vis.svg.append("text")
            .attr("y", 25)
            .attr("x", vis.width / 2 + 60)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text("Days in Each Year Without an AQI Measurement");

        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        vis.chart2 = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left + vis.chartWidth + 80},${vis.config.margin.top})`);

        // scales
        vis.hamiltonxScale = d3.scaleBand()
            .range([0, vis.chartWidth]);
        
        vis.hamiltonxaScale = d3.scaleLinear().range([0, vis.chartWidth]);
        
        vis.hamiltonyScale = d3.scaleLinear()
            .range([0, vis.height]);

        vis.comparexScale = d3.scaleBand()
            .range([0, vis.chartWidth]);
        
        vis.comparexaScale = d3.scaleLinear().range([0, vis.chartWidth]);
        
        vis.compareyScale = d3.scaleLinear()
            .range([0, vis.height]);

        // init axis
        vis.hamiltonxAxis = d3.axisBottom(vis.hamiltonxaScale).tickFormat(d3.format("d")); // Remove thousand comma
        vis.hamiltonyAxis = d3.axisLeft(vis.hamiltonyScale);
        vis.comparexAxis = d3.axisBottom(vis.comparexaScale).tickFormat(d3.format("d")); // Remove thousand comma
        vis.compareyAxis = d3.axisLeft(vis.compareyScale);

        // init axis groups
        vis.hamiltonxAxisGroup = vis.chart.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);
        vis.hamiltonxAxisGroup.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Year");

        vis.hamiltonyAxisGroup = vis.chart.append("g")
            .attr('class', 'axis y-axis');
        vis.hamiltonyAxisGroup.append("text")
                .attr("y", 15)
                .attr("dy", "-5.1em")
                .attr("x", - vis.height / 2 + 5)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                .text("Days");

        vis.comparexAxisGroup = vis.chart2.append("g")
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);
        vis.comparexAxisGroup.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Year");

        vis.compareyAxisGroup = vis.chart2.append("g")
            .attr('class', 'axis y-axis');
        vis.compareyAxisGroup.append("text")
                .attr("y", 15)
                .attr("dy", "-5.1em")
                .attr("x", - vis.height / 2 + 5)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                .text("Days");
    }

    //leave this empty for now
    updateVis() { 
        let vis = this;

        // Remove old lines
        vis.chart.selectAll("rect").remove();
        vis.chart2.selectAll("rect").remove().transition();

        // Process data
        vis.hamiltonData = []
        vis.data.forEach(d => {
            if (d.county == "Hamilton") {
                vis.hamiltonData.push({"year": d.year, "stat": d.stat});
            }
        }); 

        vis.compareData = []
        vis.data.forEach(d => {
            if (d.county == vis.config.inputCounty) {
                vis.compareData.push({"year": d.year, "stat": d.stat});
            }
        });

        // Set scale domains
        vis.hamiltonxScale.domain(vis.data.map(d => d.year)).paddingInner(0.1);
        vis.hamiltonyScale.domain([d3.max(vis.hamiltonData, d => d.stat), 0]);
        vis.hamiltonxaScale.domain(d3.extent(vis.hamiltonData, (d) => d.year));
        vis.hamiltonxAxis.tickSizeOuter(0);

        vis.comparexScale.domain(vis.data.map(d => d.year)).paddingInner(0.1);
        vis.compareyScale.domain([d3.max(vis.compareData, d => d.stat), 0]);
        vis.comparexaScale.domain(d3.extent(vis.compareData, (d) => d.year));
        vis.comparexAxis.tickSizeOuter(0);
            
        vis.hamiltonyAxis.tickSizeOuter(0);
        vis.compareyAxis.tickSizeOuter(0);

        vis.renderVis();
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;
    
        // Add rectangles
        vis.hamiltonrect = vis.chart.selectAll('rect')
            .data(vis.hamiltonData)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', vis.hamiltonxScale.bandwidth())
                .attr('height', d => vis.height - vis.hamiltonyScale(d.stat))
                .attr('y', d => vis.hamiltonyScale(d.stat))
                .attr('x', d => vis.hamiltonxScale(d.year));

        vis.hamiltonrect.on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${d.year}</div>
                <div><i>${d.stat} days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        vis.comparerect = vis.chart2.selectAll('rect')
            .data(vis.compareData)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', vis.comparexScale.bandwidth())
                .attr('height', d => vis.height - vis.compareyScale(d.stat))
                .attr('y', d => vis.compareyScale(d.stat))
                .attr('x', d => vis.comparexScale(d.year));

        vis.comparerect.on('mouseover', (event,d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${d.year}</div>
                <div><i>${d.stat} days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        // Update axis
        vis.hamiltonxAxisGroup.call(vis.hamiltonxAxis);
        
        vis.comparexAxisGroup.call(vis.comparexAxis);

        vis.hamiltonyAxisGroup.call(vis.hamiltonyAxis);

        vis.compareyAxisGroup.call(vis.compareyAxis);
    }  
}