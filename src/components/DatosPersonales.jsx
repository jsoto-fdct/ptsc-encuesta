import React, { useState, useEffect } from "react";
import { getEncuestaByCedula } from "../utils/localDb.js";

const AREAS_INTERES = [
  "QUÍMICA",
  "INFORMÁTICA Y COMPUTACIÓN",
  "ASTRONOMÍA",
  "CIENCIA Y PRODUCCIÓN",
  "ROBÓTICA",
  "SALUD",
  "ECOSOCIALISMO",
  "FÍSICA Y MATEMATICA",
  "MICROSCOPÍA",
];

const GRADOS = [
  "5to grado",
  "6to grado",
  "1er año",
  "2do año",
  "3er año",
  "4to año",
  "5to año",
];

const SEXOS = ["Masculino", "Femenino"];

const SECCIONES = ["A", "B", "C", "D", "E", "F"];
const MENCIONES = ["Med. Tecnica", "Med. General"];

// Busca estudiante en la tabla local de estudiantes
function buscarEstudiantePorCedula(cedula) {
  const estudiantes = JSON.parse(localStorage.getItem("estudiantes") || "[]");
  return estudiantes.find((e) => String(e.cedula) === String(cedula));
}

function DatosPersonales({ schoolName = "Nombre del Liceo", onContinue, initialData = {}, onInicio }) {
  const [form, setForm] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    edad: "",
    sexo: "",
    grado: "",
    seccion: "", // nuevo campo opcional
    mencion: "", // nuevo campo opcional
    areaInteres: "",
    liceo: schoolName,
    mensajeVocacional: "",
    id: null,
    ...initialData,
  });
  const [errorCedula, setErrorCedula] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...initialData,
      liceo: schoolName,
      mensajeVocacional: initialData.mensajeVocacional || "",
      id: initialData.id || null,
      seccion: initialData.seccion || "",
      mencion: initialData.mencion || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, schoolName]);

  // Buscar por cédula al desenfocar: primero encuestas, luego estudiantes
  const handleCedulaBlur = () => {
    if (form.cedula) {
      // Primero buscar en encuestas
      const registro = getEncuestaByCedula(form.cedula);
      if (registro) {
        setForm((prev) => ({
          ...prev,
          ...registro,
        }));
        setErrorCedula("La cédula ya existe en encuestas, los datos han sido traídos automáticamente.");
        return;
      }
      // Si no hay en encuestas, buscar en estudiantes
      const estudiante = buscarEstudiantePorCedula(form.cedula);
      if (estudiante) {
        setForm((prev) => ({
          ...prev,
          ...estudiante,
          liceo: schoolName,
          mensajeVocacional: prev.mensajeVocacional,
          id: prev.id,
        }));
        setErrorCedula("La cédula fue encontrada en la base de estudiantes, datos traídos automáticamente.");
      } else {
        setErrorCedula(""); // No hay duplicado
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "cedula") setErrorCedula("");
  };

  const handleSelectArea = (area) => {
    setForm({ ...form, areaInteres: area });
  };

  const handleSelectSexo = (sexo) => {
    setForm({ ...form, sexo });
  };

  const handleSelectGrado = (grado) => {
    setForm({ ...form, grado });
  };

  const handleSelectSeccion = (seccion) => {
    setForm({ ...form, seccion });
  };

  const handleSelectMencion = (mencion) => {
    setForm({ ...form, mencion });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(form);
  };

  return (
    <div className="container p-3 d-flex flex-column align-items-center justify-content-center">
      <form className="mt-4 w-100" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
        <div className="mb-3 text-end">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onInicio}>
            Inicio
          </button>
        </div>

        <h3 className="mb-3 text-center">Datos personales</h3>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <label className="form-label">Cédula</label>
            <input
              type="number"
              min="1"
              className="form-control"
              name="cedula"
              value={form.cedula}
              onChange={handleInputChange}
              onBlur={handleCedulaBlur}
              required
            />
            {errorCedula && <div className="text-warning small mt-1">{errorCedula}</div>}
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              value={form.nombres}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              name="apellidos"
              value={form.apellidos}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Edad</label>
            <input
              type="number"
              min="5"
              max="20"
              className="form-control"
              name="edad"
              value={form.edad}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Selector de Sexo */}
          <div className="col-12 mb-2">
            <label className="form-label mb-2">Sexo</label>
            <div className="btn-group w-100" role="group">
              {SEXOS.map((sexo) => (
                <button
                  type="button"
                  key={sexo}
                  className={`btn ${form.sexo === sexo ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSelectSexo(sexo)}
                >
                  {sexo}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Grado que cursa */}
          <div className="col-12 mb-2">
            <label className="form-label mb-2">Grado que cursa</label>
            <div className="btn-group w-100 flex-wrap" role="group">
              {GRADOS.map((grado) => (
                <button
                  type="button"
                  key={grado}
                  className={`btn ${form.grado === grado ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSelectGrado(grado)}
                >
                  {grado}
                </button>
              ))}
            </div>

            {/* Nuevos selectores: Sección (A-F) y Mención (2 opciones).
                Se muestran en la misma sección del grado, con color distinto para no confundir */}
            <div className="mt-3">
              <label className="form-label mb-2">Sección (opcional)</label>
              <div className="btn-group w-100 flex-wrap" role="group">
                {SECCIONES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn ${form.seccion === s ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => handleSelectSeccion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label mb-2">Mención (opcional)</label>
              <div className="btn-group w-100" role="group">
                {MENCIONES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn ${form.mencion === m ? "btn-info" : "btn-outline-info"}`}
                    onClick={() => handleSelectMencion(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-12 mb-2">
            <label className="form-label">Liceo</label>
            <input type="text" className="form-control" name="liceo" value={form.liceo} disabled />
          </div>

          {/* Campo oculto para mensajeVocacional */}
          <input type="hidden" name="mensajeVocacional" value={form.mensajeVocacional || ""} readOnly />
        </div>

        <h4 className="mt-4 mb-2 text-center">Áreas de interés</h4>
        <div className="d-flex flex-column gap-2 mb-4">
          {AREAS_INTERES.map((area) => (
            <button
              type="button"
              key={area}
              className={`btn ${form.areaInteres === area ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handleSelectArea(area)}
            >
              {area}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={
            !form.cedula ||
            !form.nombres ||
            !form.apellidos ||
            !form.edad ||
            !form.sexo ||
            !form.grado ||
            !form.areaInteres
          }
        >
          Continuar
        </button>

        <div className="my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <img src="/LogoSemilleroP.png" alt="Logo Semillero" style={{ maxWidth: "300px", width: "100%", height: "auto" }} />
        </div>
      </form>
    </div>
  );
}

export default DatosPersonales;