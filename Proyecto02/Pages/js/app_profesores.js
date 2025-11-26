import { supabase } from './supabaseClient.js';

// Referencias del DOM para el formulario de Profesores
const form = document.getElementById('profesor-form');
const inputNombre = document.getElementById('nombreCompleto');
const inputEmail = document.getElementById('email');
const inputDepartamento = document.getElementById('departamento');
let listaProfesoresBody = document.getElementById("lista-profesores-body"); 

// Eventos
//=========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre_completo = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const departamento = inputDepartamento.value.trim();
    
    await crearProfesor(nombre_completo, email, departamento);
    form.reset();
});

listaProfesoresBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        await eliminarProfesor(id);
        cargarProfesores(); 
     }
});

// CRUD - READ (Ver)
async function cargarProfesores() {
    let { data: profesores, error } = await supabase.from('profesores').select('*');

    if (error) {
        console.error("Error al cargar profesores:", error);
        return;
    }

   listaProfesoresBody.innerHTML = "";
    profesores.forEach(profesor => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 12px;">${profesor.id.substring(0, 8)}...</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${profesor.nombre_completo}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${profesor.departamento}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${profesor.email}</td>
            <td style="border: 1px solid #ddd; padding: 12px;">
                <button class="btn-delete" data-id="${profesor.id}" style="background-color:#dc3545; color:white; border:none; padding: 5px 10px; border-radius:4px; cursor:pointer;">Eliminar</button>
            </td>
        `;
        listaProfesoresBody.appendChild(tr);
    });
}

// CRUD - CREATE (Insertar)
async function crearProfesor(nombre_completo, email, departamento) {
    const profesor = { nombre_completo, email, departamento };
    let { error } = await supabase.from("profesores").insert([profesor])

    if (error) {
        console.error("Error al insertar profesor:", error);
    }
    cargarProfesores();
}

// CRUD - DELETE (Eliminar)
async function eliminarProfesor(id) {
    let { error } = await supabase.from("profesores").delete().eq('id', id);
    if (error) {
        console.error("Error al eliminar profesor:", error);
    }
}

cargarProfesores();