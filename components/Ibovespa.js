import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { format } from 'date-fns'; // Optional for date formatting
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

      let retries = 3;
      let success = false;

      while (retries > 0 && !success) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
          );

          const timeSeries = response.data['Time Series (Daily)'];
          const labels = Object.keys(timeSeries)
            .slice(0, 30)
            .reverse()
            .map(date => format(new Date(date), 'yyyy-MM-dd'));
          const dataValues = labels.map(date => parseFloat(timeSeries[date]['4. close']));

          setChartData({
            labels,
            datasets: [
              {
                label: 'Preço de Fechamento (IBOV)',
                data: dataValues,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                fill: true,
              },
            ],
          });

          success = true; // Data fetched successfully
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Erro ao buscar dados. Tente novamente mais tarde.');
          retries -= 1;
          if (retries === 0) setLoading(false); // Stop loading after all retries
        }
      }
    };

    fetchData();
  }, [apiKey]);

  const chartOptions = {
    elements: { line: { tension: 0.4 } },
    scales: {
      y: {
        ticks: {
          font: { size: 10 },
          callback: value => value.toLocaleString(),
        },
      },
      x: {
        ticks: {
          font: { size: 10 },
          callback: (value, index, ticks) => ticks[index].label.substring(5),
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Ibovespa</h1>
      {loading && <div className={styles.loader}>Carregando dados...</div>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && <Line data={chartData} options={chartOptions} />}
    </div>
  );
};

export default IBOVESPAChart;
