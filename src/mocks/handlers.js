import { http, HttpResponse } from "msw";
import { REST_DESTINOS_URL } from "../config/api";
import { destinos } from "./data/destinos";
import { graphqlHandlers } from "./graphqlHandlers";

let errorTemporalPendiente = true;

export const handlers = [
  http.get(REST_DESTINOS_URL, ({ request }) => {
    const escenario = new URL(request.url).searchParams.get("escenario");

    if (escenario === "404") {
      return new HttpResponse(null, { status: 404 });
    }

    if (escenario === "500") {
      return new HttpResponse(null, { status: 500 });
    }

    if (escenario === "500-una-vez" && errorTemporalPendiente) {
      errorTemporalPendiente = false;
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(destinos);
  }),

  ...graphqlHandlers,
];
