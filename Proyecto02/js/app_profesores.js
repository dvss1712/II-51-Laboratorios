let profesores = [];
let editando = false;
let indexEdit = -1;

function guardar() {
  const p = {
    id: id.value,
    nombre: nombre.value,
    email: email.value
  };

  if (editando) {
    profesores[indexEdit] = p;
    editando = false;
    indexEdit = -1;
    titulo.textContent = "Registrar Profesor";
  } else {
    profesores.push(p);
  }

  limpiar();
  cargar();
}

function cargar() {
  tabla.innerHTML = "";
  profesores.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.email}</td>
        <td>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="eliminar(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editar(i) {
  const p = profesores[i];
  id.value = p.id;
  nombre.value = p.nombre;
  email.value = p.email;
  editando = true;
  indexEdit = i;
  titulo.textContent = "Editar Profesor";
}

function eliminar(i) {
  if (confirm("¿Eliminar profesor?")) {
    profesores.splice(i, 1);
    cargar();
  }
}

function limpiar() {
  id.value = "";
  nombre.value = "";
  email.value = "";
}

function cancelar() {
  limpiar();
  editando = false;
  titulo.textContent = "Registrar Profesor";
}
