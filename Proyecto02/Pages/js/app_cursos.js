import { supabase } from './supabaseClient.js';

// Referencias del DOM para el formulario de Cursos
const form = document.getElementById('curso-form');
const inputProfesorAsignado = document.getElementById('profesor_asignado'); 
const inputnombre = document.getElementById('nombre');
const inputcreditos = document.getElementById('creditos');
let listaCursosBody = document.getElementById("lista-cursos-body"); 

// Eventos
//=========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const profesor_asignado = inputProfesorAsignado.value.trim();
    const nombre = inputnombre.value.trim();
    const creditos = parseInt(inputcreditos.value);
    
    await crearcursos(profesor_asignado, nombre, creditos);
    form.reset();
});

listaCursosBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        await eliminarcursos(id);
        cargarcursos(); 
     }
});

// CRUD - READ (Ver)
async function cargarcursos() {
    let { data: cursos, error } = await supabase.from('cursos').select('*');

    if (error) {
        console.error("Error al cargar cursos:", error);
        return;
    }

   listaCursosBody.innerHTML = "";
    cursos.forEach(curso => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 12px;">${curso.profesor_asignado}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${curso.nombre}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${curso.creditos}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">
                <button class="btn-delete" data-id="${curso.id}" style="background-color:#dc3545; color:white; border:none; padding: 5px 10px; border-radius:4px; cursor:pointer;">Eliminar</button>
            </td>
        `;
        listaCursosBody.appendChild(tr);
    });
}

// CRUD - CREATE (Insertar)
async function crearcursos(profesor_asignado, nombre, creditos) {
    const curso = { profesor_asignado, nombre, creditos }; 
    let { error } = await supabase.from("cursos").insert([curso])

    if (error) {
        console.error("Error al insertar curso:", error);
    }
    cargarcursos();
}

// CRUD - DELETE (Eliminar)
async function eliminarcursos(id) {
    let { error } = await supabase.from("cursos").delete().eq('id', id);
    if (error) {
        console.error("Error al eliminar curso:", error);
    }
}

cargarcursos();