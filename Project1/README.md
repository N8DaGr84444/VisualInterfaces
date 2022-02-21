# Assessing Trends in Bad Air Quality

## Purpose
The purpose of this project is to provide a visual interactive assessment of air quality, allowing for viewing/comparing air quality trends across time in various major counties across the United States.

## Preview
[View Code Repo](https://github.com/N8DaGr84444/VisualInterfaces/tree/master/Project1)

[View webpage screenshot](project1img.png)

[View video walkthrough on YouTube](https://youtu.be/TIj0GVkqQvM) or [Download video walkthrough](BadAirTrendsWalkthrough.mp4)

## Contents
- [Purpose of project](#purpose)
- [Preview](#preview)
- [Data source](#data-source)
- [Visualization components](#visualization-components)
- [Outlook of findings](#outlook-of-findings)
- [Code Overview](#code-overview)

## Data Source
The data used in this project comes from the [United States Environmental Protection Agency (EPA)](https://www.epa.gov/). Specifically, it was collected from their [Air Quality Index Report](https://www.epa.gov/outdoor-air-quality-data/air-data-basic-information), which displays a yearly summary of Air Quality Index values in each county across the United States. The primary county used was Hamilton County, Ohio. 12 other major counties from across the US were also used for comparison to Hamilton County. They are listed below:
- Hamilton County, Ohio
- Honolulu County, Hawaii
- Montgomery County, Maryland
- Nassau County, Florida
- Aroostook County, Maine
- Saint Louis County, Missouri
- Queens County, New York
- Columbia County, Oregon
- Guayama County, Puerto Rico
- Charleston County, Sourth Carolina
- Davidson County, Tennessee
- Dallas County, Texas
- Los Angeles County, California

## Visualization Components
This application shows various charts for viewing AQI trends/statistics, and comparing Hamilton County to another county chosen by the user. Hamilton County will always be the chart on the left, and the comparison county will be the chart on the right. To change the comparison county, use the drop-down menu in the upper right of the toolbar and select the desired county. All comparison county charts will immediately update to reflect the data from the newly selected county.Each chart is interactive, and by moving the mouse over the data on the charts a tooltip will appear describing that data point.

There are 3 tabs available to view. They are described below:
### AQI Overview:
This page shows 3 different charts all showing various AQI trends/statistics. 
- *AQI Changes Over Time:* Shows how the measured AQI value has changed between the years 1980 and 2021.
- *Percent of Days in the Year of Each AQI Category:* Shows the percentage of days in 2021 that the measured AQI was categorized as good, moderate, unhealthy for sensitive groups, unhealthy, very unhealthy, or hazardous, as determined by the EPA.
- *Days in Each Year Without an AQI Measurement:* Shows the number of days in each year where the AQI value was not measured.

### AQI by Pollutant:
This page shows 2 charts breaking down the measured AQI by each individual pollutant, including CO, NO2, Ozone, SO2, PM2.5, and PM10.
- *Percentage of Days Each Pollutant was Main Pollutant:* Shows the percentage of days in the year that each pollutant was the pollutant most present.
- *Percentage of Days in the Year Each Pollutant was Main Pollutant:* Shows the percentage of days in 2021 that each pollutant was the pollutant most present. 

## Findings and Results
- Generally most counties have decreased their AQI since 1980 by about 50%. Not all have, and there are random spiked years throughout, but the overall trend seems to be decreasing.
- Bigger cities have higher overall AQIs than smaller areas, which makes sense simply due to higher population and more congestion.
- The majority of days in most counties are good or moderate in 2021, rarely are they anything worse than unhealthy.
- The amount of days without measurement each year differs greatly from county to county.
- The main pollutant each year also varies greatly from county to county and across the US. SO2 and Ozone have always been two of the main pollutants in most counties, and still are today. PM2.5 is another common main pollutant today, but was not a main pollutant very often before 2000. 

## Code Overview
- The only library used was d3.
- `index.html` only contains html code, file links, and minimal styling. The rest of the styling is in `css\style.css`, and all of the js is in various files with the `js` directory. Everything is seperated to keep the code clean and organized.
- The control function for the code is in the file `tabs.js`.
- `main.js` reads in the data from the `data` directory, processes it and loads it into specifically formatted arrays for each different chart type, and then initializes each chart. It also contains the event listener for the drop-down menu to change the comparison county, and will call the update function of each chart when needed.
- Each chart type has it's own js file and it's own svg. Each svg contains 2 visuals; the Hamilton county version and the comparison county version of that chart type. The corresponding files for each chart type are as follows:
    - vis1.js - AQI Changes Over Time
    - vis2.js - Percentage of Days Each Pollutant was Main Pollutant
    - vis3.js - Days in Each Year Without an AQI Measurement
    - vis4.js - Percent of Days in the Year of Each AQI Category
    - vis5.js - Percentage of Days in the Year Each Pollutant was Main Pollutant
- Tooltips were added to each chart to make it easier to interpret the data. For the line charts, a circle was added over each data point, and the circle will reveal the tooltip. For the bar charts, anywhere on the bar will reveal the tooltip. 
- To run this program using a localhost:
    1. Open a terminal window
    2. `cd` into the location you wish to save this project.
    3. Ensure Git and Python 3 are installed. There are similar commands for other versions of python, but these instructions specifically use python 3.
    4. Clone the project by entering the command `git clone https://github.com/N8DaGr84444/VisualInterfaces.git`.
    5. `cd` into the project directory. 
    6. Run the command `python -m http.server 8000`. This will run a local server on port 8000. To use a different port, just change the `8000` to your desired port.
    7. Open a web browser. This works best in Chrome. Enter the url `localhost:8000`. This well take you to the application, which should be fully running. 
    8. To end the server, either press `ctr+c` in the terminal, or terminate the terminal window. 