import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Supabase config
const supabaseUrl = 'https://vwzxbqpgdsadmhzgugrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enhicXBnZHNhZG1oemd1Z3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzIyMTEsImV4cCI6MjA3NjUwODIxMX0.rA3A1K3t5E1-mw_mPuNMGLjSj8ehEhmZZbVFv7O4zDw';
const supabase = createClient(supabaseUrl, supabaseKey);

function fechaMarca() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

function exportToCSV(registros) {
  if (!registros || registros.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  const headers = [
    "Cédula",
    "Nombres",
    "Apellidos",
    "Edad",
    "Sexo",
    "Grado",
    "Liceo",
    "Área de interés",
    "Mensaje vocacional"
  ];
  const rows = registros.map(reg => [
    `"${reg.cedula}"`,
    `"${reg.nombres}"`,
    `"${reg.apellidos}"`,
    `"${reg.edad}"`,
    `"${reg.sexo}"`,
    `"${reg.grado}"`,
    `"${reg.liceo}"`,
    `"${reg.areaInteres}"`,
    `"${reg.mensajeVocacional || ""}"`
  ]);
  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const marca = fechaMarca();
  const fileName = `PTSC-trujillo-${marca}.csv`;
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function exportToExcel(registros) {
  if (!registros || registros.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  const wsData = [
    [
      "Cédula",
      "Nombres",
      "Apellidos",
      "Edad",
      "Sexo",
      "Grado",
      "Liceo",
      "Área de interés",
      "Mensaje vocacional"
    ],
    ...registros.map(reg => [
      reg.cedula,
      reg.nombres,
      reg.apellidos,
      reg.edad,
      reg.sexo,
      reg.grado,
      reg.liceo,
      reg.areaInteres,
      reg.mensajeVocacional || ""
    ])
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Encuestados");
  const marca = fechaMarca();
  const fileName = `PTSC-trujillo-${marca}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

async function importarASupabase(registros, setStatus) {
  if (!registros || registros.length === 0) {
    setStatus("No hay datos para importar.");
    return;
  }
  setStatus("Importando...");
  try {
    const insertables = registros.map(reg => ({
      cedula: reg.cedula,
      nombres: reg.nombres,
      apellidos: reg.apellidos,
      edad: reg.edad,
      sexo: reg.sexo,
      grado: reg.grado,
      liceo: reg.liceo,
      area_interes: reg.areaInteres,
      mensaje_vocacional: reg.mensajeVocacional || "",
      //marca_tiempo: fechaMarca(),
    }));
    const { error } = await supabase.from('encuestados').insert(insertables);
    if (error) {
      setStatus("Error al importar: " + error.message);
    } else {
      setStatus("¡Importación exitosa!");
    }
  } catch (err) {
    setStatus("Error inesperado: " + err.message);
  }
}

function Encuestados({ onInicio }) {
  const [detalles, setDetalles] = useState(null);
  const [importStatus, setImportStatus] = useState("");
  const registros = JSON.parse(localStorage.getItem("encuestas") || "[]");

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-center gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => exportToCSV(registros)}
        >
          Guardar en el teléfono (CSV)
        </button>
        <button
          className="btn btn-success"
          onClick={() => exportToExcel(registros)}
        >
          Guardar en el teléfono (Excel)
        </button>
        <button
          className="btn btn-info"
          onClick={() => importarASupabase(registros, setImportStatus)}
        >
          Enviar a Supabase
        </button>
      </div>
      {importStatus && (
        <div className={`mb-3 text-center ${importStatus.startsWith("Error") ? "text-danger" : "text-success"}`}>
          {importStatus}
        </div>
      )}
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
      {detalles && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h5 className="text-center">Detalle de estudiante</h5>
          <ul className="list-unstyled text-center">
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