import React, { useState } from "react";
import { getEncuesta } from "../utils/localDb.js";

function Encuestados({ onInicio }) {
  const [detalles, setDetalles] = useState(null);
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");

  return (
    <div className="container p-4">
      <h4 className="mb-4 text-center">Estudiantes encuestados</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Grado</th>
              <th>Campo de interés</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">No hay encuestas registradas.</td>
              </tr>
            ) : (
              registros.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.cedula}</td>
                  <td>{reg.nombres}</td>
                  <td>{reg.apellidos}</td>
                  <td>{reg.grado}</td>
                  <td>{reg.areaInteres}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setDetalles(reg)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-5 d-grid">
        <button className="btn btn-outline-secondary" onClick={onInicio}>
          Inicio
        </button>
      </div>
      {/* Modal o detalles debajo */}
      {detalles && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h5>Detalle de estudiante</h5>
          <ul className="list-unstyled">
            <li><strong>Cédula:</strong> {detalles.cedula}</li>
            <li><strong>Nombres:</strong> {detalles.nombres}</li>
            <li><strong>Apellidos:</strong> {detalles.apellidos}</li>
            <li><strong>Edad:</strong> {detalles.edad}</li>
            <li><strong>Sexo:</strong> {detalles.sexo}</li>
            <li><strong>Grado:</strong> {detalles.grado}</li>
            <li><strong>Liceo:</strong> {detalles.liceo}</li>
            <li><strong>Área de interés:</strong> {detalles.areaInteres}</li>
            <li><strong>Mensaje vocacional:</strong> {detalles.mensajeVocacional}</li>
          </ul>
          <button className="btn btn-secondary" onClick={() => setDetalles(null)}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Encuestados;