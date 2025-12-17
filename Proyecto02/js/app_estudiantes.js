let estudiantes = [];
let editando = false;
let indexEdit = -1;

function guardar() {
  const est = {
    id: id.value,
    nombre: nombre.value,
    email: email.value,
    carrera: carrera.value
  };

  if (editando) {
    estudiantes[indexEdit] = est;
    editando = false;
    indexEdit = -1;
    titulo.textContent = "Registrar Estudiante";
  } else {
    estudiantes.push(est);
  }

  limpiar();
  cargar();
}

function cargar() {
  const tbody = document.getElementById("tabla");
  tbody.innerHTML = "";

  estudiantes.forEach((e, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nombre}</td>
        <td>${e.email}</td>
        <td>${e.carrera}</td>
        <td>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="eliminar(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editar(i) {
  const e = estudiantes[i];
  id.value = e.id;
  nombre.value = e.nombre;
  email.value = e.email;
  carrera.value = e.carrera;

  editando = true;
  indexEdit = i;
  titulo.textContent = "Editar Estudiante";
}

function eliminar(i) {
  if (confirm("¿Eliminar estudiante?")) {
    estudiantes.splice(i, 1);
    cargar();
  }
}

function limpiar() {
  id.value = "";
  nombre.value = "";
  email.value = "";
  carrera.value = "";
}

function cancelar() {
  limpiar();
  editando = false;
  titulo.textContent = "Registrar Estudiante";
}

function filtrar() {
  const texto = buscar.value.toLowerCase();
  document.querySelectorAll("#tabla tr").forEach(fila => {
    fila.style.display = fila.innerText.toLowerCase().includes(texto)
      ? ""
      : "none";
  });
}
