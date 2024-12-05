import React, { useState, useEffect } from "react";
import axios from "axios";

const BrasileiraoClassificacao = () => {
  const [classificacao, setClassificacao] = useState([]);

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
      } catch (error) {
        console.error("Erro ao buscar a classificação", error);
      }
    };

    fetchClassificacao();
  }, []);

  return (
    <div>
      <h2>Classificação do Brasileirão</h2>
      <ul>
        {classificacao.map((time) => (
          <li key={time.team.id}>
            {time.position} - {time.team.name} ({time.points} pontos)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrasileiraoClassificacao;
