import { supabase } from "./supabaseClient.js";

const form = document.getElementById("curso-form");

const id = document.getElementById("id");
const profesor = document.getElementById("profesor_asignado");
const nombre = document.getElementById("nombre");
const creditos = document.getElementById("creditos");

const tabla = document.getElementById("lista-cursos-body");

// ==========================
//   GUARDAR
// ==========================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      id: id.value.trim(),
      profesor_asignado: profesor.value.trim(),
      nombre: nombre.value.trim(),
      creditos: parseInt(creditos.value, 10)
    };

    const { error } = await supabase.from("cursos").insert([datos]);

    if (error) {
      alert("❌ Error al guardar: " + error.message);
      console.error(error);
      return;
    }

    form.reset();
    cargar();
  });
}

// ==========================
//   CARGAR TABLA
// ==========================
async function cargar() {
  const { data, error } = await supabase
    .from("cursos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("❌ Error al cargar cursos:", error);
    return;
  }

  tabla.innerHTML = "";

  data.forEach((c) => {
    tabla.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.profesor_asignado}</td>
        <td>${c.nombre}</td>
        <td>${c.creditos}</td>
        <td>
            <button class="btn-delete" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  agregarEventosEliminar();
}

// ==========================
//   ELIMINAR
// ==========================
function agregarEventosEliminar() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = async () => {
      const idCurso = btn.dataset.id;

      const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", idCurso);

      if (error) {
        alert("❌ Error al eliminar: " + error.message);
        return;
      }

      cargar();
    };
  });
}

cargar();
