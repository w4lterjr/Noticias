import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import styles from '../styles/Ibovespa.module.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const IBOVESPAChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const symbol = 'IBOV.SA';

  useEffect(() => {
    const fetchData = async () => {
      if (!apiKey) {
        setError('API key is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
        );

        const timeSeries = response.data['Time Series (Daily)'];
        const labels = Object.keys(timeSeries).slice(0, 30).reverse();
        const dataValues = labels.map(date => parseFloat(timeSeries[date]['4. close']));

        setChartData({
          labels,
          datasets: [
            {
              label: 'Preço de Fechamento (IBOV)',
              data: dataValues,
              borderColor: '#007bff', // Cor da linha azul
              backgroundColor: 'rgba(0, 123, 255, 0.2)', // Fundo azul claro
              borderWidth: 2,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Erro ao buscar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Ibovespa</h1>
      {loading && <p>Carregando dados...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && <Line data={chartData} options={{ elements: { line: { tension: 0.4 } }, scales: { y: { ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } } }} />}
    </div>
  );
};

export default IBOVESPAChart;
