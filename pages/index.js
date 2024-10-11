// pages/index.js
import axios from 'axios';
import Weather from '../components/Weather';
import News from '../components/News';
import styles from '../styles/Home.module.css';

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <h1>Meu Jornal</h1>
      <Weather />
      <News articles={articles} />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        country: 'us',
      },
    });
    const articles = res.data.articles || [];
    return { props: { articles } };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return { props: { articles: [] } };
  }
}
