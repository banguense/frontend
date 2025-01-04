require.config({
  paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.0/min/vs" },
});

let cEditor, makefileEditor;

require(["vs/editor/editor.main"], function () {
  cEditor = monaco.editor.create(document.getElementById("cEditor"), {
    value: "// Digite seu código em C aqui\n",
    language: "c",
    theme: "vs-light",
    minimap: { enabled: false },
  });

  makefileEditor = monaco.editor.create(
    document.getElementById("makefileEditor"),
    {
      value: "# Digite seu Makefile aqui",
      language: "shell",
      theme: "vs-light",
      minimap: { enabled: false },
    },
  );

  window.addEventListener("resize", function () {
    cEditor.layout();
    makefileEditor.layout();
  });
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");

  btn.disabled = true;
  spinner.classList.remove("hidden");

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const cCode = cEditor.getValue();
    const makefileCode = makefileEditor.getValue();

    console.log("Submitted:", { cCode, makefileCode });
  } catch (error) {
    alert("Erro ao enviar o codigo");
  } finally {
    btn.disabled = false;
    spinner.classList.add("hidden");
  }
});
