const axios = require('axios');
const moment = require('moment');

// Fetch earthquake data from the last 30 days
const fetchEarthquakeData = async () => {
    try {
        const endDate = moment().format('YYYY-MM-DD');
        const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}`;
        const response = await axios.get(url);
        if (!response || !response.data || !response.data.features) {
            throw new Error('Invalid earthquake data received');
        }
        return response.data.features;
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        throw error;
    }
};

// Filter out earthquakes in Alaska
const filterOutAlaska = (data) => {
    return data.filter(eq => eq.properties.place && !eq.properties.place.includes('Alaska'));
};

// Find which country/territory had the most earthquakes
const findMostEarthquakesByCountry = (data) => {
    if (data.length === 0) {
        return { country: null, count: 0 }; // Handle empty data 
    }
    // Reduce the earthquake data to count occurrences by country
    const countryCounts = data.reduce((acc, eq) => {
        const place = eq.properties.place.split(', ');
        const country = place[place.length - 1]; // Last part of the split array is the country/territory
        acc[country] = (acc[country] || 0) + 1; // Increment count for the country/territory
        return acc;
    }, {});

     // Determine the country/territory with the highest count of earthquakes
    const mostEarthquakesCountry = Object.keys(countryCounts).reduce((a, b) => countryCounts[a] > countryCounts[b] ? a : b);
    return { country: mostEarthquakesCountry, count: countryCounts[mostEarthquakesCountry] };
};


// Find the top 3 locations with the highest magnitude earthquakes
const findTop3HighestMagnitude = (data) => {
    if (data.length === 0) {
        return []; // Return an empty array if there are no earthquakes
    }

    // Sort earthquakes by magnitude in descending order
    const sortedData = data.sort((a, b) => b.properties.mag - a.properties.mag);

    // Select the top 3 highest magnitude earthquakes
    const top3 = sortedData.slice(0, 3).map(eq => ({
        time: new Date(eq.properties.time).toISOString().replace('T', ' ').slice(0, 19),
        place: eq.properties.place,
        magnitude: eq.properties.mag
    }));

    return top3;
};

// Calculate the risk score for each country/territory
const calculateRiskScore = (data) => {
    if (data.length === 0) {
        return [];
    }

    const MAX_POSSIBLE_RISK_SCORE = 1000;  // Define a realistic maximum risk score

    // Calculate statistics for each country/territory
    const countryStats = data.reduce((acc, eq) => {
        const place = eq.properties.place.split(', ');
        const country = place[place.length - 1];
        //prevent any undefined places and give value
        if (!acc[country]) {
            acc[country] = { frequency: 0, totalMagnitude: 0 };
        }
        // Accumulate earthquake frequency and total magnitude for the country/territory
        acc[country].frequency += 1;
        acc[country].totalMagnitude += eq.properties.mag;
        return acc;
    }, {});

    const riskScores = Object.keys(countryStats).map(country => {
        const stats = countryStats[country];
        const averageMagnitude = stats.totalMagnitude / stats.frequency;
        const rawRiskScore = stats.frequency * averageMagnitude;  // Adjusted risk score calculation
        const normalizedRiskScore = (rawRiskScore / MAX_POSSIBLE_RISK_SCORE) * 100;  // Normalize by fixed maximum score number between 0-1000
        return {
            country,
            riskScore: Math.round(normalizedRiskScore * 10) / 10, // Calculate Normalized Risk Score
            frequency: stats.frequency, //return frequency 
            totalMagnitude: Math.round(stats.totalMagnitude * 10) / 10, // Calculate Total Magnitude
            averageMagnitude: Math.round(averageMagnitude * 10) / 10 // Calculate average magnitude the 10th decimal to display nicely
        };
    });

    return riskScores.sort((a, b) => b.riskScore - a.riskScore).slice(0, 3); //Send to display top 3
};

// Main function to perform analysis
const analyzeEarthquakeData = async () => {
    try {
        const data = await fetchEarthquakeData();
        const filteredData = filterOutAlaska(data);

        //Console Log the Country/Territory with most earthquakes
        const { country, count } = findMostEarthquakesByCountry(filteredData);
        console.log(`Country/Territory with the most earthquakes: ${country} (${count} earthquakes)`);
        
        //Console Top 3 with highest magnitude 
        const top3Earthquakes = findTop3HighestMagnitude(filteredData);
        console.log('\nTop 3 locations with the highest magnitude earthquakes:');
        top3Earthquakes.forEach(eq => {
            console.log(`${eq.time} - ${eq.place}: Magnitude: ${eq.magnitude}`);
        });
        // Console Risk Scores and Display Regions with most risk
        const top3RiskCountries = calculateRiskScore(filteredData);
        console.log('\nTop 3 countries/territories with the highest risk to insure property:');
        top3RiskCountries.forEach(country => {
            console.log(`${country.country}: Risk Score = ${country.riskScore}, Frequency = ${country.frequency}, Total Magnitude = ${country.totalMagnitude}, Average Magnitude = ${country.averageMagnitude}`);
        });
    } catch (error) {
        console.error('Error analyzing earthquake data:', error);
    }
};

module.exports = {
    fetchEarthquakeData,
    filterOutAlaska,
    findMostEarthquakesByCountry,
    findTop3HighestMagnitude,
    calculateRiskScore
};


// Run the analysis
analyzeEarthquakeData();




