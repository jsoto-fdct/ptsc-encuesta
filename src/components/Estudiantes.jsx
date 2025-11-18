import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://vwzxbqpgdsadmhzgugrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enhicXBnZHNhZG1oemd1Z3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzIyMTEsImV4cCI6MjA3NjUwODIxMX0.rA3A1K3t5E1-mw_mPuNMGLjSj8ehEhmZZbVFv7O4zDw';
const supabase = createClient(supabaseUrl, supabaseKey);

function sincronizarEstudiantes(setEstudiantes, setStatus) {
  setStatus("Sincronizando...");
  supabase
    .from("estudiantes")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        setStatus("Error al sincronizar: " + error.message);
      } else {
        // Guardar en localStorage y actualizar el estado
        localStorage.setItem("estudiantes", JSON.stringify(data));
        setEstudiantes(data);
        setStatus("¡Sincronización exitosa!");
      }
    });
}

function Estudiantes({ onInicio }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("estudiantes") || "[]");
    setEstudiantes(local);
  }, []);

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-outline-secondary" onClick={onInicio}>
          Inicio
        </button>
        <button
          className="btn btn-info"
          onClick={() => sincronizarEstudiantes(setEstudiantes, setStatus)}
        >
          Actualizar datos
        </button>
      </div>
      {status && (
        <div className={`mb-3 text-center ${status.startsWith("Error") ? "text-danger" : "text-success"}`}>
          {status}
        </div>
      )}
      <h4 className="mb-4 text-center">Estudiantes por encuestar</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Cédula</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Grado</th>
              <th>Liceo</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No hay estudiantes registrados.</td>
              </tr>
            ) : (
              estudiantes.map(est => (
                <tr key={est.cedula}>
                  <td>{est.cedula}</td>
                  <td>{est.nombres}</td>
                  <td>{est.apellidos}</td>
                  <td>{est.edad}</td>
                  <td>{est.sexo}</td>
                  <td>{est.grado}</td>
                  <td>{est.liceo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Estudiantes;