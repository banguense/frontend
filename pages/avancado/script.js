require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.0/min/vs" },
});

let makefileEditor;

require(["vs/editor/editor.main"], function () {
  const savedMakefile = localStorage.getItem("makefileContent") || "# Digite seu Makefile aqui";

  makefileEditor = monaco.editor.create(document.getElementById("makefileEditor"), {
    value: savedMakefile,
    language: "shell",
    theme: "vs-light",
    minimap: { enabled: false },
  });

  makefileEditor.onDidChangeModelContent(() => {
    localStorage.setItem("makefileContent", makefileEditor.getValue());
  });

  window.addEventListener("resize", function () {
    makefileEditor.layout();
  });
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");
  const numberOfWorkers = document.getElementById("numberOfWorkers").value;
  const accessKey = document.getElementById("accessKey").value;
  const fileUpload = document.getElementById("fileUpload");

  if (accessKey.trim() === "") {
    alert("Chave de acesso vazia");
    return;
  }

  if (!fileUpload.files.length) {
    alert("Nenhum arquivo selecionado para upload.");
    return;
  }

  btn.disabled = true;
  if (spinner) spinner.classList.remove("hidden");

  try {
    const formData = new FormData();
    for (let file of fileUpload.files) {
      formData.append("files", file);
    }

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) throw new Error("Erro no upload de arquivos.");

    const uploadResult = await uploadResponse.json();
    const uuid = uploadResult.id;
    console.log("uuid: " + uuid);

    const makefileCode = makefileEditor.getValue();
    const requestData = {
      uuid,
      makefile: makefileCode,
      accessKey: accessKey.trim(),
      numberOfWorkers: parseInt(numberOfWorkers),
    };

    const makefileResponse = await fetch("/api/makefile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!makefileResponse.ok) throw new Error("Erro na execução do Makefile.");

    const result = await makefileResponse.json();

    const storedResults = JSON.parse(localStorage.getItem("results") || "[]");
    storedResults.push({
      id: result.id,
      output: result.output,
      status: result.status,
      elapsedTime: result.elapsedTime,
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

function updateFileCount() {
  const fileUpload = document.getElementById("fileUpload");
  const fileCount = document.getElementById("fileCount");
  const count = fileUpload.files.length;
  fileCount.textContent = count > 0 ? `${count} arquivo(s) selecionado(s)` : "";
}
