// Guarda o actualiza un registro por cédula. Devuelve el id asignado
export function saveOrUpdateEncuesta(data) {
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");
  let id = data.id || Date.now();
  const idx = registros.findIndex((r) => String(r.cedula) === String(data.cedula));
  if (idx !== -1) {
    registros[idx] = { ...registros[idx], ...data, id };
  } else {
    registros.push({ ...data, id });
  }
  localStorage.setItem("encuestas", JSON.stringify(registros));
  return id;
}

// Actualiza solo el mensaje vocacional de un registro por id
export function updateMensajeVocacional(id, mensajeVocacional) {
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");
  const idx = registros.findIndex((r) => r.id === id);
  if (idx !== -1) {
    registros[idx] = { ...registros[idx], mensajeVocacional };
    localStorage.setItem("encuestas", JSON.stringify(registros));
  }
}

// Obtiene un registro por id
export function getEncuesta(id) {
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");
  return registros.find((r) => r.id === id);
}

// Busca un registro por cédula
export function getEncuestaByCedula(cedula) {
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");
  return registros.find((r) => String(r.cedula) === String(cedula));
}

// Guardar y obtener liceo seleccionado
export function setLiceoSeleccionado(liceo) {
  localStorage.setItem("liceoSeleccionado", liceo);
}
export function getLiceoSeleccionado() {
  return localStorage.getItem("liceoSeleccionado") || "Liceo Nacional Simón Bolívar";
}