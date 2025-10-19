import React, { useState } from "react";
import Home from "./components/Home.jsx";
import DatosPersonales from "./components/DatosPersonales.jsx";
import VerificacionVocacional from "./components/VerificacionVocacional.jsx";
import EncuestaFinalizada from "./components/EncuestaFinalizada.jsx";

function App() {
  const [pantalla, setPantalla] = useState("home");
  const [datos, setDatos] = useState({});
  const SCHOOL_NAME = "Liceo Nacional Simón Bolívar";

  const handleStartSurvey = () => setPantalla("datos");
  const handleContinueDatos = (formData) => {
    setDatos(formData);
    setPantalla("verificacion");
  };
  const handleAtras = () => setPantalla("datos");
  const handleFinalizar = (finalData) => {
    setDatos(finalData);
    setPantalla("finalizado");
  };

  const handleReiniciar = () => {
    setDatos({});
    setPantalla("datos");
  };

  const handleInicio = () => {
    setDatos({});
    setPantalla("home");
  };

  return (
    <div>
      {pantalla === "home" && (
        <Home onStartSurvey={handleStartSurvey} schoolName={SCHOOL_NAME} />
      )}
      {pantalla === "datos" && (
        <DatosPersonales
          schoolName={SCHOOL_NAME}
          onContinue={handleContinueDatos}
        />
      )}
      {pantalla === "verificacion" && (
        <VerificacionVocacional
          datos={datos}
          onAtras={handleAtras}
          onFinalizar={handleFinalizar}
        />
      )}
      {pantalla === "finalizado" && (
        <EncuestaFinalizada
          onReiniciar={handleReiniciar}
          onInicio={handleInicio}
        />
      )}
    </div>
  );
}

export default App;