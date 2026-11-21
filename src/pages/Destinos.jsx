import { Link } from "react-router";
import { useDestinos } from "../hooks/useDestinos";

export default function Destinos() {
  const { destinos, estado, error, reintentar } = useDestinos();

  return (
    <main className="pagina-destinos">
      <div className="contenedor">
        <header className="encabezado-pagina">
          <p className="etiqueta-seccion">Explora el mundo</p>
          <h1>Descubre tu próximo destino</h1>
          <p>
            Encuentra lugares increíbles y consulta las opciones de vuelos y
            hoteles para planificar tu viaje.
          </p>
        </header>

        {estado === "cargando" && (
          <p role="status" aria-live="polite">
            Cargando destinos disponibles...
          </p>
        )}

        {estado === "error" && (
          <div className="mensaje-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={reintentar}>
              Reintentar consulta
            </button>
          </div>
        )}

        {estado === "listo" && destinos.length === 0 && (
          <p>No hay destinos disponibles por el momento.</p>
        )}

        {estado === "listo" && destinos.length > 0 && (
          <>
            <p className="contador-resultados">
              {destinos.length} destinos disponibles
            </p>

            <section
              className="grid-destinos"
              aria-label="Destinos disponibles"
            >
              {destinos.map((destino) => (
                <article className="tarjeta-destino" key={destino.id}>
                  <div className="tarjeta-contenido">
                    <p className="pais-destino">{destino.pais}</p>
                    <h2>{destino.nombre}</h2>
                    <p>{destino.descripcion}</p>

                    <h3>Actividades populares</h3>
                    <ul>
                      {destino.actividades.map((actividad) => (
                        <li key={actividad}>{actividad}</li>
                      ))}
                    </ul>

                    <Link
                      className="enlace-destino"
                      to={`/destinos/${destino.id}`}
                    >
                      Ver vuelos y hoteles
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
