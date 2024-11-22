// components/News.js
import NewsCard from './NewsCard';
import styles from '../styles/News.module.css';

const News = ({ articles }) => {
  return (
    <div>
      <h1>News</h1>
      <main className={styles.main}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <NewsCard
              key={article.url}
              title={article.title}
              description={article.description}
              url={article.url}
            />
          ))
        ) : (
          <p>Nenhuma notícia encontrada.</p>
        )}
      </main>
    </div>
  );
};

export default News;
