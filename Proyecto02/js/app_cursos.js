import { supabase } from "./supabaseClient.js";

// Elementos del formulario
const formCursos = document.getElementById("curso-form");
const inputProfesorAsignado = document.getElementById("profesor_asignado");
const inputNombreCurso = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");

// Tabla de cursos
const listaCursosBody = document.getElementById("lista-cursos-body");

// Evento para insertar curso
if (formCursos) {
  formCursos.addEventListener("submit", async (e) => {
    e.preventDefault();

    const profesor_asignado = inputProfesorAsignado.value.trim();
    const nombre = inputNombreCurso.value.trim();
    const creditos = parseInt(inputCreditos.value, 10);

    if (!profesor_asignado || !nombre || isNaN(creditos)) {
      alert("Complete todos los campos.");
      return;
    }

    const { error } = await supabase
      .from("cursos")
      .insert([{ profesor_asignado, nombre, creditos }]);

    if (error) {
      console.error("Error al insertar:", error);
      alert("Error al guardar el curso.");
      return;
    }

    formCursos.reset();
    cargarCursos();
  });
}

// Cargar cursos
async function cargarCursos() {
  if (!listaCursosBody) return;

  const { data: cursos, error } = await supabase
    .from("cursos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar cursos:", error);
    return;
  }

  listaCursosBody.innerHTML = "";

  cursos.forEach((curso) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${curso.profesor_asignado}</td>
      <td>${curso.nombre}</td>
      <td>${curso.creditos}</td>
      <td>
        <button class="btn-delete-curso" data-id="${curso.id}">
          Eliminar
        </button>
      </td>
    `;

    listaCursosBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-delete-curso").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      const { error } = await supabase.from("cursos").delete().eq("id", id);

      if (error) {
        alert("No se pudo eliminar.");
        return;
      }

      cargarCursos();
    });
  });
}

cargarCursos();
