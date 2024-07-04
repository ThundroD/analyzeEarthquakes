const {
    fetchEarthquakeData,
    filterOutAlaska,
    findMostEarthquakesByCountry,
    findTop3HighestMagnitude,
    calculateRiskScore
  } = require('./analyzeEarthquakes'); 
  
  // Mock axios to prevent real API calls
  jest.mock('axios');
  const axios = require('axios');
  
  //mock data
  const mockData = {
    "type": "FeatureCollection",
    "metadata": {
      "generated": 1720008776000,
      "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-06-03&endtime=2024-07-03",
      "title": "USGS Earthquakes",
      "status": 200,
      "api": "1.14.1",
      "count": 3
    },
    "features": [
      {
        "type": "Feature",
        "properties": {
          "mag": 2.5,
          "place": "36 km N of Anchorage, Alaska",
          "time": 1719963950235,
          "updated": 1719973514040,
          "tz": null,
          "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us6000n9xn",
          "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us6000n9xn&format=geojson",
          "felt": null,
          "cdi": null,
          "mmi": null,
          "alert": null,
          "status": "reviewed",
          "tsunami": 0,
          "sig": 96,
          "net": "us",
          "code": "6000n9xn",
          "ids": ",us6000n9xn,",
          "sources": ",us,",
          "types": ",origin,phase-data,",
          "nst": 24,
          "dmin": 0.591,
          "rms": 1.03,
          "gap": 56,
          "magType": "ml",
          "type": "earthquake",
          "title": "M 2.5 - 36 km N of Anchorage, Alaska"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-115.5573, 44.4047, 6.721]
        },
        "id": "us6000n9xn"
      },
      {
        "type": "Feature",
        "properties": {
          "mag": 0.29,
          "place": "14 km WSW of Searles Valley, California",
          "time": 1719963826260,
          "updated": 1719964600693,
          "tz": null,
          "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci40646479",
          "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci40646479&format=geojson",
          "felt": null,
          "cdi": null,
          "mmi": null,
          "alert": null,
          "status": "reviewed",
          "tsunami": 0,
          "sig": 1,
          "net": "ci",
          "code": "40646479",
          "ids": ",ci40646479,",
          "sources": ",ci,",
          "types": ",nearby-cities,origin,phase-data,scitech-link,",
          "nst": 11,
          "dmin": 0.1182,
          "rms": 0.14,
          "gap": 151,
          "magType": "ml",
          "type": "earthquake",
          "title": "M 0.3 - 14 km WSW of Searles Valley, California"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-117.5501667, 35.7233333, 2.02]
        },
        "id": "ci40646479"
      },
      {
        "type": "Feature",
        "properties": {
          "mag": 1.7,
          "place": "54 km NW of Toyah, Texas",
          "time": 1719963818455,
          "updated": 1719966454404,
          "tz": null,
          "url": "https://earthquake.usgs.gov/earthquakes/eventpage/tx2024myea",
          "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=tx2024myea&format=geojson",
          "felt": null,
          "cdi": null,
          "mmi": null,
          "alert": null,
          "status": "automatic",
          "tsunami": 0,
          "sig": 44,
          "net": "tx",
          "code": "2024myea",
          "ids": ",tx2024myea,",
          "sources": ",tx,",
          "types": ",origin,phase-data,",
          "nst": 17,
          "dmin": 0.1,
          "rms": 0.3,
          "gap": 112,
          "magType": "ml",
          "type": "earthquake",
          "title": "M 1.7 - 54 km NW of Toyah, Texas"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-104.194, 31.663, 3.3862]
        },
        "id": "tx2024myea"
      },
      {
        "type": "Feature",
        "properties": {
          "mag": 2.7,
          "place": "36 km N of San Diego, California",
          "time": 1719963950235,
          "updated": 1719973514040,
          "tz": null,
          "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us6000n9xn",
          "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us6000n9xn&format=geojson",
          "felt": null,
          "cdi": null,
          "mmi": null,
          "alert": null,
          "status": "reviewed",
          "tsunami": 0,
          "sig": 96,
          "net": "us",
          "code": "6000n9xn",
          "ids": ",us6000n9xn,",
          "sources": ",us,",
          "types": ",origin,phase-data,",
          "nst": 24,
          "dmin": 0.591,
          "rms": 1.03,
          "gap": 56,
          "magType": "ml",
          "type": "earthquake",
          "title": "M 2.5 - 36 km N of San Diego, California"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-115.5573, 44.4047, 6.721]
        },
        "id": "us6000n9xn"
      }
    ]
  };
  
  axios.get.mockResolvedValue({ data: mockData });
  
  describe('Earthquake Data Analysis', () => {
    test('fetchEarthquakeData fetches data correctly', async () => {
        const data = await fetchEarthquakeData();
        expect(data).toEqual(mockData.features);
    });

    test('filterOutAlaska filters out earthquakes in Alaska', () => {
        const data = filterOutAlaska(mockData.features);
        expect(data.every(eq => !eq.properties.place.includes('Alaska'))).toBe(true);
    });

    test('findMostEarthquakesByCountry identifies the state/region with the most earthquakes', () => {
        const { country, count } = findMostEarthquakesByCountry(mockData.features);
        expect(country).toBe('California'); // California has the most
        expect(count).toBe(2); // 2 in California
    });

    test('findTop3HighestMagnitude identifies the top 3 highest magnitude earthquakes', () => {
        const top3 = findTop3HighestMagnitude(mockData.features);
        expect(top3.length).toBe(3);
        expect(top3[0].magnitude).toBe(2.7); // Highest magnitude
        expect(top3[0].place).toBe("36 km N of San Diego, California");
        expect(top3[1].magnitude).toBe(2.5); // Second highest magnitude
        expect(top3[1].place).toBe("36 km N of Anchorage, Alaska");
        expect(top3[2].magnitude).toBe(1.7); // Third highest magnitude
        expect(top3[2].place).toBe("54 km NW of Toyah, Texas");
    });

    test('calculateRiskScore calculates risk score correctly', () => {
        const riskScores = calculateRiskScore(mockData.features);

        // Expecting 3 because we have three different regions in the mock data
        expect(riskScores.length).toBe(3);

        // The regions in the mock data are California, Alaska, and Texas
        const expectedRegions = ['California', 'Alaska', 'Texas'];
        riskScores.forEach(score => {
            expect(expectedRegions).toContain(score.country);
        });

        // Check if the risk scores are normalized correctly
        riskScores.forEach(score => {
            expect(score.riskScore).toBeLessThanOrEqual(100);
        });

        // Check if frequency and totalMagnitude are calculated correctly
        const totalMagnitude = mockData.features.reduce((acc, eq) => acc + eq.properties.mag, 0);
        const calculatedMagnitude = riskScores.reduce((acc, score) => acc + score.totalMagnitude, 0);
        expect(totalMagnitude).toBeCloseTo(calculatedMagnitude, 1);
    });
    
    
  });
  
  