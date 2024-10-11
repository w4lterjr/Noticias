import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('São Paulo');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Substitua pela sua chave de API
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: apiKey,
            q: city,
            lang: 'pt'
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
