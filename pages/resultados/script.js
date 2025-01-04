const results = [
  {
    id: 1,
    title: "Resultado 1",
    content: "Este é o conteúdo do resultado 1.",
  },
  {
    id: 2,
    title: "Resultado 2",
    content: "Este é o conteúdo do resultado 2.",
  },
  {
    id: 3,
    title: "Resultado 3",
    content: "Este é o conteúdo do resultado 3.",
  },
  {
    id: 4,
    title: "Resultado 4",
    content: "Este é o conteúdo do resultado 4.",
  },
];

function getResults() {
  const resultsContainer = document.getElementById("results-container");
  results.forEach((result) => {
    const divResult = document.createElement("div");
    divResult.classList.add(
      "p-6",
      "bg-white",
      "rounded-lg",
      "shadow-sm",
      "hover:shadow-md",
      "transition-shadow",
      "space-y-4",
    );
    divResult.innerHTML = `
                    <h2 class="text-xl text-gray-900 cursor-pointer" onclick="toggleConteudo(${result.id})">${result.title}</h2>
                    <div id="content-${result.id}" class="hidden">
                        <p class="text-gray-700">${result.content}</p>
                        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="baixarResultado(${result.id})">
                            Baixar
                        </button>
                    </div>
                `;
    resultsContainer.appendChild(divResult);
  });
}

function toggleConteudo(id) {
  const content = document.getElementById(`content-${id}`);
  content.classList.toggle("hidden");
}

function downloadResult(id) {
  const result = results.find((r) => r.id === id);
  const blob = new Blob([result.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resultado_${id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

window.onload = getResults;
