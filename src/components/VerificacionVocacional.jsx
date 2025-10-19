import React, { useState } from "react";

const MENSAJES_AREA = {
  "QUÍMICA": [
    "¿Te gustaría descubrir de qué están hechos los objetos, alimentos o medicamentos que usas y consumes?",
    "¿Te interesa saber cómo reaccionan los elementos o compuestos quimicos?"
  ],
  "INFORMÁTICA Y COMPUTACIÓN": [
    "¿Te gusta usar la computadora y quisieras aprender a crear tus propias apps o videojuegos?",
    "¿Te interesaría descubrir cómo funcionan los sistemas digitales, la red de internet o la inteligencia artificial, y cómo la ciberseguridad protege toda esa información para que sea segura?"
  ],
  "ASTRONOMÍA": [
    "¿Te gusta observar el cielo y saber cómo funcionan los planetas, estrellas o galaxias?",
    "¿Te gustaría ver a través del telescopio los planetas, satelites y estrellas que conforman nuestro universo?"
  ],
  "CIENCIA Y PRODUCCIÓN": [
    "¿Te gustaría saber cómo se fabrican los productos que usamos?",
    "¿Te interesaría descubrir cómo la ciencia y la tecnología pueden ayudarnos a producir alimentos más rápido y más seguros, o a cultivar de manera más ecológica para el planeta?"
  ],
  "ROBÓTICA": [
    "¿Te gustaría saber como la robótica y la inteligencia artificial pueden automatizar procesos para generar solucuiones a problematicas?",
    "¿Te interesaría aprender a programar robots y sistemas autónomos para automatizar procesos, logrando que sea eficiente y seguro en diversas áreas?"
  ],
  "SALUD": [
    "¿Te gustaría ayudar a otras personas a mejorar su salud o prevenir enfermedades?",
    "¿Te interesa aprender cómo funciona el cuerpo humano y cómo tratar sus problemas?"
  ],
  "ECOSOCIALISMO": [
    "¿Te interesa cuidar la vida en el planeta, los animales y los recursos naturales?",
    "¿Te gustaría crear ideas para que las personas vivan bien sin dañar el ambiente?"
  ],
  "FÍSICA Y MATEMATICA": [
    "¿Te gusta resolver problemas usando lógica o hacer cálculos para entender cómo funcionan las cosas?",
    "¿Te gustaría descubrir por qué un cohete puede llegar al espacio, cómo la energía del sol llega hasta nosotros para calentar la Tierra, o por qué una pelota de baloncesto siempre cae al suelo?"
  ],
  "MICROSCOPÍA": [
    "¿Te gustaría explorar cosas muy pequeñas que no se ven a simple vista, como células o bacterias?",
    "¿Te interesa saber cómo la tecnología nos permite ver lo invisible y descubrir cosas nuevas?"
  ],
};

function VerificacionVocacional({ datos, onAtras, onFinalizar }) {
  const { cedula, nombres, apellidos, edad, sexo, grado, areaInteres } = datos;
  const mensajes = MENSAJES_AREA[areaInteres] || ["Mensaje 1", "Mensaje 2"];
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState("");

  const handleSeleccion = (mensaje) => setMensajeSeleccionado(mensaje);

  const handleFinalizar = () => {
    onFinalizar({ ...datos, mensajeVocacional: mensajeSeleccionado });
  };

  return (
    <div className="container p-3">
      <h3 className="mb-3 text-center">Verificación vocacional</h3>
      <div className="mb-4">
        <strong>Verifica que tus datos sean correctos:</strong>
        <div className="mt-2">
          <div>{cedula} - {nombres}, {apellidos}</div>
          <div>{edad} - {sexo} - {grado}</div>
        </div>
      </div>
      <div className="mt-4 mb-2 text-center">
        <h5 className="text-center">Área vocacional</h5>
        <div className="fs-3 fw-bold text-primary mb-3 text-center">{areaInteres}</div>
      </div>
      <div className="mb-4">
        <h6>Selecciona el mensaje con el que más te identificas:</h6>
        <div className="d-flex flex-column gap-3 mt-3">
          {mensajes.map((mensaje, idx) => (
            <button
              key={idx}
              type="button"
              className={`btn ${mensajeSeleccionado === mensaje ? "btn-primary" : "btn-outline-primary"} fs-5`}
              onClick={() => handleSeleccion(mensaje)}
            >
              {mensaje}
            </button>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn btn-outline-secondary" onClick={onAtras}>
          Atrás
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleFinalizar}
          disabled={!mensajeSeleccionado}
        >
          Guardar y finalizar
        </button>
      </div>
      {/* Imagen al final */}
      <div className="my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "160px" }}>
        <img
          src="/LogoSemilleroP.png"
          alt="Logo Semillero"
          style={{ maxWidth: "240px", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}

export default VerificacionVocacional;