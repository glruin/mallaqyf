function crearMalla(malla) {
  const mallaContainer = document.getElementById("malla-container");

  malla.forEach(anio => {
    anio.semestres.forEach(semestre => {
      const semestreDiv = document.createElement("div");
      semestreDiv.className = "semestre";

      const tituloAnio = document.createElement("div");
      tituloAnio.className = "anio-titulo";
      tituloAnio.textContent = `Año ${anio.anio}`;

      const tituloSemestre = document.createElement("div");
      tituloSemestre.className = "semestre-titulo";
      tituloSemestre.textContent = `Semestre ${semestre.semestre}`;

      semestreDiv.appendChild(tituloAnio);
      semestreDiv.appendChild(tituloSemestre);

      const ramosDiv = document.createElement("div");
      ramosDiv.className = "ramos";

      semestre.ramos.forEach(ramo => {
        const ramoDiv = document.createElement("div");
        ramoDiv.className = "ramo bloqueado";
        ramoDiv.setAttribute("data-codigo", ramo.codigo);
        ramoDiv.setAttribute("data-prereqs", JSON.stringify(ramo.prereqs));

        ramoDiv.innerHTML = `
          ${ramo.nombre}
          <span>${ramo.codigo}</span>
          <span>${ramo.sct} SCT</span>
        `;

        ramoDiv.addEventListener("click", () => {
          if (!ramoDiv.classList.contains("bloqueado")) {
            ramoDiv.classList.toggle("aprobado");
            actualizarEstadoRamos();
          }
        });

        ramosDiv.appendChild(ramoDiv);
      });

      semestreDiv.appendChild(ramosDiv);
      mallaContainer.appendChild(semestreDiv);
    });
  });

  actualizarEstadoRamos(); // al inicio
}

function actualizarEstadoRamos() {
  const todosLosRamos = document.querySelectorAll(".ramo");

  todosLosRamos.forEach(ramo => {
    const prereqs = JSON.parse(ramo.getAttribute("data-prereqs"));
    const aprobados = Array.from(document.querySelectorAll(".ramo.aprobado")).map(r => r.getAttribute("data-codigo"));

    const todosAprobados = prereqs.every(pr => aprobados.includes(pr));

    if (todosAprobados) {
      ramo.classList.remove("bloqueado");
    } else {
      if (!ramo.classList.contains("aprobado")) {
        ramo.classList.add("bloqueado");
      }
    }
  });
}

// Ejecutar al cargar
crearMalla(malla);
