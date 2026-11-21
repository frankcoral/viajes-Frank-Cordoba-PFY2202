import { HashRouter, NavLink, Route, Routes } from "react-router";
import Inicio from "./pages/Inicio";
import Destinos from "./pages/Destinos";
import OpcionesViaje from "./pages/OpcionesViaje";
import NoEncontrado from "./pages/NoEncontrado";

function claseNavegacion({ isActive }) {
  return isActive ? "enlace-nav activo" : "enlace-nav";
}

export default function App() {
  return (
    <HashRouter>
      <header className="cabecera">
        <div className="contenedor cabecera-contenido">
          <NavLink to="/" className="marca">
            Horizonte Viajes
          </NavLink>

          <nav className="navegacion" aria-label="Navegación principal">
            <NavLink to="/" end className={claseNavegacion}>
              Inicio
            </NavLink>

            <NavLink to="/destinos" className={claseNavegacion}>
              Destinos
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/destinos/:destinoId" element={<OpcionesViaje />} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>

      <footer className="pie-pagina">
        <div className="contenedor">
          <p>Horizonte Viajes — Explora, compara y planifica.</p>
        </div>
      </footer>
    </HashRouter>
  );
}
