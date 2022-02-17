console.log("Hello world");

d3.csv('data/annual_aqi_hamilton_county.csv')
.then(data => {
    console.log('Data loading complete. Work with dataset.');

    let v1data = []
    let v2data = []
    let v3data = []
    let v4data = []
    let v5data = []
    data.forEach(d => {
        v1data.push({"year": +d.Year, "cat": "median", "stat": +d['Median AQI']})
        v1data.push({"year": +d.Year, "cat": "max", "stat": +d['Max AQI']})
        v1data.push({"year": +d.Year, "cat": "90p", "stat": +d['90th Percentile AQI']})
        v2data.push({"cat": "co", "year": +d.Year, "stat": +d['Days CO']})
        v2data.push({"cat": "no2", "year": +d.Year, "stat": +d['Days NO2']})
        v2data.push({"cat": "ozone", "year": +d.Year, "stat": +d['Days Ozone']})
        v2data.push({"cat": "so2", "year": +d.Year, "stat": +d['Days SO2']})
        v2data.push({"cat": "pm25", "year": +d.Year, "stat": +d['Days PM2.5']})
        v2data.push({"cat": "pm10", "year": +d.Year, "stat": +d['Days PM10']})
        v3data.push({"year": +d.Year, "stat": (365 - +d['Days with AQI'])})
        if (d.Year == 2021) {
            v4data.push({"total": +d['Days with AQI'], "cat": "good", "stat": +d['Good Days']})
            v4data.push({"total": +d['Days with AQI'], "cat": "moderate", "stat": +d['Moderate Days']})
            v4data.push({"total": +d['Days with AQI'], "cat": "unhealthySensitive", "stat": +d['Unhealthy for Sensitive Groups Days']})
            v4data.push({"total": +d['Days with AQI'], "cat": "unhealthy", "stat": +d['Unhealthy Days']})
            v4data.push({"total": +d['Days with AQI'], "cat": "veryUnhealthy", "stat": +d['Very Unhealthy Days']})
            v4data.push({"total": +d['Days with AQI'], "cat": "hazardous", "stat": +d['Hazardous Days']})
            v5data.push({"total": +d['Days with AQI'], "cat": "co", "stat": +d['Days CO']})
            v5data.push({"total": +d['Days with AQI'], "cat": "no2", "stat": +d['Days NO2']})
            v5data.push({"total": +d['Days with AQI'], "cat": "ozone", "stat": +d['Days Ozone']})
            v5data.push({"total": +d['Days with AQI'], "cat": "so2", "stat": +d['Days SO2']})
            v5data.push({"total": +d['Days with AQI'], "cat": "pm25", "stat": +d['Days PM2.5']})
            v5data.push({"total": +d['Days with AQI'], "cat": "pm10", "stat": +d['Days PM10']})
        }
    });
    v3data.forEach(d => {
        if (d.stat < 0) {
            d.stat = 0;
        }
    })
    console.log('v1 data: ', v1data)
    console.log('v2 data: ', v2data)
    console.log('v3 data: ', v3data)
    console.log('v4 data: ', v4data)
    console.log('v5 data: ', v5data)
    // Create an instance (for example in main.js)

    //TO DO:  Make a line chart object.  Make it 200 pixels tall by 1000 pixels wide. 
    //Be sure to send it the costsPerYear data 
    // The svg for this element has already been created in index.html, above the timeline circles- check it out
    
    let vis1 = new Line({
        'parentElement': '#v1',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v1data);

    let vis2 = new StackedAreaChartFinal({
        'parentElement': '#v2',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v2data);
    vis2.updateVis();

    let vis3 = new V3Bar({
        'parentElement': '#v3',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v3data);
    // vis3.updateVis();

    let vis4 = new V4({
        'parentElement': '#v4',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v4data);

    let vis5 = new V5({
        'parentElement': '#v5',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v5data);

})
.catch(error => {
    console.error('Error loading the data');
});

// function computeDays(disasterDate){
//     let tokens = disasterDate.split("-");

//     let year = +tokens[0];
//     let month = +tokens[1];
//     let day = +tokens[2];

//     return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

// }