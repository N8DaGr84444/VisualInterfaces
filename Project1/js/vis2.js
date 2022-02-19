class V2 {

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
            .text("Percentage of Days Each Pollutant was Main Pollutant");

        // // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        vis.chart2 = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left + vis.chartWidth + 80},${vis.config.margin.top})`);


        // // Initialize axes
        // Add X axis
        vis.hamiltonxScale = d3.scaleLinear().range([ 0, vis.chartWidth ]);
        vis.hamiltonxAxis = d3.axisBottom(vis.hamiltonxScale).tickFormat(d3.format("d")); // Remove thousand comma
        
        vis.hamiltonxAxisG = vis.chart.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${vis.height})`)
        vis.hamiltonxAxisG.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Year");

        vis.comparexScale = d3.scaleLinear().range([ 0, vis.chartWidth ]);
        vis.comparexAxis = d3.axisBottom(vis.comparexScale).tickFormat(d3.format("d")); // Remove thousand comma
        
        vis.comparexAxisG = vis.chart2.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${vis.height})`)
        vis.comparexAxisG.append("text")
            .attr("y", 30)
            .attr("x", vis.chartWidth / 2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text("Year");

        // Add Y axis
        vis.hamiltonyScale = d3.scaleLinear().range([ vis.height, 0 ]);
        vis.hamiltonyAxis = d3.axisLeft(vis.hamiltonyScale).tickSizeOuter(0);

        vis.hamiltonyAxisG = vis.chart.append("g")
            .attr("class", "axis y-axis");
        vis.hamiltonyAxisG.append("text")
            .attr("y", 15)
            .attr("dy", "-5.1em")
            .attr("x", - vis.height / 2 + 5)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Days (%)");

        vis.compareyScale = d3.scaleLinear().range([ vis.height, 0 ]);
        vis.compareyAxis = d3.axisLeft(vis.compareyScale).tickSizeOuter(0);

        vis.compareyAxisG = vis.chart2.append("g")
            .attr("class", "axis y-axis");
        vis.compareyAxisG.append("text")
            .attr("y", 15)
            .attr("dy", "-5.1em")
            .attr("x", - vis.height / 2 + 5)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Days (%)");
    }

    updateVis() { 
        let vis = this;

        // Remove old lines
        vis.chart.selectAll("path").remove();
        vis.chart2.selectAll("path").remove().transition();

        // Process data
        vis.hamiltonData = []
        vis.data.forEach(d => {
            if (d.county == "Hamilton") {
                vis.hamiltonData.push({"year": d.year, "cat": d.cat, "stat": d.stat / 365 * 100});
            }
        }); 

        vis.compareData = []
        vis.data.forEach(d => {
            if (d.county == vis.config.inputCounty) {
                vis.compareData.push({"year": d.year, "cat": d.cat, "stat": d.stat / 365 * 100});
            }
        });

        // group the data: I want to draw one line per group
        vis.hamiltonSumstat = d3.group(vis.hamiltonData, d => d.cat);  // nest function allows to group the calculation per level of a factor
        vis.compareSumstat = d3.group(vis.compareData, d => d.cat);  // nest function allows to group the calculation per level of a factor

        // Set scale domains
        vis.hamiltonxScale.domain(d3.extent(vis.data, (d) => d.year))
        vis.hamiltonyScale.domain([0, d3.max(vis.hamiltonData, (d) => d.stat)])
        vis.comparexScale.domain(d3.extent(vis.data, (d) => d.year))
        vis.compareyScale.domain([0, d3.max(vis.compareData, (d) => d.stat)])

        vis.hamiltonxAxis.tickSizeOuter(0);
        vis.comparexAxis.tickSizeOuter(0);

        // color palette
        vis.colorScale = d3.scaleOrdinal()
                .range(['#e41a1c','#377eb8','#4daf4a'])

        vis.renderVis()
    }
  
    //leave this empty for now...
    renderVis() { 
        let vis = this;

        vis.chart.selectAll(".line")
            .data(vis.hamiltonSumstat)
            .join("path")
                .attr("stroke", (d) => vis.colorScale(d[0]))
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr("d", function(d){
                    return d3.line()
                        .x((d) => vis.hamiltonxScale(d.year))
                        .y((d) => vis.hamiltonyScale(d.stat))
                        (d[1]) //this is the array of values 
                })

        vis.hamiltoncircle = vis.chart.selectAll("circle")
            .data(vis.hamiltonData)
            .join("circle")
                .attr("class", "selectCircle")
                .attr("cx", (d) => vis.hamiltonxScale(d.year))
                .attr("cy", (d) => vis.hamiltonyScale(d.stat))
                .attr("r", 2)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "white");
        
        function processTitle(title) {
            if (title == "pm25") {
                return "pm2.5";
            }
            else {return title;}
        }
        function fixPercent(percent) {
            return parseInt(percent);
        }

        vis.hamiltoncircle.on('mouseover', (event,d) => {
            let title = processTitle(d.cat)
            let percent = fixPercent(d.stat)
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${title}</div>
                <div><i>${d.year}</i></div>
                <div><i>${percent} % of days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });

        vis.chart2.selectAll(".line")
            .data(vis.compareSumstat)
            .join("path")
                .transition()
                .attr("stroke", (d) => vis.colorScale(d[0]))
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr("d", function(d){
                    return d3.line()
                        .x((d) => vis.comparexScale(d.year))
                        .y((d) => vis.compareyScale(d.stat))
                        (d[1]) //this is the array of values 
                })

        vis.comparecircle = vis.chart2.selectAll("circle")
            .data(vis.compareData)
            .join("circle")
                .attr("class", "selectCircle")
                .attr("cx", (d) => vis.comparexScale(d.year))
                .attr("cy", (d) => vis.compareyScale(d.stat))
                .attr("r", 2)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "white");

        vis.comparecircle.on('mouseover', (event,d) => {
            let title = processTitle(d.cat)
            let percent = fixPercent(d.stat)
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                <div class="tooltip-title">${title}</div>
                <div><i>${d.year}</i></div>
                <div><i>${percent} % of days</i></div>
                `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });
        
        // Update axis
        vis.hamiltonxAxisG.call(vis.hamiltonxAxis);

        vis.comparexAxisG.call(vis.comparexAxis);

        vis.hamiltonyAxisG.call(vis.hamiltonyAxis);

        vis.compareyAxisG.call(vis.compareyAxis);
    }  
}