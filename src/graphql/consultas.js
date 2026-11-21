import { gql } from "@apollo/client";

export const OBTENER_OPCIONES_VIAJE = gql`
  query ObtenerOpcionesViaje($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      id
      destinoId
      aerolinea
      origen
      llegada
      fechaSalida
      precio
      cuposDisponibles
    }
    hoteles(destinoId: $destinoId) {
      id
      destinoId
      nombre
      ubicacion
      fechaEntrada
      fechaSalida
      precioPorNoche
      habitacionesDisponibles
    }
  }
`;
