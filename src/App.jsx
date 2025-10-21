import React, { useState } from "react";
import Home from "./components/Home.jsx";
import DatosPersonales from "./components/DatosPersonales.jsx";
import VerificacionVocacional from "./components/VerificacionVocacional.jsx";
import EncuestaFinalizada from "./components/EncuestaFinalizada.jsx";
import Liceos from "./components/Liceos.jsx";
import Encuestados from "./components/Encuestados.jsx";
import Estudiantes from "./components/Estudiantes.jsx";
import { saveOrUpdateEncuesta, updateMensajeVocacional, getEncuesta, setLiceoSeleccionado, getLiceoSeleccionado } from "./utils/localDb.js";

function App() {
  const [pantalla, setPantalla] = useState("home");
  const [datos, setDatos] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [schoolName, setSchoolName] = useState(getLiceoSeleccionado());

  const handleNavigate = (destino) => setPantalla(destino);

  const handleContinueDatos = (formData) => {
    const id = saveOrUpdateEncuesta({ ...formData, liceo: schoolName });
    setCurrentId(id);
    const registro = getEncuesta(id);
    setDatos(registro);
    setPantalla("verificacion");
  };

  const handleAtras = () => {
    if (currentId) {
      const registro = getEncuesta(currentId);
      setDatos(registro);
    }
    setPantalla("datos");
  };

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

  const handleSelectLiceo = (selected) => {
    setSchoolName(selected);
    setLiceoSeleccionado(selected);
    setPantalla("home");
  };

  return (
    <div>
      {pantalla === "home" && (
        <Home
          onStartSurvey={() => setPantalla("datos")}
          schoolName={schoolName}
          onNavigate={handleNavigate}
        />
      )}
      {pantalla === "datos" && (
        <DatosPersonales
          schoolName={schoolName}
          onContinue={handleContinueDatos}
          initialData={datos}
          onInicio={handleInicio}
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
      {pantalla === "liceos" && (
        <Liceos
          selectedSchool={schoolName}
          onSelect={handleSelectLiceo}
          onInicio={handleInicio}
        />
      )}
      {pantalla === "encuestados" && (
        <Encuestados
          onInicio={handleInicio}
        />
      )}
      {pantalla === "estudiantes" && (
        <Estudiantes
          onInicio={handleInicio}
        />
      )}
    </div>
  );
}

export default App;