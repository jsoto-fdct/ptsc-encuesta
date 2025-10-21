import React, { useState } from "react";
import { FaUniversity, FaUserGraduate, FaListAlt, FaEllipsisV } from "react-icons/fa";

function Home({ onStartSurvey, schoolName = "Nombre del Liceo", onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
        <h1 className="text-primary">PTSC Encuesta</h1>
        <p className="lead">¡Bienvenido a la app de encuestas offline!</p>
        <button className="btn btn-success" onClick={onStartSurvey}>
          Comenzar encuesta
        </button>
      </div>
      <footer className="bg-light border-top fixed-bottom py-2 px-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">{schoolName}</span>
          <div className="position-relative">
            <button
              className="btn btn-outline-secondary"
              style={{ borderRadius: "50%" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaEllipsisV size={22} />
            </button>
            {menuOpen && (
              <div
                className="position-absolute end-0 bg-white border rounded shadow px-2 py-2"
                style={{ minWidth: 120, bottom: "110%" }}
              >
                <button
                  className="btn btn-link d-flex align-items-center w-100 text-start"
                  onClick={() => { setMenuOpen(false); onNavigate("liceos"); }}
                >
                  <FaUniversity className="me-2" /> Liceos
                </button>
                <button
                  className="btn btn-link d-flex align-items-center w-100 text-start"
                  onClick={() => { setMenuOpen(false); onNavigate("estudiantes"); }}
                >
                  <FaUserGraduate className="me-2" /> Estudiantes
                </button>
                <button
                  className="btn btn-link d-flex align-items-center w-100 text-start"
                  onClick={() => { setMenuOpen(false); onNavigate("encuestados"); }}
                >
                  <FaListAlt className="me-2" /> Encuestados
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;