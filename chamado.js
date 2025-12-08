import { useEffect, useState } from "react";

function Chamado() {
  const [chamados, setChamados] = useState([]);

  async function buscaChamado() {
    const url = window.location.href.replace('3000', '3001') + "api/ultimos"; // URL

    // Busca pela API
    try {
      const response = await fetch(url);

      // Verifica status da requisição
      if (response.status === 200) {
        const data = await response.json();

        // Verifica se chamados alterou
        if (JSON.stringify(data) !== JSON.stringify(chamados)) {
          setChamados(data);
        }
      }
    } catch (error) {
      console.error("Erro de requisição!", error);
    }
  }

  useEffect(() => {
    buscaChamado();
    const interval = setInterval(buscaChamado, 60000);
    return () => clearInterval(interval);
  });

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
            <hr></hr>
            <strong>Observação: </strong>
            {chamado.observacao}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Chamado;
