import { supabase } from "./supabaseClient.js";

const form = document.getElementById("curso-form");
const tabla = document.getElementById("lista-cursos-body");

// Inputs
const idInput = document.getElementById("id");
const profesorInput = document.getElementById("profesor_asignado");
const nombreInput = document.getElementById("nombre");
const creditosInput = document.getElementById("creditos");

let idEditar = null;

// ------------------------------------------------------------
// EVENT DELEGATION
// ------------------------------------------------------------
tabla.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  
// ELIMINAR
if (btn.classList.contains("btn-delete")) {
  const idAttr = btn.getAttribute("data-id");
  const id = Number(idAttr); // <-- Asegura tipo entero
  console.log("Eliminar curso id:", id);

  if (Number.isNaN(id)) {
    alert("ID inválido para eliminar.");
    return;
  }

  if (confirm(`¿Seguro que deseas eliminar el curso ${id}?`)) {
    const { data, error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", id)
      .select(); // <-- devuelve las filas afectadas, útil para verificar

    if (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar: " + error.message);
    } else {
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`Cursos eliminados: ${count}`);
      if (count === 0) alert("No se encontró el curso para eliminar (revisa el ID o las políticas RLS).");
      cargar();
    }
  }
}


  // EDITAR
  if (btn.classList.contains("btn-edit")) {
    const id = btn.getAttribute("data-id");
    cargarDatosParaEditar(id);
  }
});

// ------------------------------------------------------------
// CARGAR DATOS EN EL FORMULARIO
// ------------------------------------------------------------
async function cargarDatosParaEditar(id) {
  const { data, error } = await supabase
    .from("cursos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    alert("No se pudo cargar la información para editar.");
    return;
  }

  idInput.value = data.id;
  profesorInput.value = data.profesor_asignado;
  nombreInput.value = data.nombre;
  creditosInput.value = data.creditos;

  idInput.disabled = true;
  idEditar = id;
}

// ------------------------------------------------------------
// GUARDAR
// ------------------------------------------------------------
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      id: idInput.value,
      profesor_asignado: profesorInput.value,
      nombre: nombreInput.value,
      creditos: creditosInput.value
    };

    let error = null;

    if (idEditar) {
      const { error: updateError } = await supabase
        .from("cursos")
        .update({
          profesor_asignado: datos.profesor_asignado,
          nombre: datos.nombre,
          creditos: datos.creditos
        })
        .eq("id", idEditar);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("cursos")
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
    .from("cursos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  let html = "";
  data.forEach((item) => {
    html += `
      <tr>
        <td>${item.id}</td>
        <td>${item.profesor_asignado}</td>
        <td>${item.nombre}</td>
        <td>${item.creditos}</td>
        <td>
          <button class="btn-edit" data-id="${item.id}">Editar</button>
          <button class="btn-delete" data-id="${item.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  tabla.innerHTML = html;
}

cargar();
