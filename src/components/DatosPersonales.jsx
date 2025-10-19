import React, { useState } from "react";

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

function DatosPersonales({ schoolName = "Nombre del Liceo", onContinue }) {
  const [form, setForm] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    edad: "",
    sexo: "",
    grado: "",
    areaInteres: "",
    liceo: schoolName,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(form);
  };

  return (
    <div className="container p-3">
      <form className="mt-4" onSubmit={handleSubmit}>
        <h3 className="mb-3">Datos personales</h3>
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
              required
            />
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
          {/* Selector de Sexo (como botones, fila propia) */}
          <div className="col-12 mb-2">
            <label className="form-label mb-2">Sexo</label>
            <div className="btn-group w-100" role="group">
              {SEXOS.map((sexo) => (
                <button
                  type="button"
                  key={sexo}
                  className={`btn ${
                    form.sexo === sexo ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleSelectSexo(sexo)}
                >
                  {sexo}
                </button>
              ))}
            </div>
          </div>
          {/* Selector de Grado que cursa (como botones, fila propia) */}
          <div className="col-12 mb-2">
            <label className="form-label mb-2">Grado que cursa</label>
            <div className="btn-group w-100 flex-wrap" role="group">
              {GRADOS.map((grado) => (
                <button
                  type="button"
                  key={grado}
                  className={`btn ${
                    form.grado === grado ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleSelectGrado(grado)}
                >
                  {grado}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-12 mb-2">
            <label className="form-label">Liceo</label>
            <input
              type="text"
              className="form-control"
              name="liceo"
              value={form.liceo}
              disabled
            />
          </div>
        </div>
        <h4 className="mt-4 mb-2">Áreas de interés</h4>
        <div className="d-flex flex-column gap-2 mb-4">
          {AREAS_INTERES.map((area) => (
            <button
              type="button"
              key={area}
              className={`btn ${
                form.areaInteres === area ? "btn-primary" : "btn-outline-primary"
              }`}
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
        {/* Espacio grande para la imagen */}
        <div className="my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <img
            src="/LogoSemilleroP.png"
            alt="Logo Semillero"
            style={{ maxWidth: "300px", width: "100%", height: "auto" }}
          />
        </div>
      </form>
    </div>
  );
}

export default DatosPersonales;