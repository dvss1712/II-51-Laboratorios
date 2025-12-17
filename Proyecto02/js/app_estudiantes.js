import { supabase } from "./supabaseClient.js";

const form = document.getElementById("estudiante-form");

const id = document.getElementById("id");
const nombre = document.getElementById("nombreCompleto");
const email = document.getElementById("email");
const carrera = document.getElementById("carrera");

const tabla = document.getElementById("lista-estudiantes-body");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("estudiantes").insert([
      {
        id: id.value,
        nombre_completo: nombre.value,
        email: email.value,
        carrera: carrera.value
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    form.reset();
    cargar();
  });
}

async function cargar() {
  const { data } = await supabase.from("estudiantes").select("*");

  tabla.innerHTML = "";

  data.forEach((e) => {
    tabla.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nombre_completo}</td>
        <td>${e.email}</td>
        <td>${e.carrera}</td>
        <td><button class="btn-delete" data-id="${e.id}">Eliminar</button></td>
      </tr>`;
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from("estudiantes").delete().eq("id", btn.dataset.id);
      cargar();
    };
  });
}

cargar();
