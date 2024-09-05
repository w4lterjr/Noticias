// pages/index.js
import axios from 'axios';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import styles from '../styles/Home.module.css';

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {articles.map((article) => (
          <NewsCard
            key={article.url}
            title={article.title}
            description={article.description}
            url={article.url}
          />
        ))}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
      apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY, // Substitua com sua chave de API
      country: 'us',
    },
  });
  
  const articles = res.data.articles;

  return {
    props: { articles },
  };
}

