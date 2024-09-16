// components/Header.js
import styles from '../styles/Home.module.css';
import Weather from './Weather';

const Header = () => (
  <header className={styles.header}>
    <Weather />
    <h1>Notícias</h1>

  </header>
);

export default Header;
