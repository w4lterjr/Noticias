import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/Futebol.module.css';

const BrasileiraoClassificacao = () => {
  const [classificacao, setClassificacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassificacao = async () => {
      try {
        const response = await axios.get(
          `https://api.football-data.org/v4/competitions/BRA/standings`,
          {
            headers: { "X-Auth-Token": "9c58ca0dcc864d889351f2daeff19619" }
          }
        );
        setClassificacao(response.data.standings[0].table);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar a classificação");
        setLoading(false);
      }
    };

    fetchClassificacao();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Classificação do Brasileirão</h2>

      {/* Se houver erro, exibe a mensagem de erro */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Se estiver carregando, exibe uma mensagem de "Carregando..." */}
      {loading && !error && <div className={styles.loading}>Carregando...</div>}

      {/* Se não houver erro e não estiver carregando, exibe a classificação */}
      {!loading && !error && (
        <ul className={styles.ul}>
          {classificacao.map((time) => (
            <li key={time.team.id} className={styles.li}>
              {time.position} - {time.team.name} ({time.points} pontos)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrasileiraoClassificacao;
