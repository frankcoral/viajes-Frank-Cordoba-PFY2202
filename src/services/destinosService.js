import { REST_DESTINOS_URL } from "../config/api";

const TIEMPO_MAXIMO = 10000;

const ESCENARIOS_PRUEBA = new Set(["404", "500", "500-una-vez"]);

function obtenerUrlDestinos() {
  const url = new URL(REST_DESTINOS_URL);
  const escenario = new URLSearchParams(window.location.search).get(
    "escenario",
  );

  if (ESCENARIOS_PRUEBA.has(escenario)) {
    url.searchParams.set("escenario", escenario);
  }

  return url.href;
}

function esDestinoValido(destino) {
  return (
    destino !== null &&
    typeof destino === "object" &&
    ["id", "nombre", "pais", "descripcion"].every(
      (campo) =>
        typeof destino[campo] === "string" && destino[campo].trim().length > 0,
    ) &&
    Array.isArray(destino.actividades) &&
    destino.actividades.every(
      (actividad) =>
        typeof actividad === "string" && actividad.trim().length > 0,
    )
  );
}

export async function obtenerDestinos({ signal } = {}) {
  const timeout = AbortSignal.timeout(TIEMPO_MAXIMO);
  const senal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let respuesta;

  try {
    respuesta = await fetch(obtenerUrlDestinos(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: senal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;

    if (timeout.aborted) {
      throw new Error(
        "La consulta de destinos tardó demasiado. Intenta nuevamente.",
        { cause: error },
      );
    }

    throw new Error("No se pudo conectar con el servicio de destinos.", {
      cause: error,
    });
  }

  if (respuesta.status === 404) {
    throw new Error("No se encontró el servicio de destinos.");
  }

  if (respuesta.status >= 500) {
    throw new Error(
      "El servicio de destinos no está disponible temporalmente.",
    );
  }

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los destinos.");
  }

  let datos;

  try {
    datos = await respuesta.json();
  } catch (error) {
    throw new Error(
      "El servicio de destinos devolvió una respuesta no válida.",
      {
        cause: error,
      },
    );
  }

  if (!Array.isArray(datos) || !datos.every(esDestinoValido)) {
    throw new Error(
      "Los datos recibidos de los destinos tienen un formato incorrecto.",
    );
  }

  return datos;
}
