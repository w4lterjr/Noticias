import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Cambio.module.css';

export default function App() {
  const [rates, setRates] = useState({ USD: null, EUR: null, BTC: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCotacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usdResponse, eurResponse, btcResponse] = await Promise.all([
        axios.get('https://api.exchangerate-api.com/v4/latest/USD'),
        axios.get('https://api.exchangerate-api.com/v4/latest/EUR'),
        axios.get('https://api.blockchain.com/v3/exchange/tickers/BTC-USD')
      ]);

      setRates({
        USD: usdResponse.data.rates.BRL,
        EUR: eurResponse.data.rates.BRL,
        BTC: btcResponse.data.last_trade_price,
      });
    } catch (err) {
      setError('Erro ao buscar as cotações. Tente novamente mais tarde.');
      console.error('Error fetching exchange rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotacoes();
  }, []);

  if (loading) {
    return <div className={styles.loader}>Carregando...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchCotacoes}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.tickerContainerWrapper}>
      <div className={styles.tickerContainer}>
        {Object.entries(rates).map(([currency, rate]) => (
          <div key={currency} className={styles.cambioItem}>
            <p>
              {currency}: {rate ? rate.toFixed(2) : 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
