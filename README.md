# Earthquake Data Analysis

## Overview
This project fetches earthquake data from the USGS API for the last 30 days, filters out earthquakes in Alaska, and analyzes the data to identify:
- The country/territory with the most earthquakes.
- The top 3 locations with the highest magnitude earthquakes with timestaps in decending order.
- The top 3 countries/territories with the highest risk to insurers based on earthquake frequency and magnitude.

## How to Clone and Run the Code

### Prerequisites
- Node.js installed on your machine. https://nodejs.org/en/download/package-manager
- npm (Node Package Manager) installed.

### Steps to Clone and Run

1. Clone the repository:
   git clone https://github.com/ThundroD/analyzeEarthquakes
   cd analyzeEarthquakes
2. Install Dependencies: npm install
3. Run Code: node analyzeEarthquakes.js
4. Run Tests: npm test

## Considerations and What to Do Differently
The biggest challenge was how to display the top 3 countries/territories with the highest risk to insurers. I did this first by looking at the following:

Frequency of Earthquakes: The more frequent the earthquakes in a region, the higher the potential risk.
Average Magnitude of Earthquakes: Higher magnitude earthquakes pose greater risk.

This is obviously a very basic solution. I normalized this data into a risk score to make it easier for insurers to read, however if this is all done
by a machine I do regret rounding numbers and doing it this way as things could be calculated quickly and accurately with no need for it to look good on a display. However the countries and regions would still remain the same having the highest risk first. 

To consider building this out the first step would be to pull in more historical data to compare the 30 day data that we have from USGS, also things like
population density, soil density, and economic impact could provide a more comprehensive risk assessment. Other considerations would be to use dynamic 
weighting which factors for frequency and magnitude based on real-world impact data. Lastly and something that I looked up when researching how insurers 
get data for insuring for earthquakes was geospatial analysis which consider proximity to fault lines and urban centers. All of these things could enhance
the accuracy of predicting the most high risk places and even do so by neighborhood or area code.

