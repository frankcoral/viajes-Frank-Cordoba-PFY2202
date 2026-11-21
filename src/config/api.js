const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);

export const REST_DESTINOS_URL = new URL("api/destinos", baseUrl).href;

export const GRAPHQL_URL = new URL("graphql", baseUrl).href;
