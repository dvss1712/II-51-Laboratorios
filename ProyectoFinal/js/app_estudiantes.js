import { supabase } from "./supabaseClient.js";

const form = document.getElementById("estudiante-form");
const tabla = document.getElementById("lista-estudiantes-body");
const busquedaInput = document.getElementById("busqueda");

const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombreCompleto");
const emailInput = document.getElementById("email");
const carreraInput = document.getElementById("carrera");

let idEditar = null;
let listaGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    cargar();
});

// --- FILTRO DE BÚSQUEDA ---
if (busquedaInput) {
    busquedaInput.addEventListener("input", (e) => {
        const termino = e.target.value.toLowerCase();
        const filtrados = listaGlobal.filter(item => 
            item.nombre_completo.toLowerCase().includes(termino) || 
            item.email.toLowerCase().includes(termino) ||
            item.carrera.toLowerCase().includes(termino)
        );
        renderizarTabla(filtrados);
    });
}

// --- GUARDAR / EDITAR ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        id: idInput.value,
        nombre_completo: nombreInput.value,
        email: emailInput.value,
        carrera: carreraInput.value
    };

    let error = null;

    if (idEditar) {
        const { error: updateError } = await supabase
            .from("estudiantes")
            .update({
                nombre_completo: datos.nombre_completo,
                email: datos.email,
                carrera: datos.carrera
            })
            .eq("id", idEditar);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from("estudiantes")
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

// --- ELIMINAR / EDITAR ---
tabla.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.classList.contains("btn-edit")) {
        const id = btn.getAttribute("data-id"); // Supabase devuelve ID numérico como number o string
        const item = listaGlobal.find(x => String(x.id) === String(id));
        
        if (item) {
            idInput.value = item.id;
            idInput.disabled = true;
            nombreInput.value = item.nombre_completo;
            emailInput.value = item.email;
            carreraInput.value = item.carrera;
            idEditar = item.id;
        }
    }

    if (btn.classList.contains("btn-delete")) {
        const id = btn.getAttribute("data-id");
        if (confirm("¿Eliminar estudiante?")) {
            const { error } = await supabase.from("estudiantes").delete().eq("id", id);
            if (error) alert("Error: " + error.message);
            else cargar();
        }
    }
});

// --- CARGAR DATOS ---
async function cargar() {
    const { data, error } = await supabase
        .from("estudiantes")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    listaGlobal = data;
    renderizarTabla(listaGlobal);
}

// --- RENDERIZAR TABLA ---
function renderizarTabla(lista) {
    let html = "";
    if (lista.length === 0) {
        html = `<tr><td colspan="5" style="text-align:center;">No se encontraron resultados</td></tr>`;
    } else {
        lista.forEach((e) => {
            html += `
            <tr>
                <td>${e.id}</td>
                <td>${e.nombre_completo}</td>
                <td>${e.email}</td>
                <td>${e.carrera}</td>
                <td>
                    <button class="btn-edit" data-id="${e.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-delete" data-id="${e.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    tabla.innerHTML = html;
}