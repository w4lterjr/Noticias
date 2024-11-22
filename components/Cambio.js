import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Cambio.module.css";

const App = () => {
  const [rates, setRates] = useState({
    USD: null,
    EUR: null,
    BTC: null,
    SP500: null,
    Ouro: null, // Adicionando o ouro (XAU/USD)
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY; // Substitua pela sua chave de API

  // Função para buscar cotações
  const fetchCotacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usdResponse, eurResponse, btcResponse, sp500Response, goldResponse] = await Promise.all([
        axios.get("https://api.exchangerate-api.com/v4/latest/USD"),
        axios.get("https://api.exchangerate-api.com/v4/latest/EUR"),
        axios.get("https://api.blockchain.com/v3/exchange/tickers/BTC-USD"),
        axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "TIME_SERIES_INTRADAY",
            symbol: "SPY",
            interval: "5min",
            apikey: API_KEY,
          },
        }),
        axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol: "XAUUSD", // Ouro em relação ao dólar
            interval: "1day",
            apikey: API_KEY,
          },
        }),
      ]);

      const timeSeries = sp500Response.data["Time Series (5min)"];
      const lastSP500Close = timeSeries
        ? parseFloat(timeSeries[Object.keys(timeSeries)[0]]["4. close"])
        : null;

      const latestGoldData = goldResponse.data["Time Series (Daily)"];
      const latestGoldDate = latestGoldData ? Object.keys(latestGoldData)[0] : null;
      const goldPrice = latestGoldData
        ? latestGoldData[latestGoldDate]["4. close"]
        : null;

      setRates({
        USD: parseFloat(usdResponse.data.rates.BRL) || 0,
        EUR: parseFloat(eurResponse.data.rates.BRL) || 0,
        BTC: parseFloat(btcResponse.data.last_trade_price) || 0,
        SP500: lastSP500Close !== null ? lastSP500Close : 0,
        Ouro: parseFloat(goldPrice) || 0, // Armazenando o preço do ouro
      });
    } catch (err) {
      setError("Erro ao buscar as cotações. Tente novamente mais tarde.");
      console.error("Error fetching exchange rates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotacoes();
  }, []);

  if (loading) return <div className={styles.loader}>Carregando...</div>;
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchCotacoes} className={styles.retryButton}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tickerContainerWrapper}>
      <div className={styles.tickerContainer}>
        {Object.entries(rates).map(([currency, rate]) => (
          <div key={currency} className={styles.cambioItem}>
            <p>
              {currency} : {typeof rate === 'number' && !isNaN(rate) ? rate.toFixed(2) : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
