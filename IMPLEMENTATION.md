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
