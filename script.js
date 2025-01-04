require.config({
  paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.0/min/vs" },
});

let editor;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Digite seu código em C aqui\n",
    language: "c",
    theme: "vs-light",
    minimap: { enabled: false },
  });

  window.addEventListener("resize", function () {
    editor.layout();
  });
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");

  try {
    btn.disabled = true;
    spinner.classList.remove("hidden");

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    alert("Erro ao enviar código");
  } finally {
    btn.disabled = false;
    spinner.classList.add("hidden");
  }
});
