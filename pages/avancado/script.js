require.config({
	paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.0/min/vs" },
  });
  
  let cEditor, makefileEditor;
  
  require(["vs/editor/editor.main"], function () {
	// cEditor = monaco.editor.create(document.getElementById("cEditor"), {
	//   value: "// Digite seu código em C aqui\n",
	//   language: "c",
	//   theme: "vs-light",
	//   minimap: { enabled: false },
	// });
  
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
	  // cEditor.layout();
	  makefileEditor.layout();
	});
  });
  
  document.getElementById("submitBtn").addEventListener("click", async () => {
	const btn = document.getElementById("submitBtn");
	const spinner = document.getElementById("spinner");
	const numberOfWorkers = document.getElementById("numberOfWorkers").value;
	const accessKey = document.getElementById("accessKey").value;
  
	if (accessKey.trim() === "") {
	  alert("Chave de acesso vazia");
	  return;
	}
  
	btn.disabled = true;
	if (spinner) spinner.classList.remove("hidden");
  
	try {
	  // const cCode = cEditor.getValue();
	  const makefileCode = makefileEditor.getValue();
  
	  const data = {
		numberOfWorkers: parseInt(numberOfWorkers),
		accessKey: accessKey.trim(),
		// code: cCode,
		makefile: makefileCode,
	  };
  
		//  const response = await fetch("/api/makefile", {
		// method: "POST",
		// headers: {
		//   "Content-Type": "application/json",
		// },
		// body: JSON.stringify(data),
		//  });
  
	  if (!response.ok) throw new Error("Erro na execução");
  
	  const result = await response.json();

	  const storedResults = JSON.parse(localStorage.getItem("results") || "[]");
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
