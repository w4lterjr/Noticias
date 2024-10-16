import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Cambio.module.css';

export default function App() {
  const [cambio, setCambio] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currencies = ['BRL', 'EUR', 'GBP', 'RUB'];

  const fetchCotacoes = async () => {
    setLoading(true);
    setError(null); // Resetar o estado de erro
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setCambio(response.data.rates);
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
        <button onClick={fetchCotacoes}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className={styles.tickerContainer}>
        {cambio && currencies.map((currency) => (
          <div className={styles.cambioItem} key={currency}>
            <p>{currency}: {cambio[currency].toFixed(4)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
