import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const TOMTOM_API_KEY = 'sp63lJiSDV85PuII26DyfoszBGQ7oopD';
const OPENWEATHER_API_KEY = '59ce3a80fe2c9388238366c9f3c48530';

const App = () => {
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const weatherPromises = cities.map(city =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`)
        );

        const trafficPromises = cities.map(city =>
          axios.get(`https://api.tomtom.com/traffic/services/4/incidentDetails?key=${TOMTOM_API_KEY}&radius=50000&lat=37.7749&lon=-122.4194`)
        );

        const weatherResponses = await Promise.all(weatherPromises);
        const trafficResponses = await Promise.all(trafficPromises);

        const cityData = cities.map((city, index) => ({
          city,
          weather: weatherResponses[index].data.weather[0].main,
          temperature: (weatherResponses[index].data.main.temp - 273.15).toFixed(2),
          traffic: trafficResponses[index].data.totalCount,
        }));

        setCityData(cityData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCityData();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-8">Weather & Traffic</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cityData.map((city, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{city.city}</h2>
            <p className="mt-2">Temperature: {city.temperature}°C</p>
            <p>Weather: {city.weather}</p>
            <p className="mt-2">Traffic Incidents: {city.traffic}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

