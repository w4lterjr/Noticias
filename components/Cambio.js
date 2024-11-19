import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Cambio.module.css";

export default function App() {
  const [rates, setRates] = useState({ USD: null, EUR: null, BTC: null, SP500: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.REACT_APP_API_KEY; // Segurança com API Key via .env

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all([
        axios.get("https://api.exchangerate-api.com/v4/latest/USD"),
        axios.get("https://api.exchangerate-api.com/v4/latest/EUR"),
        axios.get("https://api.blockchain.com/v3/exchange/tickers/BTC-USD"),
        axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "TIME_SERIES_INTRADAY",
            symbol: "SPY",
            interval: "5min",
            apikey: apiKey,
          },
        }),
      ]);

      const [usdResponse, eurResponse, btcResponse, sp500Response] = responses;

      // Extrair dados do SP500
      const timeSeries = sp500Response.data["Time Series (5min)"];
      const latestSP500Close = timeSeries ? parseFloat(timeSeries[Object.keys(timeSeries)[0]]["4. close"]) : null;

      // Atualizar estado com as cotações
      setRates({
        USD: usdResponse.data.rates.BRL,
        EUR: eurResponse.data.rates.BRL,
        BTC: btcResponse.data.last_trade_price || btcResponse.data.price, // Fallback para o preço se necessário
        SP500: latestSP500Close,
      });
    } catch (err) {
      setError("Erro ao buscar as cotações. Tente novamente mais tarde.");
      console.error("Erro ao buscar cotações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (loading) return <div className={styles.loader}>Carregando...</div>;

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchRates} className={styles.retryButton}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tickerContainerWrapper}>
      <div className={styles.tickerContainer}>
        <div className={styles.cambioItem}>
          <p>
            {rates.USD !== null ? ` USD: $${rates.USD.toFixed(2)}` : " USD: N/A"}  
            {rates.EUR !== null ? ` EUR: $${rates.EUR.toFixed(2)}` : " EUR: N/A"} 
            {rates.BTC !== null ? ` BTC: $${rates.BTC.toFixed(2)}` : " BTC: N/A"} | 
            {rates.SP500 !== null ? `SP500: $${rates.SP500.toFixed(2)}` : " SP500: N/A"} 
          </p>
        </div>
      </div>
    </div>
  );
}
