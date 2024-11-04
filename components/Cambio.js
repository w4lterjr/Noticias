import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Cambio.module.css';

export default function App() {
  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currencies = ['BRL', 'EUR'];

  const fetchCotacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usdResponse, eurResponse] = await Promise.all([
        axios.get('https://api.exchangerate-api.com/v4/latest/USD'),
        axios.get('https://api.exchangerate-api.com/v4/latest/EUR')
      ]);
      
      setUsdRate(usdResponse.data.rates.BRL);
      setEurRate(eurResponse.data.rates.BRL);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Erro ao buscar as cotações');
      console.error(err);
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
    <main>
      <div className={styles.tickerContainer}>
        <div className={styles.cambioItem}>
          <p>
            Dolar: $ {usdRate ? usdRate.toFixed(2) : 'N/A'}
          </p>
        </div>
        <div className={styles.cambioItem}>
          <p>
            Euro: $ {eurRate ? eurRate.toFixed(2) : 'N/A'}
          </p>
        </div>
      </div>
    </main>
  );
}
