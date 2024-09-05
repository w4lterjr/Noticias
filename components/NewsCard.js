// components/NewsCard.js
import styles from '../styles/NewsCard.module.css';

const NewsCard = ({ title, description, url }) => (
  <div className={styles.card}>
    <h2>{title}</h2>
    <p>{description}</p>
    <a href={url} target="_blank" rel="noopener noreferrer">Leia mais</a>
  </div>
);

export default NewsCard;
