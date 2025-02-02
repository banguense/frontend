require.config({
  paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.0/min/vs" },
});

let editor;
require(["vs/editor/editor.main"], function () {
  const savedCode = localStorage.getItem("savedCode");
  const savedSettings = JSON.parse(localStorage.getItem("appSettings") || "{}");

  const initialValue = savedCode
    ? savedCode
    : "// Digite seu código em MPI aqui\n";

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: initialValue,
    language: "c",
    theme: "vs-light",
    minimap: { enabled: false },
  });

  document.getElementById("numberOfWorkers").value =
    savedSettings.numberOfWorkers || 1;
  document.getElementById("numberOfProcess").value =
    savedSettings.numberOfProcess || 1;
  document.getElementById("accessKey").value = savedSettings.accessKey || "";

  window.addEventListener("resize", function () {
    editor.layout();
  });
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");

  try {
    const numberOfWorkers = document.getElementById("numberOfWorkers").value;
    const numberOfProcess = document.getElementById("numberOfProcess").value;
    const accessKey = document.getElementById("accessKey").value;
    const compilationDirective =
      document.getElementById("compilationDirective").value;

    btn.disabled = true;
    btn.textContent = "Enviando...";
    btn.classList.remove(
      "bg-red-500",
      "hover:bg-red-600",
      "bg-green-500",
      "hover:bg-green-600",
    );
    btn.classList.add("bg-blue-500", "hover:bg-blue-600");
    if (spinner) spinner.classList.remove("hidden");

    // Validações
    const code = editor.getValue();
    localStorage.setItem("savedCode", code);
    if (!accessKey.trim()) throw new Error("Chave de acesso vazia");

    const data = {
      compilationDirective: compilationDirective,
      numberOfWorkers: parseInt(numberOfWorkers),
      numberOfProcess: parseInt(numberOfProcess),
      accessKey: accessKey.trim(),
      code: code,
    };

    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Chave de acesso inválida!");
      throw new Error("Erro ao se comunicar com o servidor");
    }

    const result = await response.json();

    const storedResults = JSON.parse(localStorage.getItem("results") || "[]");
    if (Array.isArray(storedResults) && storedResults.length > 10) {
      storedResults.shift();
    }
    storedResults.push({
      id: result.id,
      output: result.output,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("results", JSON.stringify(storedResults));

    btn.textContent = "Resultado";
    btn.classList.replace("hover:bg-blue-600", "hover:bg-green-600");
    btn.classList.replace("bg-blue-500", "bg-green-500");

    setTimeout(() => {
      window.location.href = "/pages/resultados";
    }, 500);
  } catch (error) {
    btn.textContent = "Enviar novamente";
    btn.classList.replace("bg-blue-500", "bg-red-500");
    btn.classList.replace("hover:bg-blue-600", "hover:bg-red-600");
    alert("Erro ao enviar código: " + error.message);
  } finally {
    if (spinner) spinner.classList.add("hidden");
    btn.disabled = false;
  }
});
