import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase config
const supabaseUrl = 'https://vwzxbqpgdsadmhzgugrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enhicXBnZHNhZG1oemd1Z3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzIyMTEsImV4cCI6MjA3NjUwODIxMX0.rA3A1K3t5E1-mw_mPuNMGLjSj8ehEhmZZbVFv7O4zDw';
const supabase = createClient(supabaseUrl, supabaseKey);

function sincronizarLiceos(setLiceos, setStatus) {
  setStatus("Sincronizando...");
  supabase
    .from("liceos")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        setStatus("Error al sincronizar: " + error.message);
      } else {
        localStorage.setItem("liceos", JSON.stringify(data));
        setLiceos(data);
        setStatus("¡Sincronización exitosa!");
      }
    });
}

function Liceos({ selectedSchool, onSelect, onInicio }) {
  const [school, setSchool] = useState(selectedSchool || "");
  const [liceos, setLiceos] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("liceos") || "[]");
    setLiceos(local);
  }, []);

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-info"
          onClick={() => sincronizarLiceos(setLiceos, setStatus)}
        >
          Actualizar
        </button>
      </div>
      {status && (
        <div className={`mb-3 text-center ${status.startsWith("Error") ? "text-danger" : "text-success"}`}>
          {status}
        </div>
      )}
      <h4 className="mb-4">Seleccione la institución a encuestar</h4>
      <div className="mb-4">
        <select
          className="form-select"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {liceos.length > 0
            ? liceos.map((liceo) => (
                <option key={liceo.nombre || liceo.id} value={liceo.nombre || liceo.id}>
                  {liceo.nombre}
                </option>
              ))
            : <option disabled value="">No hay liceos sincronizados</option>
          }
        </select>
      </div>
      <div className="d-grid gap-2 mb-4">
        <button
          className="btn btn-success btn-lg"
          disabled={!school}
          onClick={() => onSelect(school)}
        >
          Seleccionar
        </button>
      </div>
      <div className="mt-5 d-grid">
        <button className="btn btn-outline-secondary" onClick={onInicio}>
          Inicio
        </button>
      </div>
    </div>
  );
}

export default Liceos;