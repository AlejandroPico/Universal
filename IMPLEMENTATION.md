# Ampliación aprobada · estado de entregas

Solicitud: principales 1–18 y secundarias 21, 22, 23, 25, 26, 29, 31. No requiere nueva autorización. Mantener distancias físicas, datos observados separados de modelos y cargas progresivas. Publicar entregas funcionales en main, con versión, README y Acerca de actualizados.

## Publicado en 1.2.0

- Contención y desplazamiento del árbol dentro de su ventana.
- Retirado botón de cuerdas cósmicas de Capas, manteniendo su artículo.
- Retiradas referencias públicas de inspiración en videojuegos.

## Entrega 1.2.1

- 1: intervalos de trayectorias reales para las 13 sondas de Horizons, 60 días y control de tramo. No cubre la historia completa de cada misión.
- 14: primera herramienta de separación, tamaños y tiempo luz A/B. Falta una regla dibujada sobre la escena.
- 21: tres recorridos guiados con paradas.
- 22: comparación de propiedades de dos objetos.
- 26: calidad de render automática o manual; no desaparecen objetos por el ajuste.
- 29: captura PNG con contexto y créditos.
- 31: prioridad de etiquetas de foco/selección. Queda ampliar el control de densidad.

## Pendiente de implementación

- 2 órbitas naturales con efemérides y baricentros.
- 3 sistemas de exoplanetas.
- 4 comparador de observaciones alineadas.
- 5 fotografías progresivas por teselas.
- 6 más galaxias con orientación individual.
- 7 cúmulos con pertenencia observada.
- 8 movimientos estelares y dirección del Sol.
- 9 púlsares / estrellas de neutrones.
- 10 remanentes de supernovas.
- 11 nubes moleculares / formación estelar.
- 12 agujeros negros: imágenes EHT y recreación 3D con lente, sin inventar orientación observada.
- 13 tiempos cosmológicos de viaje de la luz.
- 15 observador terrestre.
- 16 pases / sombra / trayectoria terrestre de ISS.
- 17 cronología basada en acontecimientos, sin afirmar recreaciones históricas sin datos.
- 18 representación de incertidumbres.
- 23 galerías verificadas de familias de satélites.
- 25 búsqueda avanzada por coordenadas, tipos y distancias.
- Navegación por la Vía Láctea a escala física y detalle de sectores; no fingir que la población modelada es un censo observado.

Validación de 1.2.1: 53 pruebas automatizadas. Revisar también compilación y despliegue antes de cerrar entrega. El navegador de la sesión anterior carecía de WebGL, por lo que no hubo inspección visual 3D.

## Entrega 1.2.2

Enciclopedia: corregido el doble marco; pantalla completa con cierre visible y áreas seguras móviles. La ampliación científica sigue pendiente: el mantenimiento de la sesión eliminó los cambios locales no publicados y se reconstruirán a partir del contexto.


## Rescate publicado 1.3.0

Se recuperaron los fuentes de la compilación y los catálogos después de perder el directorio de trabajo durante la subida. No se publicó el intento anterior. Recuperados: 3, 7 parcialmente (centros de cúmulos abiertos Gaia DR2; miembros individuales pendientes), 9, 10 (edición histórica y tres distancias), 11 (líneas de visión), 13, 15, 16, 17 (eventos de superficie), 25 y parte de 2 (efemérides lunares acotadas). La actualización lunar automática y scripts de descarga originales no sobrevivieron y quedan pendientes. Las efemérides lunares se conservan en partes verificadas por SHA-256. El archivo de miembros de cúmulos está incompleto y no se activa.

Pendiente: 4, 5, 6, completar 7 (miembros individuales), 8, 12, 18, 23; completar 2, regla dibujada 14, densidad de etiquetas 31 y mayor detalle de navegación galáctica. No considerar terminadas todas las mejoras aprobadas. Este rescate prioriza conservar el avance funcional según la petición urgente del usuario.

## Entrega 1.3.1

Acerca de breve sin historial de versiones. Enciclopedia móvil con artículo a altura completa e índice independiente, conservando el diseño de escritorio.

## Entrega 1.4.0 · punto 12

Implementado 12: Sagitario A* y M87* buscables/localizables, observaciones EHT atribuidas y recreación tridimensional separada con lente Schwarzschild, giro, inclinación, ampliación, comparación sin lente y escala física. La orientación del modelo es ilustrativa. No simula espín ni ajusta plasma/emisión a EHT.

### Pendientes vigentes después de 1.4.0

- 2: completar órbitas naturales, baricentros y actualización lunar automática.
- 4: comparación de observaciones alineadas.
- 5: fotografías progresivas por teselas.
- 6: ampliar galaxias con orientación individual.
- 7: recuperar miembros individuales de cúmulos.
- 8: movimientos estelares y dirección del Sol.
- 14: regla dibujada sobre la escena.
- 18: representación de incertidumbres.
- 23: galerías verificadas de familias de satélites.
- 31: densidad de etiquetas.
- Navegación galáctica con más detalle y recuperación de scripts originales de descarga.

## Entrega 1.4.1 · Punto 14: regla visual

Completado 14. Explorar y comparar → guardar A y B → Dibujar regla A–B. Proyección sobre la pantalla, extremos y separación espacial actualizados con la cámara y la fecha; tiempo de luz sin expansión. Quitar regla elimina la superposición. Si falta una posición válida se indica, sin dibujar extremos falsos.

## Entrega 1.5.0 · Punto 8: movimientos estelares

Completado 8. Velocidades HYG v4.1 recuperadas con SHA-256 y proyección lineal opcional mediante el reloj (±10.000 años desde J2000), conservando coordenadas base. Puntos, selección y distancias comparten las posiciones proyectadas. Dirección del movimiento peculiar solar respecto al LSR según Schönrich et al. 2010, con flecha de longitud ilustrativa. Se explicitan las limitaciones de velocidades radiales del catálogo y la ausencia de integración gravitatoria. Datos HYG: David Nash, CC BY-SA 4.0.

## Entrega 1.5.1 · Punto 7: miembros observados de cúmulos

Restauración del catálogo de pertenencia Gaia DR2 mediante descarga reproducible de VizieR y validación del número de filas, identificadores y coordenadas. Al enfocar un cúmulo aparecen sus miembros con probabilidad ≥0,8; se conservan sus posiciones angulares y la distancia común publicada, sin inventar profundidad individual. Los puntos se ocultan al abandonar el cúmulo.

## Entrega 1.6.0 · Punto 2: efemérides naturales y baricentros

Vectores NASA/JPL Horizons para los ocho planetas, Plutón, 21 lunas y siete baricentros; interpolación de posiciones y trazado orbital coherente dentro del intervalo disponible. Panel Órbitas y baricentros con localización y estado temporal. Actualización automática cada ocho horas, conservación de datos anteriores ante fallos y publicación explícita de las actualizaciones programadas. Los planetas cubren 380 días y las lunas 14; fuera del intervalo los cuerpos usan aproximaciones y los baricentros no se extrapolan. Los cuerpos menores restantes conservan su modelo analítico.

### Pendientes vigentes después de esta entrega

- 4: comparación de observaciones alineadas.
- 5: fotografías progresivas por teselas.
- 6: más galaxias con orientación individual.
- 18: representación de incertidumbres.
- 23: galerías verificadas de familias de satélites.
- 31: densidad de etiquetas.
- Navegación galáctica con mayor detalle y recuperación de otros scripts originales de descarga.

Límites de esta entrega: movimientos estelares lineales, profundidad común en cúmulos y ventanas temporales acotadas de efemérides. No son un ajuste dinámico de la galaxia ni profundidades individuales observadas.

## Entrega 1.6.1 · Verificación de las cuatro mejoras

Confirmados en el despliegue: 156.351 miembros observados de 1.224 cúmulos y las 37 efemérides naturales descargadas de NASA/JPL. Corregidos los saltos estelares de mil años para pausar el reloj y conservar la vista, y la referencia fotométrica usada al seleccionar estrellas desplazadas. Añadidas pruebas de transformación de velocidades, reversibilidad y límites temporales, lectura de PMemb y conservación de identificadores Gaia de 64 bits. Los baricentros se clasifican en Sistema Solar dentro de la enciclopedia.

## Entrega 1.6.2 · Órbitas completas y herramientas visibles

Corregidos los arcos planetarios/lunares recortados: la vista inicial vuelve a dibujar órbitas completas aproximadas, manteniendo las posiciones JPL y un selector explícito para sus tramos temporales. Al seleccionar el Sol aparece la dirección de giro galáctico y un acceso a su órbita circular aproximada, que se encuadra automáticamente. La regla tiene botón propio en la barra superior, ejemplo Sol–Tierra, Marcar A/B en cada ficha y encuadre automático con controles de reencuadre y cierre. La guía solar no es una integración dinámica; dirección +Y según Bovy: https://galaxiesbook.org/chapters/A.-Coordinate-systems_2-Positions-in-the-Milky-Way.html .

## Entrega 1.6.3 · Instalación Android y Acerca de

Manifiesto estable en la raíz publicada, identidad y alcance propios, iconos PNG de 192/512 px y modo standalone. Registro de service worker con pantalla sin conexión y botón de instalación cuando el navegador lo permite. Los catálogos siguen requiriendo conexión. Acerca de conserva únicamente Portfolio y Repositorio en una fila equilibrada.

## Entrega 1.7.0 · Agujeros negros en la escena y brillo galáctico

Sagitario A* y M87* muestran un modelo cercano interactivo al enfocarlos: sombra, disco animado ilustrativo y geodésicas Schwarzschild en GPU que desvían la vista del fondo. Giro y zoom desde los controles habituales, escala de Schwarzschild y límite exterior al horizonte. Accesos por nombre en Capas. No incluye espín ni ajuste de emisión a EHT. Control independiente de brillo de la población galáctica modelada, incluyendo sectores próximos al centro; la magnitud del catálogo local mantiene su propio control.

## Entrega 1.7.1 · Lente sin disco e intensidad de puntos coloreados

Retirado el disco ilustrativo de la vista cercana. La lente usa una captura cúbica del mismo universo del visor, sin estrellas de fondo alternativas, y se desvanece progresivamente al alejarse. La intensidad galáctica actúa sobre cada punto y su tamaño aparente conservando las proporciones RGB, sin multiplicar el resplandor difuso. Control independiente para catálogos, flujos de Laniakea y densidad de supercúmulos.

## Entrega 1.7.2 · Órbita solar discreta y cobertura estelar

Eliminado el panel solar flotante. Órbita activa al seleccionar el Sol, con visibilidad y encuadre en Capas, y acceso exclusivo desde su ficha. Punta de flecha pequeña de longitud física fija que disminuye al alejarse. Corregido el estilo que anulaba hidden en los botones. Población modelada de la Vía Láctea ampliada a 1,5 millones de puntos, más presencia entre brazos y detalle cercano extendido a 340 años luz alrededor del observador. Nuevo control independiente para galaxias DESI DR1, SDSS y 2MRS; flujos y densidad conservan el suyo. La ampliación es estadística, no un nuevo censo observado.

## Alcance final acordado · septiembre de 2026

Esta decisión sustituye las listas históricas de pendientes: terminar estética de Capas, filtros contextuales, representación y navegación galáctica con intensidad coloreada coherente, punto 6 (orientaciones individuales) y punto 23 (galerías verificadas de familias). Los antiguos puntos 4, 5, 18 y 31 quedan fuera del alcance por decisión del usuario, no completados.

La captura del usuario muestra una concentración de estrellas visibles hacia el Sol y un disco galáctico tenue. Diagnosticar aislando HYG, población global, sectores, cúmulos y fotografías con la misma cámara antes de aumentar el recuento. No existe un censo observado completo de todas las estrellas de la galaxia: mantener identificada la población modelada. Entregas pequeñas en main, comprobar Actions y Pages antes de dar cada una por publicada.

## Entrega 1.8.0 · Capas y filtros por escala

Capas comparte botones, espaciado y controles de intensidad coherentes con el tema. Filtros ofrece siete desplegables contextuales, tipos de cuerpos del sistema solar, clasificación espectral HYG y selección sincronizada de catálogos por escala. Sin desplazamiento interno en la lista de familias orbitales. Los filtros de estrellas afectan tanto al dibujo como a la selección; ocultar la población galáctica también oculta el modelo global.

## Entrega 1.8.1 · Contraste galáctico y orientaciones individuales

Los marcadores de catálogos científicos cercanos se atenúan entre 4.000 y 30.000 años luz de zoom para evitar una falsa concentración de estrellas hacia el Sol. El modelo completo conserva una mezcla de puntos rojos, anaranjados, blancos y azules, con brillo independiente del resplandor difuso. Filtros permite seleccionar cúmulos Gaia, púlsares, nubes y remanentes. Completado el punto 6: M33, M81 y NGC 253 usan ángulos publicados, además de M31; sus fichas enlazan las fuentes y explican los límites de la geometría. Las galaxias sin ajuste conservan orientación ilustrativa. La Vía Láctea sigue siendo una población estadística, no un censo observado completo.

## Entrega 1.8.2 · Galerías verificadas y luz galáctica sin recorte

Punto 23: galerías seleccionadas de Starlink, OneWeb, GPS, Galileo e Iridium, disponibles en las fichas y en la enciclopedia. Siete imágenes con fuente, autor, licencia y distinción entre fotografía, réplica, esquema e ilustración; ninguna se atribuye al NORAD seleccionado. Descarga reproducible y validación JPEG antes de publicar. Corregida la mezcla de los puntos y el resplandor galácticos para evitar que la superposición queme el centro y elimine sus colores.

## Entrega 1.8.3 · Detalle estelar y galerías adaptadas al móvil

Refinado el orden de dibujo galáctico: resplandor detrás del disco y luces estelares resueltas tomadas de la misma población, conservando colores sin quemar el centro. Menor contraste artificial de las bandas de polvo. Vista reducida de la fotografía de integración OneWeb para evitar decodificar 36 megapíxeles en Android; el original sigue enlazado. Los controles de intensidad están agrupados en su escala correspondiente.

### Cierre y continuidad del alcance acordado

Las entregas 1.8.0–1.8.3 cubren Capas, filtros por escala, contraste y colores de la población galáctica, orientaciones individuales (6) y galerías verificadas (23). Las galerías seleccionadas cubren cinco familias; no atribuyen imágenes a satélites individuales ni incluyen una colección verificada de todas las familias existentes.

La representación galáctica combina HYG y referencias científicas observadas con población global y sectores deterministas. No hay un catálogo observado de cada estrella de la Vía Láctea; los puntos modelados no deben presentarse como identificaciones reales. El detalle cercano sigue al observador con sectores de 120 años luz y alcance visual de 340 años luz. Se mantiene la navegación libre W/A/S/D, Q/E y desplazamiento con botón derecho.

Revisados en Git los scripts originales `prepare-atlas-catalogs.py`, `prepare-desi-sample.py` y `prepare-dust-assets.py`: están disponibles y conservan procedencia y dependencias en su cabecera. Esta entrega no afirma haber vuelto a descargar todos esos sondeos ni convertir una instantánea parcial de DESI en cobertura completa.

Los antiguos pendientes 4, 5, 18 y 31 permanecen fuera del alcance por decisión del usuario. No reabrirlos ni tratarlos como completados. Ante nuevas correcciones, publicar entregas pequeñas y comprobar pruebas, navegador y Pages antes de confirmar la subida.

## Entrega 1.8.4 · Barra móvil completa y Acerca de accesible

La barra superior móvil distribuye automáticamente el espacio entre sus ocho botones, con iconos compactos y márgenes seguros. Acerca de queda al alcance de la vista sin desplazamiento horizontal. Se incorpora una comprobación en Chrome a 320, 360, 390 y 740 píxeles que verifica todos los botones y abre Acerca de mediante su posición en pantalla.


## Reapertura del alcance · Realismo del sistema solar y misiones históricas · 2026-09-14

**Estado: diagnóstico y requisitos guardados; cambios visuales todavía NO implementados.** La aplicación continúa en 1.8.4. Este registro documental no constituye una nueva versión funcional. La sesión de trabajo indicó entorno de desarrollo no disponible: se pudo leer GitHub y consultar fuentes, pero no ejecutar ni inspeccionar el visor o los archivos binarios localmente.

### Diagnóstico comprobado por lectura del código

- `src/scene.js:createBodies` crea una SphereGeometry para todos los cuerpos, incluidos Fobos, Deimos y los cuerpos menores. Las formas irregulares no se cargan.
- Mercurio y Urano descargan GLB de NASA mediante `scripts/prepare-assets.mjs`, pero el renderizador extrae solamente el primer material con textura y lo aplica a una esfera nueva. Descarta geometría, UV originales, transformaciones y el resto de materiales. Es un candidato concreto a los defectos de mapeado denunciados; confirmar visualmente al conservar el modelo completo, sin atribuir esos defectos a zonas sin explorar.
- Venus tiene `texture: null` aunque se descarga `venus.jpg`; falta distinguir explícitamente apariencia nubosa visible y cartografía radar de superficie.
- Mimas, Tetis, Dione, Rea y Jápeto tienen `texture: null`. El repositorio oficial NASA-3D-Resources sí contiene mapas JPG propios para cada uno. También hay mapas específicos de las cuatro lunas galileanas, que el proyecto ya descarga.
- Saturno usa un gradiente radial generado en canvas. Solo Saturno tiene `rings: true` en la lista principal. Sustituir el gradiente por perfiles y geometría documentados; revisar inclinación, radios físicos, separación de bandas y sombras.
- `public/data/atlas/minor-bodies.json` contiene Ceres, Plutón, Eris, Haumea, Makemake, Vesta, Palas y Sedna sin textura declarada. No afirmar que se ha verificado una textura repetida: el defecto confirmado en estos datos es la ausencia de una específica.
- `src/app.js:bodyTree` construye las lunas por `parent`; revisar inventario y jerarquía juntos. La sección de misiones excluye `noLocation` y limita a 30 resultados.
- Pioneer 10 y 11 SÍ existen en `public/data/exploration.json`: `gcat-D00431` y `gcat-D00489`. Cassini es `gcat-D00738`, Galileo `gcat-D00680`, Messenger `gcat-D00830`. Son registros históricos con `parent: null` y `noLocation: true`: actualmente no aportan ubicación al mapa ni aparecen en la rama de misiones del planeta. No duplicarlos al ampliar la integración.

### Entregas solicitadas, en orden de trabajo

1. **Mercurio, Venus, Fobos y Deimos.** Preservar geometría/UV/materiales de modelos verificados, escala física y selección. Mercurio sin artefactos de proyección; Venus con dos vistas claramente identificadas; lunas marcianas con modelos de forma observada, no una esfera deformada al azar.
2. **Júpiter y Saturno.** Mapas propios con mayor detalle, figuras y ejes coherentes, anillos reconstruidos con fuentes. Añadir una selección amplia de lunas (el usuario acepta unas 20–30 por sistema muy poblado), con todas las incorporadas accesibles desde el árbol y buscador.
3. **Urano, Neptuno, planetas enanos y cuerpos menores.** Anillos de los otros gigantes y de cuerpos menores donde estén documentados; mapas y modelos específicos disponibles. Mantener explícita la diferencia entre cartografía observada y reconstrucción de cuerpos sin cobertura suficiente; no presentar texturas de otros cuerpos como propias.
4. **Misiones históricas.** Integrar Pioneer y otras misiones terminadas, inactivas o fallidas en buscador, árbol y ficha. Separar estado operativo, existencia física y disponibilidad temporal de efemérides. Una sonda inactiva que aún existe puede tener posición si hay datos fiables; una destruida solo conserva referencia al evento/cuerpo y ficha, sin vehículo actual. Cassini debe figurar como evento histórico de Saturno; diferenciar Huygens. Auditar Galileo, Messenger y otras entradas existentes antes de incorporar duplicados.

En cada entrega funcional: actualizar versión, Acerca de breve, README e IMPLEMENTATION; subir a main y comprobar Actions y Pages antes de anunciar publicación. El usuario ha autorizado las subidas y pide evitar acumular todo en una única entrega. No reabrir los antiguos puntos cancelados.

### Fuentes localizadas

- Referencia del usuario: https://science.nasa.gov/mercury/
- Recursos oficiales, árbol verificado en commit `11ebb4ee043715aefbba6aeec8a61746fad67fa7`: https://github.com/nasa/NASA-3D-Resources
- Mapas: carpetas `Images and Textures/Saturn - Mimas`, `Saturn - Tethys`, `Saturn - Dione`, `Saturn - Rhea`, `Saturn - Iapetus`, cada una con JPG del mismo nombre. Inspeccionar proyección, cobertura y resolución antes de integrarlos.
- Parámetros de satélites: https://ssd.jpl.nasa.gov/sats/phys_par/ y https://ssd.jpl.nasa.gov/sats/elem/
- Misiones: https://science.nasa.gov/mission/pioneer-10/ ; https://science.nasa.gov/mission/pioneer-11/ ; https://science.nasa.gov/mission/cassini/
- Los modelos imprimibles de Vesta del repositorio NASA existen, pero no sustituyen automáticamente a un modelo web texturizado y optimizado. Verificar presupuesto de geometría/memoria para Android.

### Verificación necesaria para darlo por terminado

Inspeccionar ambos hemisferios y polos, orientación de textura y eje, siluetas de cuerpos irregulares, escala, selección y enfoque; anillos desde arriba, de canto y con el planeta ocultándolos; búsqueda/jerarquía de cada luna; fecha anterior y posterior al final de misión. Comprobar escritorio y Android, carga de recursos sin errores y rendimiento. Aún no realizada en esta sesión. El primer paso de reanudación es disponer de un entorno ejecutable del proyecto y comparar Mercurio con el GLB original antes de elegir sustitutos.

## Entrega 1.8.5 · Primera tanda de realismo solar

Mercurio conserva ahora la geometría y el atlas UV del modelo NASA, evitando proyectar sus caras sobre una esfera ajena. Fobos y Deimos usan las mallas irregulares NASA/JPL en kilómetros y se enfocan de cerca. Venus ofrece dos vistas en su ficha: nubes y cartografía radar, con procedencia y significado explícitos. Se carga la superficie radar al solicitarla y se oculta la vista anterior. Esta entrega no incluye todavía la ampliación de lunas, anillos, cuerpos menores ni misiones históricas.

Entorno de terminal y descargas recuperado. Pruebas locales de conservación de geometría, UV, origen y escala; comprobación del visor real y capturas en Chrome mediante Actions. El navegador local instalado termina con SIGSEGV, por lo que la inspección visual se realiza a partir de las capturas del trabajo de Chrome. Los cuatro pasos de la reapertura anterior siguen siendo el alcance autorizado; no considerar finalizados los pasos 2–4.

## Entrega 1.8.6 · Inspección inicial iluminada

El enfoque inicial de Mercurio, Venus, Fobos y Deimos muestra el hemisferio iluminado por el Sol para poder apreciar el modelo desde la selección. La luz sigue siendo solar y la cámara puede girar libremente hacia la cara nocturna. Conserva los modelos originales y las vistas de Venus de 1.8.5.

1.8.5: 74 pruebas, las comprobaciones generales de Chrome y las de modelos solares pasaron; Pages publicado. Las capturas permitieron confirmar las siluetas irregulares y el cambio de textura de Venus. El enfoque anterior situaba Mercurio/Venus mayormente de noche; esta corrección parte de ese hallazgo visual. Quedan las tandas 2–4 de la ampliación solar autorizada.

## Entrega 1.8.7 · Imágenes relacionadas y selector de apariencia

Selección revisada de imágenes NASA de Marte, Venus y Ganímedes, con vistas globales, detalles y datos procesados identificados por su título. Búsqueda en inglés para cuerpos del catálogo, exclusión de celebraciones, disfraces y actos, y prioridad de registros científicos Photojournal. Las selecciones revisadas no dependen del orden cambiante del buscador. Selector de Apariencia con fondo, colores, bordes rectos y foco acordes al tema. Los modelos ampliados, lunas y anillos siguen en preparación para la siguiente entrega.

## Entrega 1.8.8 · Publicación resistente a caídas de NASA

Se recuperan las fotografías revisadas y el selector de apariencia de 1.8.7, cuya publicación falló por un timeout del servidor WMAP. La descarga reintenta, verifica por SHA-256 una copia idéntica de WMAP ya publicada y conserva los recursos planetarios en caché de Actions. La ampliación de modelos y lunas continúa pendiente.

## Entrega 1.8.9 · Modelos NASA de gigantes y superficies

Se integran 19 modelos NASA adicionales: los cuatro gigantes, Plutón, Caronte, Ceres, Vesta y once lunas. Se conserva su geometría, atlas UV y materiales, con carga bajo demanda. Saturno usa los anillos del modelo NASA, sin superponer el gradiente anterior, y el límite de cámara corresponde al planeta. Los polos de los gigantes siguen su orientación media J2000 de JPL. Plutón y Caronte explican su cobertura desigual. Quedan pendientes los anillos tenues de los otros gigantes, más lunas y sus órbitas, vistas multibanda verificadas y misiones históricas.

La entrega 1.8.9 también fija por SHA-256 las copias ya publicadas de Planck y WMAP. 1.8.8 no llegó a publicarse debido a la latencia del servicio de generación Planck.

## Entrega 1.8.10 · 459 lunas y superficies estelares

Catálogo ampliado a 459 lunas únicas de JPL (Puck figuraba dos veces en la tabla de origen): 115 de Júpiter, 291 de Saturno, 29 de Urano, 16 de Neptuno, cinco de Plutón, dos de Marte y la Luna. Las órbitas dibujadas usan las mismas efemérides o elementos medios que cada cuerpo; incluyen el instante actual y no mezclan una posición JPL con un círculo arbitrario. Radios desconocidos se indican como tales; el marcador de inspección no es una medida. Se añade Mercurio MESSENGER en color realzado (PIA17386), con su cobertura original. Cualquier estrella seleccionada puede mostrar la superficie solar reutilizada y teñida con su color, a tamaño solar de referencia ilustrativo. El efecto de agujero negro es compartido por Sagitario A* y M87*, cada uno sobre su entorno. Quedan pendientes los anillos tenues de los otros gigantes, la revisión final de misiones históricas y otras vistas científicas que dispongan de mapas verificados.
