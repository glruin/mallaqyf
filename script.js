const container = document.getElementById("malla-container");
const aprobados = new Set();

function crearRamo(ramo) {
  const div = document.createElement("div");
  div.className = "ramo bloqueado";
  div.dataset.codigo = ramo.codigo;
  div.dataset.prereqs = JSON.stringify(ramo.prereqs);
  div.innerHTML = `${ramo.nombre}<br><span>${ramo.sct} SCT</span>`;
  div.addEventListener("click", () => aprobarRamo(div));
  return div;
}

function aprobarRamo(element) {
  const codigo = element.dataset.codigo;
  if (element.classList.contains("bloqueado")) return;

  if (aprobados.has(codigo)) {
    element.classList.remove("aprobado");
    aprobados.delete(codigo);
  } else {
    element.classList.add("aprobado");
    aprobados.add(codigo);
  }
  actualizarBloqueos();
}

function actualizarBloqueos() {
  const ramos = document.querySelectorAll(".ramo");
  ramos.forEach((ramo) => {
    const prereqs = JSON.parse(ramo.dataset.prereqs);
    const desbloqueado = prereqs.every((p) => aprobados.has(p) || p.startsWith("sem"));
    if (desbloqueado) {
      ramo.classList.remove("bloqueado");
    } else {
      ramo.classList.add("bloqueado");
      ramo.classList.remove("aprobado");
      aprobados.delete(ramo.dataset.codigo);
    }
  });
}

function renderizarMalla() {
  malla.forEach((anioData) => {
    const anioDiv = document.createElement("div");
    anioDiv.className = "anio";

    const anioTitulo = document.createElement("div");
    anioTitulo.className = "anio-titulo";
    anioTitulo.textContent = `Año ${anioData.anio}`;
    anioDiv.appendChild(anioTitulo);

    const semestresDiv = document.createElement("div");
    semestresDiv.className = "semestres";

    anioData.semestres.forEach((semestreData) => {
      const semestreDiv = document.createElement("div");
      semestreDiv.className = "semestre";

      const semestreTitulo = document.createElement("div");
      semestreTitulo.className = "semestre-titulo";
      semestreTitulo.textContent = `Semestre ${semestreData.semestre}`;
      semestreDiv.appendChild(semestreTitulo);

      const ramosDiv = document.createElement("div");
      ramosDiv.className = "ramos";

      semestreData.ramos.forEach((ramo) => {
        const ramoEl = crearRamo(ramo);
        ramosDiv.appendChild(ramoEl);
      });

      semestreDiv.appendChild(ramosDiv);
      semestresDiv.appendChild(semestreDiv);
    });

    anioDiv.appendChild(semestresDiv);
    container.appendChild(anioDiv);
  });

  actualizarBloqueos();
}

renderizarMalla();
