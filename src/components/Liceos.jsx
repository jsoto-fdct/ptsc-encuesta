import React, { useState } from "react";

const LICEOS = [
  "Liceo Nacional Simón Bolívar",
  "Liceo Experimental Venezuela",
  "U.E. Colegio San José",
  "Liceo Andrés Bello",
  "Liceo Fermín Toro",
];

function Liceos({ selectedSchool, onSelect, onInicio }) {
  const [school, setSchool] = useState(selectedSchool || "");

  return (
    <div className="container p-4">
      <h4 className="mb-4">Seleccione la institución a encuestar</h4>
      <div className="mb-4">
        <select
          className="form-select"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {LICEOS.map((liceo) => (
            <option key={liceo} value={liceo}>{liceo}</option>
          ))}
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