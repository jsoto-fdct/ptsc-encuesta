import React from "react";

function Home({ onStartSurvey, schoolName = "Nombre del Liceo" }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-primary">PTSC Encuesta</h1>
        <p className="lead">¡Bienvenido a la app de encuestas offline!</p>
        <button className="btn btn-success" onClick={onStartSurvey}>
          Comenzar encuesta
        </button>
      </div>
      <footer className="bg-light text-center py-3 border-top fixed-bottom">
        <span className="fw-bold">{schoolName}</span>
      </footer>
    </div>
  );
}

export default Home;