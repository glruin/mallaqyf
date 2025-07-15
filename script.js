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

      tituloSemestre.addEventListener("click", () => {
        const ramos = semestreDiv.querySelectorAll(".ramo:not(.bloqueado)");
        const todosAprobados = Array.from(ramos).every(r => r.classList.contains("aprobado"));
        ramos.forEach(ramo => {
          if (todosAprobados) {
            ramo.classList.remove("aprobado");
          } else {
            ramo.classList.add("aprobado");
          }
          guardarEstadoRamo(ramo);
        });
        actualizarEstadoRamos();
      });

      semestre.ramos.forEach(ramo => {
        const ramoDiv = document.createElement("div");
        ramoDiv.className = "ramo bloqueado";
        ramoDiv.setAttribute("data-codigo", ramo.codigo);
        ramoDiv.setAttribute("data-prereqs", JSON.stringify(ramo.prereqs));

        ramoDiv.innerHTML = `
          ${ramo.nombre}
          <span>${ramo.codigo}</span>
          <span>${ramo.sct} SCT</span>
          <div class="promedio" id="promedio-${ramo.codigo}"></div>
        `;

        // Clic normal: marcar aprobado
        ramoDiv.addEventListener("click", () => {
          if (!ramoDiv.classList.contains("bloqueado")) {
            ramoDiv.classList.toggle("aprobado");
            guardarEstadoRamo(ramoDiv);
            actualizarEstadoRamos();
          }
        });

        // Doble clic: ingresar notas
        ramoDiv.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          const notas = prompt("Ingresa tus notas separadas por coma (ej: 5.5,6.0,4.9):");
          if (notas) {
            const notasArr = notas.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            const promedio = (notasArr.reduce((a, b) => a + b, 0) / notasArr.length).toFixed(2);
            const promedioEl = ramoDiv.querySelector(`#promedio-${ramo.codigo}`);
            promedioEl.textContent = `Prom: ${promedio}`;
            guardarNotas(ramo.codigo, notasArr);
          }
        });

        // Restaurar estado desde localStorage
        const guardado = JSON.parse(localStorage.getItem(`ramo-${ramo.codigo}`));
        if (guardado) {
          if (guardado.aprobado) ramoDiv.classList.add("aprobado");
          const promedioEl = ramoDiv.querySelector(`#promedio-${ramo.codigo}`);
          if (guardado.notas && guardado.notas.length) {
            const promedio = (guardado.notas.reduce((a, b) => a + b, 0) / guardado.notas.length).toFixed(2);
            promedioEl.textContent = `Prom: ${promedio}`;
          }
        }

        ramosDiv.appendChild(ramoDiv);
      });

      semestreDiv.appendChild(ramosDiv);
      mallaContainer.appendChild(semestreDiv);
    });
  });

  actualizarEstadoRamos();
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

function guardarEstadoRamo(ramoDiv) {
  const codigo = ramoDiv.getAttribute("data-codigo");
  const aprobado = ramoDiv.classList.contains("aprobado");
  const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`)) || {};
  guardado.aprobado = aprobado;
  localStorage.setItem(`ramo-${codigo}`, JSON.stringify(guardado));
}

function guardarNotas(codigo, notas) {
  const guardado = JSON.parse(localStorage.getItem(`ramo-${codigo}`)) || {};
  guardado.notas = notas;
  localStorage.setItem(`ramo-${codigo}`, JSON.stringify(guardado));
}

// Ejecutar
crearMalla(malla);
