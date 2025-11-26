import { supabase } from './supabaseClient.js';

// Referencias del DOM para el formulario de Estudiantes
const form = document.getElementById('estudiante-form');
const inputNombre = document.getElementById('nombreCompleto');
const inputEmail = document.getElementById('email');
const inputCarrera = document.getElementById('carrera');
let listaEstudiantesBody = document.getElementById("lista-estudiantes-body"); 

// Eventos
//=========================
// 1. Manejo del Submit del formulario (CREATE)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre_completo = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();
    
    await crearEstudiante(nombre_completo, email, carrera);
    form.reset();
});

// 2. Manejo de clics en la lista para el botón Eliminar (DELETE)
listaEstudiantesBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        await eliminarEstudiante(id);
        cargarEstudiantes(); 
     }
});

// CRUD - READ (Ver)
async function cargarEstudiantes() {
    let { data: estudiantes, error } = await supabase.from('estudiantes').select('*');

    if (error) {
        console.error("Error al cargar estudiantes:", error);
        return;
    }

   listaEstudiantesBody.innerHTML = "";
    estudiantes.forEach(estudiante => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 12px;">${estudiante.id.substring(0, 8)}...</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${estudiante.nombre_completo}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${estudiante.email}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${estudiante.carrera}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">
                <button class="btn-delete" data-id="${estudiante.id}" style="background-color:#dc3545; color:white; border:none; padding: 5px 10px; border-radius:4px; cursor:pointer;">Eliminar</button>
            </td>
        `;
        listaEstudiantesBody.appendChild(tr);
    });
}

// CRUD - CREATE (Insertar)
async function crearEstudiante(nombre_completo, email, carrera) {
    const estudiante = { nombre_completo, email, carrera };
    let { error } = await supabase.from("estudiantes").insert([estudiante])

    if (error) {
        console.error("Error al insertar estudiante:", error);
    }
    cargarEstudiantes();
}

// CRUD - DELETE (Eliminar)
async function eliminarEstudiante(id) {
    let { error } = await supabase.from("estudiantes").delete().eq('id', id);
    if (error) {
        console.error("Error al eliminar estudiante:", error);
    }
}

// Inicia la carga de datos al cargar la página
cargarEstudiantes();