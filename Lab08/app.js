import { supabase } from './supabaseClient.js';
const form = document.getElementById('curso-form');
const inputid = document.getElementById('id');
const inputcodigo = document.getElementById('codigo');
const inputnombre = document.getElementById('nombre');
const inputcreditos = document.getElementById('creditos');
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
let editando = false; 
let listaCursos = document.getElementById("lista");
// 
// eventos
//=========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo = inputcodigo.value.trim();
    const nombre = inputnombre.value.trim();
    const creditos = parseInt(inputcreditos.value);
    if (editando) {}
    else {await crearcursos(codigo, nombre, creditos);}
    form.reset();

});
listaCursos.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        await eliminarcursos(id);
        cargarcursos();
     }
});

async function cargarcursos() {
    let { data: cursos, error } = await supabase.from('cursos').select('*');
    console.log(cursos);

    if (error) {
        console.error("Error al cargar cursos:", error);
        return;
    }

   listaCursos.innerHTML = "";
    cursos.forEach(curso => {
        let li = document.createElement("li");
        //li.textContent = curso.codigo + " - " + curso.nombre;
        li.innerHTML = `${curso.codigo} - ${curso.nombre} [${curso.creditos} Creditos] <button class="btn-delete" data-id="${curso.id}">Eliminar</button>`;
        listaCursos.appendChild(li);
    });
}

async function crearcursos(codigo, nombre, creditos) {
    const curso = { codigo, nombre, creditos };
    let { error } = await supabase.from("cursos").insert([curso])

    if (error) {
        console.error(error);
    }
    cargarcursos();
}
async function eliminarcursos(id) {
    let { error } = await supabase.from("cursos").delete().eq('id', id);
    if (error) {
        console.error(error);
    }
}

cargarcursos();