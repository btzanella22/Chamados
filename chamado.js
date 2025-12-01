import { useEffect, useState } from "react";

function Chamado() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    async function buscaChamado() {
      const url = "http://10.0.0.31:3001/api/ultimos"; // URL

      // Busca pela API
      try {
        const response = await fetch(url);

        if (response.status === 200) {
          const data = await response.json();

          setChamados(data);
        }
      } catch (error) {
        console.error("Erro de requisição!", error);
      }
    }

    buscaChamado();
  }, []);

  // Interface do chamado
  return (
    <div className="containerTopics">
      {chamados.map((chamado) => (
        <div key={chamado.id} className="topics">
          <p>
            <strong>Ordem de Serviço: </strong>
            {chamado.id}
          </p>
          <p>
            <strong>Data/Hora: </strong>
            {chamado.dataHora}
          </p>
          <p>
            <strong>Cliente: </strong>
            {chamado.cliente}
          </p>
          <p>
            <strong>Localização: </strong>
            {chamado.localizacao}
          </p>
          <p>
            <strong>Descrição: </strong>
            {chamado.descricao}
          </p>
          <p>
            <strong>Observação: </strong>
            {chamado.observacao}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Chamado;
