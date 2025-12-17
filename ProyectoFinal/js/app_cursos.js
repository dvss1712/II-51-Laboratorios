import { supabase } from "./supabaseClient.js";

const form = document.getElementById("curso-form");
const tabla = document.getElementById("lista-cursos-body");
const busquedaInput = document.getElementById("busqueda");

const idInput = document.getElementById("id");
const profesorInput = document.getElementById("profesor_asignado");
const nombreInput = document.getElementById("nombre");
const creditosInput = document.getElementById("creditos");

let idEditar = null;
let listaGlobal = []; // Almacena los datos para filtrar localmente

document.addEventListener("DOMContentLoaded", () => {
    cargar();
});

// --- FILTRO DE BÚSQUEDA ---
if (busquedaInput) {
    busquedaInput.addEventListener("input", (e) => {
        const termino = e.target.value.toLowerCase();
        const filtrados = listaGlobal.filter(item => 
            item.nombre.toLowerCase().includes(termino) || 
            item.profesor_asignado.toLowerCase().includes(termino) ||
            String(item.id).includes(termino)
        );
        renderizarTabla(filtrados);
    });
}

// --- GUARDAR / EDITAR ---
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

// --- ELIMINAR / EDITAR (Delegación) ---
tabla.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    // Editar
    if (btn.classList.contains("btn-edit")) {
        const id = btn.getAttribute("data-id");
        const curso = listaGlobal.find(c => String(c.id) === id);
        if (curso) {
            idInput.value = curso.id;
            idInput.disabled = true;
            profesorInput.value = curso.profesor_asignado;
            nombreInput.value = curso.nombre;
            creditosInput.value = curso.creditos;
            idEditar = curso.id;
        }
    }

    // Eliminar
    if (btn.classList.contains("btn-delete")) {
        const id = btn.getAttribute("data-id");
        if (confirm(`¿Eliminar curso ${id}?`)) {
            const { error } = await supabase.from("cursos").delete().eq("id", id);
            if (error) alert("Error: " + error.message);
            else cargar();
        }
    }
});

// --- CARGAR DATOS ---
async function cargar() {
    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    listaGlobal = data; // Guardamos en memoria
    renderizarTabla(listaGlobal);
}

// --- RENDERIZAR TABLA ---
function renderizarTabla(lista) {
    let html = "";
    if (lista.length === 0) {
        html = `<tr><td colspan="5" style="text-align:center;">No se encontraron resultados</td></tr>`;
    } else {
        lista.forEach((item) => {
            html += `
            <tr>
                <td>${item.id}</td>
                <td>${item.profesor_asignado}</td>
                <td>${item.nombre}</td>
                <td>${item.creditos}</td>
                <td>
                    <button class="btn-edit" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    tabla.innerHTML = html;
}