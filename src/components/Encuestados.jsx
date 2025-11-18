import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import {
  getAllEncuestas,
  deleteAllEncuestas,
  markEncuestasAsCargadasByCedulas,
  replaceAllEncuestas,
} from "../utils/localDb.js";

// Supabase config
const supabaseUrl = 'https://vwzxbqpgdsadmhzgugrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enhicXBnZHNhZG1oemd1Z3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzIyMTEsImV4cCI6MjA3NjUwODIxMX0.rA3A1K3t5E1-mw_mPuNMGLjSj8ehEhmZZbVFv7O4zDw';
const supabase = createClient(supabaseUrl, supabaseKey);

function fechaMarca() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
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
    "Sección",
    "Mención",
    "Liceo",
    "Área de interés",
    "Mensaje vocacional",
    "Cargado"
  ];
  const rows = registros.map((reg) => [
    `"${reg.cedula}"`,
    `"${reg.nombres}"`,
    `"${reg.apellidos}"`,
    `"${reg.edad}"`,
    `"${reg.sexo}"`,
    `"${reg.grado}"`,
    `"${reg.seccion || ""}"`,
    `"${reg.mencion || ""}"`,
    `"${reg.liceo || ""}"`,
    `"${reg.areaInteres || ""}"`,
    `"${reg.mensajeVocacional || ""}"`,
    `"${reg.cargado || ""}"`,
  ]);
  const csvContent = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
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
      "Sección",
      "Mención",
      "Liceo",
      "Área de interés",
      "Mensaje vocacional",
      "Cargado",
    ],
    ...registros.map((reg) => [
      reg.cedula,
      reg.nombres,
      reg.apellidos,
      reg.edad,
      reg.sexo,
      reg.grado,
      reg.seccion || "",
      reg.mencion || "",
      reg.liceo || "",
      reg.areaInteres || "",
      reg.mensajeVocacional || "",
      reg.cargado || "",
    ]),
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Encuestados");
  const marca = fechaMarca();
  const fileName = `PTSC-trujillo-${marca}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

async function importarASupabase(registros, setStatus, setLocalRegs) {
  if (!registros || registros.length === 0) {
    setStatus("No hay datos para importar.");
    return;
  }
  setStatus("Preparando importación...");
  try {
    // Solo los que no tengan cargado (campo cargado falsy)
    const pendientes = registros.filter((r) => !r.cargado);
    if (pendientes.length === 0) {
      setStatus("No hay registros pendientes por cargar.");
      return;
    }
    const marca = new Date().toISOString(); // marca de tiempo de la carga
    const insertables = pendientes.map((r) => ({
      cedula: r.cedula,
      nombres: r.nombres,
      apellidos: r.apellidos,
      edad: r.edad,
      sexo: r.sexo,
      grado: r.grado,
      seccion: r.seccion || null,
      mencion: r.mencion || null,
      liceo: r.liceo || null,
      area_interes: r.areaInteres || null,
      mensaje_vocacional: r.mensajeVocacional || "",
      cargado: marca, // guardamos marca en la BD también (si la columna existe)
    }));

    setStatus("Enviando a Supabase...");
    const { error } = await supabase.from("encuestados").insert(insertables);
    if (error) {
      setStatus("Error al importar: " + error.message);
      return;
    }
    // Si todo OK, marcar los registros locales como cargados
    const cedulasPendientes = pendientes.map((p) => String(p.cedula));
    const nuevos = markEncuestasAsCargadasByCedulas(cedulasPendientes, marca);
    setLocalRegs(nuevos);
    setStatus("¡Importación completa!");
  } catch (err) {
    setStatus("Error inesperado: " + (err.message || err));
  }
}

function Encuestados({ onInicio }) {
  const [registros, setRegistros] = useState(getAllEncuestas());
  const [detalles, setDetalles] = useState(null);
  const [status, setStatus] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [token, setToken] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setRegistros(getAllEncuestas());
  }, []);

  const handleEliminar = () => {
    setShowDeleteConfirm(true);
    setDeleteError("");
    setToken("");
  };

  const handleConfirmar = () => {
    // mostrar campo token
    setDeleteError("");
  };

  const handleEjecutarEliminacion = () => {
    if (String(token).trim() === "2810") {
      deleteAllEncuestas();
      setRegistros([]);
      setShowDeleteConfirm(false);
      setToken("");
      setDeleteError("");
      setStatus("Todas las encuestas fueron eliminadas.");
    } else {
      setDeleteError("Token incorrecto. La eliminación no se procesó.");
    }
  };

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-danger" onClick={handleEliminar}>
          Eliminar encuestas realizadas
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="mb-3 p-3 border rounded bg-light text-center">
          <p className="mb-2"><strong>¿Seguro desea eliminar todas las encuestas realizadas?</strong></p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
            <button className="btn btn-warning" onClick={handleConfirmar}>Confirmar</button>
          </div>

          {/* Si confirma, pedir token */}
          <div className="mt-3">
            <label className="form-label">Ingrese el token (4 dígitos) para confirmar</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="form-control mb-2"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-danger" onClick={handleEjecutarEliminacion}>Eliminar definitivamente</button>
              <button className="btn btn-secondary" onClick={() => { setShowDeleteConfirm(false); setToken(""); }}>Cancelar</button>
            </div>
            {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
          </div>
        </div>
      )}

      <div style={{ height: 12 }} />

      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-primary" onClick={() => exportToCSV(registros)}>Guardar en el teléfono (CSV)</button>
        <button className="btn btn-success" onClick={() => exportToExcel(registros)}>Guardar en el teléfono (Excel)</button>
        <button className="btn" style={{ backgroundColor: "#ffc107", color: "#222" }}
          onClick={() => importarASupabase(registros, setStatus, setRegistros)}>
          Enviar a Supabase
        </button>
      </div>

      {status && (
        <div className={`mb-3 text-center ${status.startsWith("Error") ? "text-danger" : "text-success"}`}>
          {status}
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
              <th>Sección</th>
              <th>Mención</th>
              <th>Campo de interés</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">No hay encuestas registradas.</td>
              </tr>
            ) : (
              registros.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.cedula}</td>
                  <td>{reg.nombres}</td>
                  <td>{reg.apellidos}</td>
                  <td>{reg.grado}</td>
                  <td>{reg.seccion || "-"}</td>
                  <td>{reg.mencion || "-"}</td>
                  <td>{reg.areaInteres}</td>
                  <td>
                    <div className="d-flex flex-column align-items-center gap-1">
                      <button className="btn btn-sm btn-info" onClick={() => setDetalles(reg)}>Ver</button>
                      {reg.cargado ? (
                        <span className="badge" style={{ backgroundColor: "#ffc107", color: "#222" }}>
                          Cargado
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 d-grid">
        <button className="btn btn-outline-secondary" onClick={onInicio}>Inicio</button>
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
            <li><strong>Sección:</strong> {detalles.seccion || "-"}</li>
            <li><strong>Mención:</strong> {detalles.mencion || "-"}</li>
            <li><strong>Liceo:</strong> {detalles.liceo}</li>
            <li><strong>Área de interés:</strong> {detalles.areaInteres}</li>
            <li><strong>Mensaje vocacional:</strong> {detalles.mensajeVocacional}</li>
            {detalles.cargado && (
              <li className="pt-2">
                <span className="badge" style={{ backgroundColor: "#ffc107", color: "#222" }}>
                  Cargado en Supabase: {detalles.cargado}
                </span>
              </li>
            )}
          </ul>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-secondary" onClick={() => setDetalles(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Encuestados;