import { supabase as supabaseProf } from "./supabaseClient.js";

const formProfesores = document.getElementById("profesor-form");
const inputNombreProf = document.getElementById("nombreCompleto");
const inputEmailProf = document.getElementById("email");
const inputDepartamentoProf = document.getElementById("departamento");
const listaProfesoresBody = document.getElementById("lista-profesores-body");

// Agregar profesor
if (formProfesores) {
  formProfesores.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_completo = inputNombreProf.value.trim();
    const email = inputEmailProf.value.trim();
    const departamento = inputDepartamentoProf.value.trim();

    if (!nombre_completo || !email || !departamento) {
      alert("Complete todos los campos.");
      return;
    }

    const { error } = await supabaseProf
      .from("profesores")
      .insert([{ nombre_completo, email, departamento }]);

    if (error) {
      alert("Error al insertar profesor.");
      return;
    }

    formProfesores.reset();
    cargarProfesores();
  });
}

// Cargar profesores
async function cargarProfesores() {
  if (!listaProfesoresBody) return;

  const { data: profesores } = await supabaseProf
    .from("profesores")
    .select("*")
    .order("nombre_completo");

  listaProfesoresBody.innerHTML = "";

  profesores.forEach((p) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id.substring(0, 8)}</td>
      <td>${p.nombre_completo}</td>
      <td>${p.departamento}</td>
      <td>${p.email}</td>
      <td>
        <button class="btn-delete-prof" data-id="${p.id}">
          Eliminar
        </button>
      </td>
    `;

    listaProfesoresBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-delete-prof").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      await supabaseProf.from("profesores").delete().eq("id", id);
      cargarProfesores();
    });
  });
}

cargarProfesores();
