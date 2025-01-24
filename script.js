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

  if (btn.textContent.trim() === "Resultado") {
    window.location.href = "/pages/resultados";
    return;
  }

  const spinner = document.getElementById("spinner");
  const numberOfWorkers = document.getElementById("numberOfWorkers").value;
  const numberOfProcess = document.getElementById("numberOfProcess").value;
  const accessKey = document.getElementById("accessKey").value;

  if (accessKey === "") throw new Error("Chave de acesso vazia");

  try {
    btn.disabled = true;
    spinner.classList.remove("hidden");

    const code = editor.getValue();
    localStorage.setItem("savedCode", code);

    const data = {
      numberOfWorkers: parseInt(numberOfWorkers),
      numberOfProcess: parseInt(numberOfProcess),
      accessKey: accessKey,
      code: code,
    };

    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro na execução");

    const result = await response.json();

    const storedResults = JSON.parse(localStorage.getItem("results") || "[]");
    storedResults.push({
      id: result.id,
      output: result.output,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("results", JSON.stringify(storedResults));

    if (localStorage.length > 10) {
      localStorage.shift();
    }

    btn.textContent = "Resultado";
    btn.classList.remove("bg-blue-500", "hover:bg-blue-600");
    btn.classList.add("bg-green-500", "hover:bg-green-600");
  } catch (error) {
    btn.textContent = "Enviar novamente";
    btn.classList.remove("bg-blue-500", "hover:bg-blue-600");
    btn.classList.add("bg-red-500", "hover:bg-red-600");
    alert("Erro ao enviar código");
  } finally {
    btn.disabled = false;
    spinner.classList.add("hidden");
  }
});
