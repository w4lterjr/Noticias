import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Weather.module.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('São Paulo');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: apiKey,
            q: city,
            lang: 'pt'
          }
        });
        setWeather(response.data);
      } catch (err) {
        setError('Não foi possível obter a previsão do tempo.');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className={styles.weatherContainer}>
      <h1>Previsão do Tempo</h1>
      <select value={city} onChange={handleCityChange} className={styles.select}>
        <option value="São Paulo">São Paulo</option>
        <option value="Rio de Janeiro">Rio de Janeiro</option>
        <option value="Recife">Recife</option>
        <option value="Miami">Miami</option>
      </select>
      {loading && <p>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {weather && (
        <div className={styles.weatherInfo}>
          <h2>{weather.location.name}</h2>
          <p>{weather.current.condition.text}</p>
          <p>Temperatura: {weather.current.temp_c}°C</p>
          <p>Umidade: {weather.current.humidity}%</p>
          <p>Vento: {weather.current.wind_kph} km/h</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
