const results = JSON.parse(localStorage.getItem("results") || "[]");

function getResults() {
  const resultsContainer = document.getElementById("results-container");

  if (results.length === 0) {
    resultsContainer.innerHTML =
      '<p class="text-gray-500">Nenhum resultado encontrado</p>';
    return;
  }

  results.reverse().forEach((result) => {
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

    const date = new Date(result.timestamp);
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    divResult.innerHTML = `
      <h2 class="text-xl text-gray-900 cursor-pointer" onclick="toggleContent('${result.id}')">
        Execução ${formattedDate}
      </h2>
      <div id="content-${result.id}" class="hidden">
        <div class="text-gray-700 space-y-2">
          <p><strong>ID:</strong> ${result.id}</p>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <pre class="bg-gray-50 p-4 rounded">${result.output}</pre>
        </div>
        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="downloadResult('${result.id}')">
          Baixar
        </button>
      </div>
    `;
    resultsContainer.appendChild(divResult);
  });
  toggleContent(results.at(0).id);
}

function toggleContent(id) {
  const content = document.getElementById(`content-${id}`);
  content.classList.toggle("hidden");
}

function downloadResult(id) {
  const result = results.find((r) => r.id === id);
  const blob = new Blob([result.output], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resultado_${id}_${result.timestamp}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

window.onload = getResults;
