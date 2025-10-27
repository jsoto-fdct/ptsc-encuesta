// Helper local para manejar almacenamiento en localStorage
// Campos esperados en cada registro (encuesta):
// {
//   id,
//   cedula,
//   nombres,
//   apellidos,
//   edad,
//   sexo,
//   grado,
//   seccion,      // nuevo opcional
//   mencion,      // nuevo opcional
//   areaInteres,
//   liceo,
//   mensajeVocacional,
//   cargado       // opcional, marca de tiempo cuando fue cargado a supabase
// }

const KEY_ENCUESTAS = "encuestas";
const KEY_ESTUDIANTES = "estudiantes";
const KEY_LICEOS = "liceos";
const KEY_LICEO_SELECCIONADO = "liceoSeleccionado";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (e) {
    console.error("localDb read error", e);
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localDb write error", e);
  }
}

// Encuestas
export function getAllEncuestas() {
  return read(KEY_ENCUESTAS) || [];
}

export function saveOrUpdateEncuesta(data) {
  const registros = getAllEncuestas();
  // asegúrate de incluir los campos opcionales con valores por defecto
  const registroNormalizado = {
    id: data.id || null,
    cedula: data.cedula || "",
    nombres: data.nombres || "",
    apellidos: data.apellidos || "",
    edad: data.edad || "",
    sexo: data.sexo || "",
    grado: data.grado || "",
    seccion: data.seccion || "",
    mencion: data.mencion || "",
    areaInteres: data.areaInteres || "",
    liceo: data.liceo || "",
    mensajeVocacional: data.mensajeVocacional || "",
    cargado: data.cargado || null,
  };

  // Buscar por cédula (único)
  const idx = registros.findIndex((r) => String(r.cedula) === String(registroNormalizado.cedula));
  let id = registroNormalizado.id || Date.now();
  if (idx !== -1) {
    // preservar id original
    id = registros[idx].id || id;
    registros[idx] = { ...registros[idx], ...registroNormalizado, id };
  } else {
    registros.push({ ...registroNormalizado, id });
  }
  write(KEY_ENCUESTAS, registros);
  return id;
}

export function getEncuesta(id) {
  const registros = getAllEncuestas();
  return registros.find((r) => r.id === id);
}

export function getEncuestaByCedula(cedula) {
  const registros = getAllEncuestas();
  return registros.find((r) => String(r.cedula) === String(cedula));
}

export function deleteAllEncuestas() {
  localStorage.removeItem(KEY_ENCUESTAS);
}

export function markEncuestasAsCargadasByCedulas(cedulas = [], marca = null) {
  const registros = getAllEncuestas();
  const newRegs = registros.map((r) => {
    if (cedulas.includes(String(r.cedula))) {
      return { ...r, cargado: marca || new Date().toISOString() };
    }
    return r;
  });
  write(KEY_ENCUESTAS, newRegs);
  return newRegs;
}

// Estudiantes (tabla maestra, solo lectura local para autocompletar datos)
export function getAllEstudiantes() {
  return read(KEY_ESTUDIANTES) || [];
}
export function saveEstudiantes(list = []) {
  // list expected array of student objects (from supabase)
  write(KEY_ESTUDIANTES, list || []);
}
export function getEstudianteByCedula(cedula) {
  const estudiantes = getAllEstudiantes();
  return estudiantes.find((e) => String(e.cedula) === String(cedula));
}
export function clearEstudiantes() {
  localStorage.removeItem(KEY_ESTUDIANTES);
}

// Liceos
export function getAllLiceos() {
  return read(KEY_LICEOS) || [];
}
export function saveLiceos(list = []) {
  write(KEY_LICEOS, list || []);
}
export function clearLiceos() {
  localStorage.removeItem(KEY_LICEOS);
}

// Liceo seleccionado persistente
export function setLiceoSeleccionado(liceo) {
  localStorage.setItem(KEY_LICEO_SELECCIONADO, liceo);
}
export function getLiceoSeleccionado() {
  return localStorage.getItem(KEY_LICEO_SELECCIONADO) || "Liceo Nacional Simón Bolívar";
}

// Utility: reemplaza toda la colección de encuestas (útil si necesitas reescribir)
export function replaceAllEncuestas(lista = []) {
  write(KEY_ENCUESTAS, lista || []);
}

// Export default helper object (opcional)
const localDb = {
  getAllEncuestas,
  saveOrUpdateEncuesta,
  getEncuesta,
  getEncuestaByCedula,
  deleteAllEncuestas,
  markEncuestasAsCargadasByCedulas,
  getAllEstudiantes,
  saveEstudiantes,
  getEstudianteByCedula,
  clearEstudiantes,
  getAllLiceos,
  saveLiceos,
  clearLiceos,
  setLiceoSeleccionado,
  getLiceoSeleccionado,
  replaceAllEncuestas,
};

export default localDb;