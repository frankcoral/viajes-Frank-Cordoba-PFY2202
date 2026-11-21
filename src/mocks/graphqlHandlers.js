import { graphql, HttpResponse } from "msw";
import { GRAPHQL_URL } from "../config/api";
import { destinos } from "./data/destinos";
import { vuelos } from "./data/vuelos";
import { hoteles } from "./data/hoteles";

const apiGraphql = graphql.link(GRAPHQL_URL);

export const graphqlHandlers = [
  apiGraphql.query("ObtenerOpcionesViaje", ({ variables }) => {
    const destinoId = variables?.destinoId;

    if (
      typeof destinoId !== "string" ||
      !destinos.some((destino) => destino.id === destinoId)
    ) {
      return HttpResponse.json({
        errors: [{ message: "El destino seleccionado no es válido." }],
      });
    }

    return HttpResponse.json({
      data: {
        vuelos: vuelos.filter((vuelo) => vuelo.destinoId === destinoId),
        hoteles: hoteles.filter((hotel) => hotel.destinoId === destinoId),
      },
    });
  }),
];
