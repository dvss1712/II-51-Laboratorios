import { supabase as supabaseEst } from "./supabaseClient.js";

const formEstudiantes = document.getElementById("estudiante-form");
const inputNombreEst = document.getElementById("nombreCompleto");
const inputEmailEst = document.getElementById("email");
const inputCarreraEst = document.getElementById("carrera");
const listaEstudiantesBody = document.getElementById("lista-estudiantes-body");

// Agregar estudiante
if (formEstudiantes) {
  formEstudiantes.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_completo = inputNombreEst.value.trim();
    const email = inputEmailEst.value.trim();
    const carrera = inputCarreraEst.value.trim();

    if (!nombre_completo || !email || !carrera) {
      alert("Complete todos los campos.");
      return;
    }

    const { error } = await supabaseEst
      .from("estudiantes")
      .insert([{ nombre_completo, email, carrera }]);

    if (error) {
      alert("Error al insertar estudiante.");
      return;
    }

    formEstudiantes.reset();
    cargarEstudiantes();
  });
}

// Cargar estudiantes
async function cargarEstudiantes() {
  if (!listaEstudiantesBody) return;

  const { data: estudiantes, error } = await supabaseEst
    .from("estudiantes")
    .select("*")
    .order("nombre_completo");

  if (error) return;

  listaEstudiantesBody.innerHTML = "";

  estudiantes.forEach((e) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.id.substring(0, 8)}</td>
      <td>${e.nombre_completo}</td>
      <td>${e.email}</td>
      <td>${e.carrera}</td>
      <td>
        <button class="btn-delete-est" data-id="${e.id}">
          Eliminar
        </button>
      </td>
    `;

    listaEstudiantesBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-delete-est").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      await supabaseEst.from("estudiantes").delete().eq("id", id);
      cargarEstudiantes();
    });
  });
}

cargarEstudiantes();
