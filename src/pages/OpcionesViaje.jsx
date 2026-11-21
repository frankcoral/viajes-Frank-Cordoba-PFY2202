import { Link, useParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import { OBTENER_OPCIONES_VIAJE } from "../graphql/consultas";
import { useDestinos } from "../hooks/useDestinos";

const formatoPrecio = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export default function OpcionesViaje() {
  const { destinoId } = useParams();
  const { destinos } = useDestinos();

  const destino = destinos.find((item) => item.id === destinoId);

  const { data, loading, error, refetch } = useQuery(OBTENER_OPCIONES_VIAJE, {
    variables: { destinoId },
    notifyOnNetworkStatusChange: true,
  });

  const vuelos = data?.vuelos ?? [];
  const hoteles = data?.hoteles ?? [];

  return (
    <main className="pagina-opciones">
      <div className="contenedor">
        <Link to="/destinos" className="enlace-volver">
          ← Volver a destinos
        </Link>

        <header className="encabezado-pagina">
          <p className="etiqueta-seccion">Planifica tu viaje</p>
          <h1>{destino ? `Viaja a ${destino.nombre}` : "Opciones de viaje"}</h1>
          <p>
            Compara vuelos y alojamientos disponibles para el destino
            seleccionado.
          </p>
        </header>

        {destinoId === "dest-1" && (
          <p className="contador-resultados">
            Los vuelos llegan al Aeropuerto El Loa de Calama. Desde allí debes
            continuar por carretera hasta San Pedro de Atacama (aproximadamente
            100 km). El traslado terrestre no está incluido.
          </p>
        )}

        {loading && (
          <p role="status" aria-live="polite">
            Consultando vuelos y hoteles disponibles...
          </p>
        )}

        {error && !loading && (
          <div className="mensaje-error" role="alert">
            <p>
              {error.message === "El destino seleccionado no es válido."
                ? error.message
                : "No pudimos consultar las opciones de viaje. Intenta nuevamente."}
            </p>

            {error.message === "El destino seleccionado no es válido." ? (
              <Link to="/destinos" className="boton-secundario">
                Elegir otro destino
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void refetch().catch(() => {})}
              >
                Reintentar consulta
              </button>
            )}
          </div>
        )}

        {!loading && !error && data && (
          <>
            <section aria-labelledby="titulo-vuelos">
              <h2 id="titulo-vuelos">Vuelos disponibles</h2>

              {vuelos.length === 0 ? (
                <p>No hay vuelos para este destino.</p>
              ) : (
                <div className="grid-opciones">
                  {vuelos.map((vuelo) => (
                    <article className="tarjeta-opcion" key={vuelo.id}>
                      <h3>{vuelo.aerolinea}</h3>
                      <p>
                        {vuelo.origen} → {vuelo.llegada}
                      </p>
                      <p>Salida: {formatearFecha(vuelo.fechaSalida)}</p>
                      <p className="precio">
                        {formatoPrecio.format(vuelo.precio)}
                      </p>
                      <p>
                        {vuelo.cuposDisponibles > 0
                          ? `${vuelo.cuposDisponibles} cupos disponibles`
                          : "Vuelo agotado"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="titulo-hoteles">
              <h2 id="titulo-hoteles">Hoteles disponibles</h2>

              {hoteles.length === 0 ? (
                <p>No hay hoteles para este destino.</p>
              ) : (
                <div className="grid-opciones">
                  {hoteles.map((hotel) => (
                    <article className="tarjeta-opcion" key={hotel.id}>
                      <h3>{hotel.nombre}</h3>
                      <p>{hotel.ubicacion}</p>
                      <p>Entrada: {hotel.fechaEntrada}</p>
                      <p>Salida: {hotel.fechaSalida}</p>
                      <p className="precio">
                        {formatoPrecio.format(hotel.precioPorNoche)} por noche
                      </p>
                      <p>
                        {hotel.habitacionesDisponibles > 0
                          ? `${hotel.habitacionesDisponibles} habitaciones disponibles`
                          : "Hotel sin disponibilidad"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
