import React, { useState } from "react";
import Home from "./components/Home.jsx";
import DatosPersonales from "./components/DatosPersonales.jsx";
import VerificacionVocacional from "./components/VerificacionVocacional.jsx";
import EncuestaFinalizada from "./components/EncuestaFinalizada.jsx";
import { saveOrUpdateEncuesta, updateMensajeVocacional, getEncuesta } from "./utils/localDb.js";

function App() {
  const [pantalla, setPantalla] = useState("home");
  const [datos, setDatos] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const SCHOOL_NAME = "Liceo Nacional Simón Bolívar";

  // Al guardar datos personales, actualiza/crea el registro por cédula
  const handleContinueDatos = (formData) => {
    const id = saveOrUpdateEncuesta(formData); // si existe, actualiza; si no, crea
    setCurrentId(id);
    const registro = getEncuesta(id);
    setDatos(registro);
    setPantalla("verificacion");
  };

  // Al volver atrás desde verificación vocacional, muestra datos actuales
  const handleAtras = () => {
    if (currentId) {
      const registro = getEncuesta(currentId);
      setDatos(registro);
    }
    setPantalla("datos");
  };

  // Al finalizar verificación, guarda el mensajeVocacional
  const handleFinalizar = (finalData) => {
    if (currentId) {
      updateMensajeVocacional(currentId, finalData.mensajeVocacional || "");
      const registro = getEncuesta(currentId);
      setDatos(registro);
    }
    setPantalla("finalizado");
  };

  const handleReiniciar = () => {
    setDatos({});
    setCurrentId(null);
    setPantalla("datos");
  };

  const handleInicio = () => {
    setDatos({});
    setCurrentId(null);
    setPantalla("home");
  };

  return (
    <div>
      {pantalla === "home" && (
        <Home onStartSurvey={() => setPantalla("datos")} schoolName={SCHOOL_NAME} />
      )}
      {pantalla === "datos" && (
        <DatosPersonales
          schoolName={SCHOOL_NAME}
          onContinue={handleContinueDatos}
          initialData={datos}
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