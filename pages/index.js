// pages/index.js
import { useEffect, useState } from 'react';
import { fetchNews } from '../lib/news';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNews('top-headlines', { country: 'us' });
        setNews(data.articles);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Top Headlines</h1>
      <ul>
        {news.map((article) => (
          <li key={article.url}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
