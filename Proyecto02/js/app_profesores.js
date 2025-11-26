import { supabase } from "./supabaseClient.js";

const form = document.getElementById("profesor-form");

const id = document.getElementById("id");
const nombre = document.getElementById("nombreCompleto");
const email = document.getElementById("email");
const departamento = document.getElementById("departamento");

const tabla = document.getElementById("lista-profesores-body");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("profesores").insert([
      {
        id: id.value,
        nombre_completo: nombre.value,
        email: email.value,
        departamento: departamento.value
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
  const { data } = await supabase.from("profesores").select("*");

  tabla.innerHTML = "";

  data.forEach((p) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre_completo}</td>
        <td>${p.departamento}</td>
        <td>${p.email}</td>
        <td><button class="btn-delete" data-id="${p.id}">Eliminar</button></td>
      </tr>`;
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from("profesores").delete().eq("id", btn.dataset.id);
      cargar();
    };
  });
}

cargar();
