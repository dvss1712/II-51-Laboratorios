import { supabase } from "./supabaseClient.js";

const form = document.getElementById("profesor-form");

const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombreCompleto");
const emailInput = document.getElementById("email");
const deptoInput = document.getElementById("departamento");

const tabla = document.getElementById("lista-profesores-body");

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
  console.log("Eliminar profesor id:", id);

  if (Number.isNaN(id)) {
    alert("ID inválido para eliminar.");
    return;
  }

  if (confirm("¿Eliminar profesor?")) {
    const { data, error } = await supabase
      .from("profesores")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar: " + error.message);
    } else {
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`Profesores eliminados: ${count}`);
      if (count === 0) alert("No se encontró el profesor para eliminar (revisa el ID o las políticas RLS).");
      cargar();
    }
  }
}


  // EDITAR
  if (btn.classList.contains("btn-edit")) {
    const id = btn.getAttribute("data-id");
    const { data, error } = await supabase
      .from("profesores")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("No se pudo cargar el profesor");
      return;
    }

    idInput.value = data.id;
    nombreInput.value = data.nombre_completo;
    emailInput.value = data.email;
    deptoInput.value = data.departamento;

    idInput.disabled = true;
    idEditar = data.id;
  }
});

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      id: idInput.value,
      nombre_completo: nombreInput.value,
      email: emailInput.value,
      departamento: deptoInput.value
    };

    let error = null;

    if (idEditar) {
      const { error: updateError } = await supabase
        .from("profesores")
        .update({
          nombre_completo: datos.nombre_completo,
          email: datos.email,
          departamento: datos.departamento
        })
        .eq("id", idEditar);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("profesores")
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

async function cargar() {
  const { data, error } = await supabase
    .from("profesores")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  tabla.innerHTML = "";

  data.forEach((p) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre_completo}</td>
        <td>${p.departamento}</td>
        <td>${p.email}</td>
        <td>
          <button class="btn-edit" data-id="${p.id}">Editar</button>
          <button class="btn-delete" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

cargar();
