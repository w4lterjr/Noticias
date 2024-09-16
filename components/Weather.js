// src/Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('São Paulo');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'SUA_CHAVE_DE_API'; // Substitua pela sua chave de API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric', // ou 'imperial' para Fahrenheit
            lang: 'pt' // Para obter as descrições em português
          }
        });
        setWeather(response.data);
        setError(null);
      } catch (err) {
        setError('Não foi possível obter a previsão do tempo.');
        setWeather(null);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div>
      <h1>Previsão do Tempo</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Digite o nome da cidade"
      />
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Umidade: {weather.main.humidity}%</p>
          <p>Vento: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
