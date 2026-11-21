import { useEffect, useState } from "react";
import { obtenerDestinos } from "../services/destinosService";

const DURACION_CACHE = 5 * 60 * 1000;

let cacheDestinos = null;
let ultimaActualizacion = 0;
let peticionPendiente = null;

function cargarDestinos(actualizar = false) {
  const cacheVigente =
    cacheDestinos !== null && Date.now() - ultimaActualizacion < DURACION_CACHE;

  if (!actualizar && cacheVigente) {
    return Promise.resolve(cacheDestinos);
  }

  if (peticionPendiente) {
    return peticionPendiente;
  }

  const tarea = obtenerDestinos()
    .then((datos) => {
      if (peticionPendiente === tarea) {
        cacheDestinos = datos;
        ultimaActualizacion = Date.now();
      }

      return datos;
    })
    .finally(() => {
      if (peticionPendiente === tarea) {
        peticionPendiente = null;
      }
    });

  peticionPendiente = tarea;
  return tarea;
}

export function useDestinos() {
  const [destinos, setDestinos] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    async function cargar() {
      setEstado("cargando");
      setError(null);

      try {
        const datos = await cargarDestinos(intento > 0);

        if (!vigente) return;

        setDestinos(datos);
        setEstado("listo");
      } catch (errorConsulta) {
        if (!vigente) return;

        setError(errorConsulta.message);
        setEstado("error");
      }
    }

    cargar();

    return () => {
      vigente = false;
    };
  }, [intento]);

  function reintentar() {
    setIntento((anterior) => anterior + 1);
  }

  return { destinos, estado, error, reintentar };
}
