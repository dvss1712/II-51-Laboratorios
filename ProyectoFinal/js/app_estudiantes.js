import { supabase } from "./supabaseClient.js";

const form = document.getElementById("estudiante-form");
const tabla = document.getElementById("lista-estudiantes-body");

const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombreCompleto");
const emailInput = document.getElementById("email");
const carreraInput = document.getElementById("carrera");

let idEditar = null;

// ------------------------------------------------------------
// EVENT DELEGATION
// ------------------------------------------------------------
tabla.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;



  // ELIMINAR
 if (btn.classList.contains("btn-delete")) {
  const id = Number(btn.getAttribute("data-id"));
  console.log("Eliminar estudiante id:", id);

  if (Number.isNaN(id)) {
    alert("ID inválido para eliminar.");
    return;
  }

  if (confirm("¿Eliminar estudiante?")) {
    const { data, error } = await supabase
      .from("estudiantes")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("Error al eliminar: " + error.message);
    } else {
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`Estudiantes eliminados: ${count}`);
      if (count === 0) alert("No se encontró el estudiante para eliminar (revisa el ID o las políticas RLS).");
      cargar();
    }
  }
}




  // EDITAR
  if (btn.classList.contains("btn-edit")) {
    const id = btn.getAttribute("data-id");
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("No se pudo cargar el estudiante");
      return;
    }

    idInput.value = data.id;
    nombreInput.value = data.nombre_completo;
    emailInput.value = data.email;
    carreraInput.value = data.carrera;

    idInput.disabled = true;
    idEditar = data.id;
  }
});

// ------------------------------------------------------------
// GUARDAR
// ------------------------------------------------------------
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      id: idInput.value,
      nombre_completo: nombreInput.value,
      email: emailInput.value,
      carrera: carreraInput.value
    };

    let error = null;

    if (idEditar) {
      const { error: updateError } = await supabase
        .from("estudiantes")
        .update({
          nombre_completo: datos.nombre_completo,
          email: datos.email,
          carrera: datos.carrera
        })
        .eq("id", idEditar);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("estudiantes")
        .insert([datos]);
      error = insertError;
    }

    if (error) {
      alert("Error al guardar: " + error.message);
      return;
    }

    form.reset();
    idEditar = null;
    idInput.disabled = false;
    cargar();
  });
}

// ------------------------------------------------------------
// CARGAR TABLA
// ------------------------------------------------------------
async function cargar() {
  const { data, error } = await supabase
    .from("estudiantes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  let html = "";
  data.forEach((e) => {
    html += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nombre_completo}</td>
        <td>${e.email}</td>
        <td>${e.carrera}</td>
        <td>
          <button class="btn-edit" data-id="${e.id}">Editar</button>
          <button class="btn-delete" data-id="${e.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  tabla.innerHTML = html;
}

cargar();
