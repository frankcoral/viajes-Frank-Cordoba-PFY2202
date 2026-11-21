import { Link } from "react-router";

export default function NoEncontrado() {
  return (
    <main className="pagina-no-encontrada">
      <div className="contenedor">
        <p className="etiqueta-seccion">Error 404</p>

        <h1>Esta ruta no está disponible</h1>

        <p>
          La página que buscas no existe o su dirección no es correcta. Puedes
          volver al inicio o explorar nuestros destinos.
        </p>

        <div className="acciones-no-encontrado">
          <Link to="/" className="boton-principal">
            Volver al inicio
          </Link>

          <Link to="/destinos" className="boton-secundario">
            Explorar destinos
          </Link>
        </div>
      </div>
    </main>
  );
}
