import { supabase } from "./supabaseClient.js";

const form = document.getElementById("curso-form");

const id = document.getElementById("id");
const profesor = document.getElementById("profesor_asignado");
const nombre = document.getElementById("nombre");
const creditos = document.getElementById("creditos");

const tabla = document.getElementById("lista-cursos-body");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("cursos").insert([
      {
        id: id.value,
        profesor_asignado: profesor.value,
        nombre: nombre.value,
        creditos: parseInt(creditos.value, 10)
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
  const { data } = await supabase.from("cursos").select("*");

  tabla.innerHTML = "";

  data.forEach((c) => {
    tabla.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.profesor_asignado}</td>
        <td>${c.nombre}</td>
        <td>${c.creditos}</td>
        <td><button class="btn-delete" data-id="${c.id}">Eliminar</button></td>
      </tr>`;
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from("cursos").delete().eq("id", btn.dataset.id);
      cargar();
    };
  });
}

cargar();
