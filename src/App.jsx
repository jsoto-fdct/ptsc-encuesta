import React, { useState, useEffect } from "react";
import Home from "./components/Home.jsx";
import DatosPersonales from "./components/DatosPersonales.jsx";
import VerificacionVocacional from "./components/VerificacionVocacional.jsx";
import EncuestaFinalizada from "./components/EncuestaFinalizada.jsx";
import Liceos from "./components/Liceos.jsx";
import Encuestados from "./components/Encuestados.jsx";
import Estudiantes from "./components/Estudiantes.jsx";
import {
  saveOrUpdateEncuesta,
  getEncuesta,
  getLiceoSeleccionado,
  setLiceoSeleccionado,
} from "./utils/localDb.js";
import "./index.css"; // asegúrate de importar tu CSS global

function App() {
  const [pantalla, setPantalla] = useState("home");
  const [datos, setDatos] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [schoolName, setSchoolName] = useState(getLiceoSeleccionado());

  useEffect(() => {
    // sincroniza el nombre del liceo desde localStorage al iniciar la app
    setSchoolName(getLiceoSeleccionado());
  }, []);

  const handleNavigate = (destino) => setPantalla(destino);

  // Cuando el usuario completa datos personales: crear o actualizar registro en localStorage
  const handleContinueDatos = (formData) => {
    // Aseguramos que el liceo esté presente en el objeto a guardar
    const id = saveOrUpdateEncuesta({ ...formData, liceo: schoolName });
    setCurrentId(id);
    const registro = getEncuesta(id);
    setDatos(registro || { ...formData, id });
    setPantalla("verificacion");
  };

  // Volver atrás desde verificación: cargar datos del registro en trabajo
  const handleAtras = () => {
    if (currentId) {
      const registro = getEncuesta(currentId);
      if (registro) setDatos(registro);
    }
    setPantalla("datos");
  };

  // Al finalizar la verificación, actualizar únicamente el mensaje vocacional (o crear si no existe)
  const handleFinalizar = (finalData) => {
    // finalData debe contener mensajeVocacional
    if (currentId) {
      // obtener registro actual y actualizar solo el mensajeVocacional (manteniendo otras propiedades)
      const registro = getEncuesta(currentId) || {};
      const actualizado = {
        ...registro,
        mensajeVocacional: finalData.mensajeVocacional || "",
        seccion: registro.seccion ?? finalData.seccion,
        mencion: registro.mencion ?? finalData.mencion,
      };
      const id = saveOrUpdateEncuesta(actualizado); // actualiza por cédula/id
      setCurrentId(id);
      setDatos(getEncuesta(id));
    } else {
      // No había id (caso raro): crear registro completo con lo que tengamos
      const creadoId = saveOrUpdateEncuesta({
        ...finalData,
        liceo: schoolName,
        mensajeVocacional: finalData.mensajeVocacional || "",
      });
      setCurrentId(creadoId);
      setDatos(getEncuesta(creadoId));
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

  // Seleccionar liceo desde la pantalla liceos y persistirlo
  const handleSelectLiceo = (selected) => {
    setSchoolName(selected);
    setLiceoSeleccionado(selected);
    setPantalla("home");
  };

  return (
    <div id="app-root" className="w-100 d-flex flex-column">
      {/* main content area: ocupa el espacio disponible y permite scroll si el contenido es mayor */}
      <main className={`app-content app-content--with-fixed-footer`}>
        {/* encapsulo la UI dentro de un ancho limitado para que siempre esté centrada horizontalmente */}
        <div style={{ width: "100%" }}>
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
            <EncuestaFinalizada onReiniciar={handleReiniciar} onInicio={handleInicio} />
          )}

          {pantalla === "liceos" && (
            <Liceos selectedSchool={schoolName} onSelect={handleSelectLiceo} onInicio={handleInicio} />
          )}

          {pantalla === "encuestados" && <Encuestados onInicio={handleInicio} />}

          {pantalla === "estudiantes" && <Estudiantes onInicio={handleInicio} />}
        </div>
      </main>
    </div>
  );
}

export default App;