import { Link } from "react-router";

export default function Inicio() {
  return (
    <main className="pagina-inicio">
      <section className="hero">
        <div className="contenedor">
          <p className="etiqueta-seccion">Tu próxima aventura comienza aquí</p>

          <h1>Descubre el mundo con nuestra agencia de viajes</h1>

          <p>
            Explora destinos increíbles, compara alternativas de vuelos y
            hoteles, y encuentra las mejores opciones para planificar tu próximo
            viaje.
          </p>

          <Link to="/destinos" className="boton-principal">
            Explorar destinos
          </Link>
        </div>
      </section>

      <section className="seccion-beneficios">
        <div className="contenedor">
          <h2>Planifica tu viaje en tres pasos</h2>

          <div className="grid-beneficios">
            <article>
              <h3>1. Elige tu destino</h3>
              <p>
                Descubre lugares, países y actividades que puedes disfrutar.
              </p>
            </article>

            <article>
              <h3>2. Compara vuelos</h3>
              <p>Consulta aerolíneas, fechas, precios y disponibilidad.</p>
            </article>

            <article>
              <h3>3. Encuentra alojamiento</h3>
              <p>
                Revisa hoteles, precios por noche y habitaciones disponibles.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
