import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./services/apolloClient";
import App from "./App.jsx";
import "./index.css";

async function iniciarAplicacion() {
  const raiz = document.getElementById("root");

  try {
    const { worker } = await import("./mocks/browser");

    await worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
      onUnhandledRequest: "warn",
    });

    createRoot(raiz).render(
      <StrictMode>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("Error al iniciar los servicios simulados:", error);
    raiz.textContent =
      "No se pudieron iniciar los servicios de viajes. Recarga la página.";
  }
}

iniciarAplicacion();
