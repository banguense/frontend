// Lista de resultados, pode ser substituída por uma resposta de API ou outro dado dinâmico
const resultados = [
  {
    id: 1,
    titulo: "Resultado 1",
    conteudo: "Este é o conteúdo do resultado 1.",
  },
  {
    id: 2,
    titulo: "Resultado 2",
    conteudo: "Este é o conteúdo do resultado 2.",
  },
  {
    id: 3,
    titulo: "Resultado 3",
    conteudo: "Este é o conteúdo do resultado 3.",
  },
  {
    id: 4,
    titulo: "Resultado 4",
    conteudo: "Este é o conteúdo do resultado 4.",
  },
];

// Função para criar os resultados dinamicamente
function gerarResultados() {
  const resultadosContainer = document.getElementById("resultados-container");
  resultados.forEach((resultado) => {
    const divResultado = document.createElement("div");
    divResultado.classList.add(
      "p-6",
      "bg-white",
      "rounded-lg",
      "shadow-sm",
      "hover:shadow-md",
      "transition-shadow",
      "space-y-4",
    );
    divResultado.innerHTML = `
                    <h2 class="text-xl text-gray-900 cursor-pointer" onclick="toggleConteudo(${resultado.id})">${resultado.titulo}</h2>
                    <div id="conteudo-${resultado.id}" class="hidden">
                        <p class="text-gray-700">${resultado.conteudo}</p>
                        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="baixarResultado(${resultado.id})">
                            Baixar
                        </button>
                    </div>
                `;
    resultadosContainer.appendChild(divResultado);
  });
}

// Função para alternar a visibilidade do conteúdo
function toggleConteudo(id) {
  const conteudo = document.getElementById(`conteudo-${id}`);
  conteudo.classList.toggle("hidden");
}

// Função para baixar o resultado como arquivo .txt
function baixarResultado(id) {
  const resultado = resultados.find((r) => r.id === id);
  const blob = new Blob([resultado.conteudo], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resultado_${id}.txt`;
  a.click();
  URL.revokeObjectURL(url); // Limpar o objeto URL após o download
}

// Gerar os resultados assim que a página for carregada
window.onload = gerarResultados;
