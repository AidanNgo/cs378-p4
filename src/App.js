import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import TimeTemp from './components/TimeTemp';
import SearchBar from './components/SearchBar';

async function fetchWeather(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto&forecast_days=1&temperature_unit=fahrenheit`;
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Error occurred. Response status: ${response.status}`);
    }

    const weatherJson = await response.json();
    console.log(weatherJson);
    return weatherJson;

  } catch (error) {
    console.error(error.message);
  }
}

async function fetchCity(cityName) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  try {
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error(`Error occurred. Response status: ${response.status}`);
    }

    const geoJson = await response.json();
    console.log(geoJson);

    if (geoJson.results && geoJson.results.length > 0) {
      const { latitude, longitude } = geoJson.results[0];
      return { latitude, longitude };  // Only return lat/lon
    } else {
      throw new Error("City not found.");
    }

  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

function App() {
  const [city, setCity] = useState("Austin");
  const [coords, setCoords] = useState({ latitude: 30.26715, longitude: -97.74306 });
  const [error, setError] = useState("");  // State to hold the error message
  const [cities, setCities] = useState(["Austin", "New York", "Los Angeles", "Chicago", "Miami"]);

  const handleSearch = async (cityName) => {
    setError("");
    try {
      const { latitude, longitude } = await fetchCity(cityName);
      setCoords({ latitude, longitude });
      setCity(cityName);
      setCities(prevCities => [...prevCities, cityName]);  // Add city to list
    } catch (error) {
      setError("City not found. Please try again.");
    }
  };

  const handleCityChange = async (cityName) => {
    setError("");  // Reset error message before starting the search
    setCity(cityName);
    try {
      const { latitude, longitude } = await fetchCity(cityName);
      setCoords({ latitude, longitude });
    } catch (error) {
      setError("City not found. Please try again.");
    }
  };

  const clearCities = () => {
    setCities([]);  // Clear the list of cities
  };

  return (
    <div>
      <div>
        <div id="buttons-general">
          {cities.map((cityName, index) => (
            <button
              className={city === cityName ? "active" : "button"}
              key={index}
              onClick={() => handleCityChange(cityName)}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <SearchBar handleSearch={handleSearch} clearCities={clearCities} />

      {coords && (
        <TimeTemp
          fetchWeather={fetchWeather}
          latitude={coords.latitude}
          longitude={coords.longitude}
          city={city}
        />
      )}
    </div>
  );
}

export default App;
