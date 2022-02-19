console.log("Hello world");

let vis1, vis2, vis3, vis4, vis5

d3.csv('data/annual_aqi_by_county.csv')
.then(data => {
    console.log('Data loading complete. Work with dataset.');

    let v1data = []
    let v2data = []
    let v3data = []
    let v4data = []
    let v5data = []
    data.forEach(d => {
        v1data.push({"year": +d.Year, "cat": "median", "stat": +d['Median AQI'], "state": d['State'], "county": d['County']})
        v1data.push({"year": +d.Year, "cat": "max", "stat": +d['Max AQI'], "state": d['State'], "county": d['County']})
        v1data.push({"year": +d.Year, "cat": "90p", "stat": +d['90th Percentile AQI'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "co", "year": +d.Year, "stat": +d['Days CO'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "no2", "year": +d.Year, "stat": +d['Days NO2'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "ozone", "year": +d.Year, "stat": +d['Days Ozone'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "so2", "year": +d.Year, "stat": +d['Days SO2'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "pm25", "year": +d.Year, "stat": +d['Days PM2.5'], "state": d['State'], "county": d['County']})
        v2data.push({"cat": "pm10", "year": +d.Year, "stat": +d['Days PM10'], "state": d['State'], "county": d['County']})
        v3data.push({"year": +d.Year, "stat": (365 - +d['Days with AQI']), "state": d['State'], "county": d['County']})
        if (d.Year == 2021) {
            v4data.push({"total": +d['Days with AQI'], "cat": "Good", "stat": +d['Good Days'], "state": d['State'], "county": d['County']})
            v4data.push({"total": +d['Days with AQI'], "cat": "Moderate", "stat": +d['Moderate Days'], "state": d['State'], "county": d['County']})
            v4data.push({"total": +d['Days with AQI'], "cat": "Unhealthy-Sensitive", "stat": +d['Unhealthy for Sensitive Groups Days'], "state": d['State'], "county": d['County']})
            v4data.push({"total": +d['Days with AQI'], "cat": "Unhealthy", "stat": +d['Unhealthy Days'], "state": d['State'], "county": d['County']})
            v4data.push({"total": +d['Days with AQI'], "cat": "Very Unhealthy", "stat": +d['Very Unhealthy Days'], "state": d['State'], "county": d['County']})
            v4data.push({"total": +d['Days with AQI'], "cat": "Hazardous", "stat": +d['Hazardous Days'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "co", "stat": +d['Days CO'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "no2", "stat": +d['Days NO2'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "ozone", "stat": +d['Days Ozone'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "so2", "stat": +d['Days SO2'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "pm25", "stat": +d['Days PM2.5'], "state": d['State'], "county": d['County']})
            v5data.push({"total": +d['Days with AQI'], "cat": "pm10", "stat": +d['Days PM10'], "state": d['State'], "county": d['County']})
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
    
    vis1 = new V1({
        'parentElement': '#v1',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v1data);
    vis1.updateVis();

    vis2 = new V2({
        'parentElement': '#v2',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v2data);
    vis2.updateVis();

    vis3 = new V3({
        'parentElement': '#v3',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v3data);
    vis3.updateVis();

    vis4 = new V4({
        'parentElement': '#v4',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v4data);
    vis4.updateVis();

    vis5 = new V5({
        'parentElement': '#v5',
        'containerHeight': 200,
        'containerWidth': 1000
    }, v5data);
    vis5.updateVis();

})
.catch(error => {
    console.error('Error loading the data');
});

d3.select('#county-selection').on('change', function() {
  // Get selected county and update charts
  vis1.config.inputCounty = d3.select(this).property('value');
  vis1.updateVis();
  vis2.config.inputCounty = d3.select(this).property('value');
  vis2.updateVis();  
  vis3.config.inputCounty = d3.select(this).property('value');
  vis3.updateVis();
  vis4.config.inputCounty = d3.select(this).property('value');
  vis4.updateVis();
  vis5.config.inputCounty = d3.select(this).property('value');
  vis5.updateVis();
});