import React from "react";

function EncuestaFinalizada({ onReiniciar, onInicio }) {
  return (
    <div className="container p-3 text-center mt-5">
      <h3>¡Encuesta finalizada!</h3>
      <p>Gracias por participar.</p>
      <div className="my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "160px" }}>
        <img
          src="/LogoSemilleroP.png"
          alt="Logo Semillero"
          style={{ maxWidth: "240px", width: "100%", height: "auto" }}
        />
      </div>
      <div className="d-grid gap-3">
        <button
          type="button"
          className="btn btn-success btn-lg"
          onClick={onReiniciar}
        >
          Comenzar siguiente encuesta
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onInicio}>
          Inicio
        </button>
      </div>
    </div>
  );
}

export default EncuestaFinalizada;