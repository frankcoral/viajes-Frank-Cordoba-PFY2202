# Horizonte Viajes — Explorador de destinos, vuelos y hoteles

**Desarrollo Frontend II (PFY2202) · Semana 5 · Duoc UC**  
**Evaluación sumativa 2:** Integrando nuestro frontend con backend  
**Caso asignado:** Agencia de viajes · Forma B

## 1. Descripción del proyecto

**Horizonte Viajes** es una aplicación web desarrollada con **React, JavaScript, HTML y CSS**, orientada a explorar destinos turísticos y consultar alternativas de vuelos y alojamiento desde una misma interfaz.

El recorrido comienza con un catálogo de destinos obtenido mediante una **API REST simulada**. Al elegir uno, la aplicación realiza una **consulta GraphQL** que recupera exclusivamente los vuelos y hoteles asociados a su identificador. De esta manera, los datos presentados se mantienen consistentes con la selección del usuario sin necesidad de recargar la página.

La solución integra **React Router**, **Apollo Client** y **Mock Service Worker (MSW)**, con separación entre vistas, acceso a datos, estado y servicios simulados. Incluye manejo de errores, reintentos, validación de respuestas, optimización de consultas y una interfaz adaptable a escritorio y dispositivos móviles.

> **Alcance:** los destinos, vuelos, alojamientos, precios, fechas y disponibilidades corresponden a datos de demostración. La aplicación permite explorar y comparar alternativas; no emite pasajes, confirma reservas ni procesa pagos.

## 2. Funcionalidades implementadas

| Módulo | Funcionalidad |
| --- | --- |
| **Inicio** | Presentación de la agencia y acceso directo al catálogo de destinos. |
| **Destinos** | Listado dinámico de seis destinos, con país, descripción y actividades populares obtenidos desde REST. |
| **Opciones de viaje** | Consulta de vuelos y hoteles vinculados al destino elegido, mediante GraphQL. |
| **Vuelos** | Aerolínea, origen, llegada, fecha de salida, precio en CLP y cantidad de cupos. |
| **Hoteles** | Nombre, ubicación, fechas de entrada y salida, tarifa por noche y habitaciones disponibles. |
| **Disponibilidad** | Mensajes diferenciados para vuelos agotados y alojamientos sin habitaciones. |
| **Navegación** | Menú activo, rutas por identificador de destino, regreso al catálogo y página 404. |
| **Recuperación** | Indicadores de carga, mensajes de error comprensibles y acciones de reintento. |
| **Adaptabilidad** | Tarjetas organizadas en varias columnas en escritorio y en una columna en móvil. |

### Destinos incluidos

| Destino | País | Ejemplos de actividades |
| --- | --- | --- |
| San Pedro de Atacama | Chile | Valle de la Luna, Géiseres del Tatio y observación astronómica |
| Buenos Aires | Argentina | Caminito, Teatro Colón y Puerto Madero |
| Río de Janeiro | Brasil | Cristo Redentor, Pan de Azúcar y Copacabana |
| Cusco | Perú | Machu Picchu, Valle Sagrado y Plaza de Armas |
| París | Francia | Torre Eiffel, Museo del Louvre y Montmartre |
| Tokio | Japón | Templo Sensō-ji, Shibuya y Torre de Tokio |

Cada destino cuenta con **dos vuelos y dos hoteles** en los datos de ejemplo. Los registros se relacionan mediante `destinoId`, no por la posición que ocupan en una lista.

**Consideración de viaje:** para San Pedro de Atacama, las opciones aéreas llegan a **Calama (Aeropuerto El Loa)**. La interfaz informa que el recorrido continúa por carretera y que el traslado terrestre no está incluido.

## 3. Tecnologías y responsabilidades

| Tecnología | Uso dentro de Horizonte Viajes |
| --- | --- |
| **React 19 + JSX** | Construcción de la interfaz mediante componentes y páginas. |
| **Vite 8** | Servidor de desarrollo, compilación y vista previa de producción. |
| **React Router 8** | Navegación mediante `HashRouter`, rutas dinámicas y ruta no encontrada. |
| **JavaScript (ES Modules)** | Lógica de componentes, servicios y validaciones. |
| **CSS** | Identidad visual, diseño responsive y estados de interacción. |
| **MSW 2** | Interceptación de peticiones y simulación de REST y GraphQL en el navegador. |
| **Apollo Client 4** | Consultas GraphQL, caché y estado de carga/error de las opciones de viaje. |
| **GraphQL** | Consulta parametrizada de vuelos y hoteles por destino. |
| **RxJS** | Dependencia utilizada por Apollo Client. |
| **ESLint** | Análisis estático del código fuente. |

La información de acceso a datos **no está escrita directamente en los componentes de presentación**: las páginas consumen servicios y hooks, mientras MSW administra las respuestas simuladas.

## 4. Estructura del proyecto

```text
viajes/
├── public/
│   ├── brujula.svg                  # Identidad visual de la pestaña
│   └── mockServiceWorker.js        # Worker generado por MSW
├── src/
│   ├── config/
│   │   └── api.js                  # Direcciones de las APIs según BASE_URL
│   ├── graphql/
│   │   └── consultas.js            # Consulta ObtenerOpcionesViaje
│   ├── hooks/
│   │   └── useDestinos.js          # Carga REST, estados, caché y reintento
│   ├── mocks/
│   │   ├── data/
│   │   │   ├── destinos.js
│   │   │   ├── vuelos.js
│   │   │   └── hoteles.js
│   │   ├── browser.js              # Inicialización de setupWorker
│   │   ├── graphqlHandlers.js      # Respuestas GraphQL por destinoId
│   │   └── handlers.js             # Respuestas REST y escenarios de prueba
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── Destinos.jsx
│   │   ├── OpcionesViaje.jsx
│   │   └── NoEncontrado.jsx
│   ├── services/
│   │   ├── apolloClient.js         # Cliente y caché GraphQL
│   │   └── destinosService.js      # Fetch REST y validación de datos
│   ├── App.jsx                     # Cabecera, menú, rutas y pie de página
│   ├── index.css                   # Estilos generales y responsive
│   └── main.jsx                    # Arranque de MSW y ApolloProvider
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

*El árbol identifica los archivos centrales de la implementación. Las dependencias instaladas y los resultados generados de compilación quedan fuera de esta vista.*

### Flujo de integración

```text
Usuario
  │
  ├─ Abre Destinos
  │    └─ Destinos.jsx → useDestinos → destinosService
  │                              → GET api/destinos → MSW → destinos.js
  │
  └─ Selecciona un destino (destinoId)
       └─ OpcionesViaje.jsx → Apollo Client → POST graphql
                                       → MSW → graphqlHandlers.js
                                       → vuelos.js + hoteles.js
                                       → alternativas del destino elegido
```

`main.jsx` **espera `worker.start()` antes de renderizar React**. Esto evita que la primera solicitud se ejecute antes de que MSW pueda interceptarla. `ApolloProvider` pone el cliente GraphQL a disposición de los componentes.

## 5. Integración de servicios

### REST — Catálogo de destinos

**Operación:** `GET api/destinos`  
**Origen:** `src/mocks/data/destinos.js`  
**Consumo:** `obtenerDestinos()` desde `useDestinos()`

Cada destino incluye:

```javascript
{
  id: "dest-1",
  nombre: "San Pedro de Atacama",
  pais: "Chile",
  descripcion: "Paisajes desérticos, cielos estrellados y experiencias únicas.",
  actividades: ["Valle de la Luna", "Géiseres del Tatio", "Observación astronómica"]
}
```

El servicio comprueba que la respuesta sea un arreglo y que cada destino tenga identificador, nombre, país, descripción y actividades de los tipos esperados.

### GraphQL — Vuelos y hoteles

**Operación:** `POST graphql`  
**Consulta:** `ObtenerOpcionesViaje($destinoId: ID!)`  
**Consumo:** `useQuery()` de Apollo Client en `OpcionesViaje.jsx`

```graphql
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
```

El manejador GraphQL comprueba que `destinoId` exista en el catálogo y filtra ambos conjuntos de datos por ese identificador. Una selección inválida produce un error comprensible y ofrece regresar a los destinos.

### Decisiones de implementación

- **URL consistente:** `src/config/api.js` construye ambas rutas desde `import.meta.env.BASE_URL`, para utilizar la subruta configurada por Vite.
- **Navegación:** `HashRouter` conserva la navegación interna al actualizar o abrir una ruta directamente en alojamiento estático.
- **Caché REST:** los datos válidos se reutilizan durante **5 minutos**; una solicitud pendiente se comparte para evitar duplicados simultáneos. El reintento solicita una respuesta nueva.
- **Control de solicitudes:** se impide que un efecto desmontado actualice una vista antigua, y el servicio REST dispone de un límite de **10 segundos** para la petición.
- **GraphQL:** Apollo Client administra la caché y el estado de la consulta, que depende del identificador seleccionado.
- **Formato local:** los precios se presentan en pesos chilenos (`es-CL`, `CLP`).
- **Disponibilidad de mocks:** MSW se inicia también en la compilación estática, porque no existe un backend externo para esta demostración.

## 6. Requisitos y puesta en marcha

**Requisitos:** Node.js compatible con Vite 8, npm y un editor de código. El proyecto se trabajó en Windows con PowerShell.

Desde la carpeta `viajes`, donde se encuentra `package.json`:

**Instalar dependencias:**

```powershell
npm.cmd install
```

**Iniciar el entorno de desarrollo:**

```powershell
npm.cmd run dev
```

**Verificar calidad y generar producción:**

```powershell
npm.cmd run lint
npm.cmd run build
```

**Ejecutar la versión compilada:**

```powershell
npm.cmd run preview
```

En PowerShell se utiliza `npm.cmd` para ejecutar los comandos directamente. La compilación genera `dist/`; esta carpeta y `node_modules/` no se incorporan al código fuente versionado.

El archivo `public/mockServiceWorker.js` ya forma parte del proyecto: no es necesario regenerarlo para iniciar la aplicación normalmente.

## 7. Uso de la aplicación

1. Abre **Inicio** y selecciona **Explorar destinos**.
2. Revisa los seis destinos, sus países y actividades populares.
3. En una tarjeta, pulsa **Ver vuelos y hoteles**.
4. Compara tarifas, fechas y disponibilidad de las alternativas asociadas al destino.
5. Usa **Volver a destinos** para seleccionar otro lugar.
6. Si surge un error de consulta, utiliza la opción de recuperación que ofrece la pantalla.

### Rutas internas

| Ruta | Vista |
| --- | --- |
| `#/` | Inicio |
| `#/destinos` | Catálogo de destinos |
| `#/destinos/:destinoId` | Vuelos y hoteles para el destino elegido |
| Ruta no definida | Página 404 con opciones para continuar navegando |

## 8. Escenarios de error y recuperación

El servicio REST contempla mensajes diferenciados para problemas de conexión, HTTP 404, HTTP 5xx, respuesta JSON inválida y estructura de destinos incorrecta.

Para reproducir los escenarios controlados, agrega el parámetro **antes del fragmento `#`** de la ruta:

| Parámetro de prueba | Respuesta simulada | Comportamiento esperado |
| --- | --- | --- |
| Sin parámetro | HTTP 200 | Se muestran seis destinos. |
| `?escenario=404` | HTTP 404 | Se informa que no se encontró el servicio. |
| `?escenario=500` | HTTP 500 | Se informa indisponibilidad temporal. |
| `?escenario=500-una-vez` | Primero 500, después 200 | El usuario puede reintentar y recuperar el listado sin recargar. |

El escenario `500-una-vez` utiliza un indicador en memoria: una vez consumido el primer fallo en esa ejecución, las siguientes solicitudes del escenario responden con éxito.

Los errores GraphQL se manejan por separado: si el identificador del destino no es válido, la aplicación ofrece **Elegir otro destino**; ante otros fallos, ofrece **Reintentar consulta**.

## 9. Pruebas y resultados

Las siguientes comprobaciones se realizaron manualmente durante el desarrollo y sobre la compilación local:

| Caso de prueba | Resultado observado |
| --- | --- |
| Carga inicial de destinos desde REST | Seis destinos, HTTP 200, respuesta de Service Worker. |
| Consulta GraphQL para San Pedro de Atacama | Dos vuelos y dos hoteles correspondientes a `dest-1`, HTTP 200. |
| Cambio a Buenos Aires | Se muestran alternativas de `dest-2`, sin mezclar datos del destino anterior. |
| Consulta de Río de Janeiro | Vuelos y hoteles asociados a `dest-3`, HTTP 200. |
| Ruta con `destinoId` inexistente | Se muestra error de destino inválido y opción para regresar al catálogo. |
| REST con HTTP 404 | Mensaje de servicio no encontrado y finalización del estado de carga. |
| REST con HTTP 500 | Mensaje de indisponibilidad temporal y botón de reintento. |
| REST con error temporal | Primera petición 500; segunda 200 después de reintentar. |
| Regreso repetido al catálogo | Una petición REST durante la vigencia de la caché en la prueba realizada. |
| Ruta inexistente | Página 404; recuperación hacia el catálogo de destinos. |
| Vista móvil (393 × 852 px) | Tarjetas en una columna, navegación y contenidos legibles. |
| Google Chrome | Navegación, REST y GraphQL verificados. |
| Microsoft Edge | Navegación, REST y GraphQL verificados. |
| Brave | Navegación, REST y GraphQL verificados. |
| ESLint | Ejecución sin errores ni advertencias. |
| Compilación de producción | Compilación exitosa con Vite 8. |
| Vista previa de producción | Inicio, REST, GraphQL y diseño móvil verificados. |

**Compatibilidad:** las pruebas registradas abarcan **Chrome, Edge y Brave**. Los tres se basan en Chromium.

**Nota de compilación:** Vite puede mostrar una advertencia de tamaño para el fragmento de MSW. La configuración mantiene la compilación predeterminada, comprobada mediante `preview`; la advertencia no bloquea la generación de `dist/`.

## 10. Relación con los criterios de la evaluación

| Criterio | Implementación verificable |
| --- | --- |
| Interfaz y diseño responsive | Inicio, catálogo, detalle de viaje, CSS adaptable y tarjetas en móvil. |
| API REST mock | `handlers.js`, `destinosService.js` y listado dinámico de destinos. |
| API GraphQL mock | `graphqlHandlers.js`, consulta parametrizada y vuelos/hoteles por `destinoId`. |
| React Router | `HashRouter`, menú activo, ruta dinámica y página 404. |
| Modularidad y reutilización | Separación de páginas, servicios, datos, configuración, hooks y mocks. |
| Manejo de estado | `useState`, `useEffect`, `useQuery`, carga, errores y reintentos. |
| Documentación y publicación | Instrucciones de ejecución, compilación y preparación del despliegue estático. |
| Compatibilidad | Pruebas registradas en Chrome, Edge y Brave; adaptación móvil. |

Esta correspondencia describe las funcionalidades implementadas y verificadas; no representa una calificación asignada.

## 11. Preparación de la publicación

La configuración de Vite incluye la ruta base del proyecto y genera una compilación estática. La navegación utiliza `HashRouter` y las APIs simuladas permanecen disponibles mediante el Service Worker.

Para preparar los archivos de publicación:

```powershell
npm.cmd run lint
npm.cmd run build
```

Para desplegar el contenido compilado mediante la herramienta utilizada en el curso:

```powershell
npx.cmd --yes gh-pages -d dist
```

Tras publicar, se debe comprobar la carga inicial, el catálogo, las consultas REST/GraphQL, la selección de destinos, el favicon y la navegación directa a vistas internas.

## 12. Alcance y limitaciones

- La información corresponde a **servicios simulados**, no a tarifas o inventarios vigentes de aerolíneas y hoteles.
- Los precios se muestran en **pesos chilenos** y las fechas de los registros de ejemplo corresponden a **enero de 2027**.
- No se implementan pagos, emisión de pasajes ni reservas reales.
- La caché REST permanece en memoria durante la sesión; no utiliza almacenamiento persistente.
- La cobertura de navegadores documentada corresponde exclusivamente a los entornos probados.

---

**Horizonte Viajes · Desarrollo Frontend II · PFY2202 · Semana 5**
