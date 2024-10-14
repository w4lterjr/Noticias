// pages/index.js
import axios from 'axios';
import Weather from '../components/Weather';
import News from '../components/News';
import styles from '../styles/Home.module.css';

export default function Home({ articles, error }) {
  return (
    <div className={styles.container}>
      <h1>Meu Jornal</h1>
      <div className={styles.content}>
        <div className={styles.weather}>
          <Weather />
        </div>
        <div className={styles.news}>
          {error ? (
            <p>Falha ao carregar notícias. Tente novamente mais tarde.</p>
          ) : (
            <News articles={articles} />
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let articles = [];
  let error = null;

  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        country: 'us',
      },
    });
    articles = res.data.articles || [];
  } catch (err) {
    console.error('Error fetching news articles:', err);
    error = true;
  }

  return { props: { articles, error } };
}
