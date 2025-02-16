document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results-container");

  if (!resultsContainer) {
    console.error("Elemento 'results-container' não encontrado no DOM.");
    return;
  }

  let results = JSON.parse(localStorage.getItem("results") || "[]");

  function renderResults() {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="text-gray-500">Nenhum resultado encontrado</p>';
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
        "space-y-4"
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
        <h2 class="text-xl text-gray-900 cursor-pointer" data-id="${result.id}">
          Execução ${formattedDate}
        </h2>
        <div id="content-${result.id}" class="hidden">
          <div class="text-gray-700 space-y-2">
            <p><strong>ID:</strong> ${result.id}</p>
            <p><strong>Data:</strong> ${formattedDate}</p>
            ${result.numberOfWorkers ? `<p><strong>Número de Contêineres:</strong> ${result.numberOfWorkers}</p>` : ""}
            ${result.numberOfProcess ? `<p><strong>Número de Processos:</strong> ${result.numberOfProcess}</p>` : ""}
            ${result.elapsedTime ? `<p><strong>Tempo de Execução:</strong> ${result.elapsedTime} segundos</p>` : ""}
            <div id="status-${result.id}">
              ${renderStatusContent(result.status, result.id, result.output)}
            </div>
          </div>
          ${result.status === "SUCCESS" ? `
            <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="downloadResult('${result.id}')">
              Baixar
            </button>` : ""}
        </div>
      `;

      resultsContainer.appendChild(divResult);
    });

    document.querySelectorAll("h2[data-id]").forEach((element) => {
      element.addEventListener("click", () => toggleContent(element.dataset.id));
    });

    if (results.length > 0) {
      const firstResultId = results[0].id;
      toggleContent(firstResultId);
    }
  }

  function renderStatusContent(status, id, output) {
    if (status === "RUNNING") {
      return `<p class="text-yellow-600"><strong>Status:</strong> Em execução...</p>`;
    } else if (status === "FAILED") {
      return `<p class="text-red-600"><strong>Status:</strong> Falha na execução</p>`;
    } else if (status === "SUCCESS" || status === "COMPLETED") {
      const masterId = id.substring(0, 5);
      return `
        <p class="text-green-600"><strong>Status:</strong> Execução concluída com sucesso</p>
        <p><strong>Caminho do arquivo:</strong> <a href="/execution_results/master-${masterId}" class="text-blue-500 hover:underline">/execution_results/${masterId}</a></p>
        <pre class="bg-gray-50 p-4 rounded max-h-64 overflow-auto whitespace-pre-wrap break-words">${output}</pre>
      `;
    }
    return "";
  }

  async function checkStatus() {
    const interval = setInterval(async () => {
      try {
        let updated = false;

        for (const result of results) {
          if (result.status === "RUNNING") {
            const response = await fetch(`/api/status/${result.id}`);
            if (!response.ok) throw new Error("Erro na requisição");

            const data = await response.json();
            if (data.status !== "RUNNING") {
              Object.assign(result, data);
              updated = true;
            }
          }
        }

        if (updated) {
          localStorage.setItem("results", JSON.stringify(results));
          location.reload();
        }
      } catch (error) {
        console.error("Erro ao verificar o status:", error);
        clearInterval(interval);
      }
    }, 1000);
  }

  function toggleContent(id) {
    const content = document.getElementById(`content-${id}`);
    if (content) {
      content.classList.toggle("hidden");
    }
  }

  function downloadResult(id) {
    const result = results.find((r) => r.id === id);
    if (result && result.output) {
      const blob = new Blob([result.output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resultado_${id}_${result.timestamp}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  renderResults();
  checkStatus();
});

