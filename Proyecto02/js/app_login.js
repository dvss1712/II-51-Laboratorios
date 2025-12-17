function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("clave").value.trim();
  const msg = document.getElementById("msg");

  // Login simulado
  if (
    (user === "admin" && pass === "1234") ||
    (user === "user" && pass === "1234")
  ) {
    localStorage.setItem("logueado", "true");
    window.location.href = "estudiantes.html";
  } else {
    msg.textContent = "❌ Usuario o contraseña incorrectos";
  }
}
