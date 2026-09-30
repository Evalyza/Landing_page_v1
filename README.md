> **Actualización 1 oct 2026:** la landing pasa a tema oscuro (suelo de Tinta profunda #0b0e24 con paneles Tinta), disponible en español, inglés, francés, alemán e italiano, con petición de llamada, casilla de consentimiento y las páginas legales `diseno-landing/terminos.html` y `diseno-landing/privacidad.html`. El sistema de diseño completo y actualizado está en `DESIGN.md`.

Design System: Evalyza

Overview

Creative North Star: "El informe que se arma solo"

Evalyza se presenta como su propio resultado. La página es clara y tranquila (fondo Niebla, texto Tinta, Lexend ligera) y el producto aparece siempre dentro de paneles Tinta: la superficie de instrumento donde los agentes escuchan, ordenan, puntúan y recomiendan. Lo que convence no es una ilustración ni una promesa, sino la salida del producto funcionando con datos de ejemplo etiquetados como tales.

El sistema toma su geometría del símbolo: la «E» redondeada con barra central en degradado coral→ámbar y el punto turquesa. De ahí salen las barras-píldora (de puntuación, de progreso, de subrayado), los controles en píldora y los paneles de 24px. El color tiene dos trabajos separados: el degradado de marca, reservado a la acción principal y a los ecos de la barra del símbolo, y la tríada semántica (turquesa sano, ámbar vigilar, coral crítico), reservada a los datos del diagnóstico.

La densidad es de herramienta profesional dentro de los paneles (filas de 12–14px, cifras en mono tabular) y editorial y aireada fuera de ellos (secciones de 88–152px, párrafos a 34–58ch). El tono visual es directo, diagnóstico y calmado: un buen socio operativo, no una presentación de hype.

Key Characteristics:





Suelo Niebla claro; el producto vive en paneles Tinta con esquinas de 24px.



Degradado coral→ámbar solo en la barra del símbolo y sus ecos: botón principal, subrayado del titular, barra del paso activo.



Tríada semántica fija en los datos: turquesa sano, ámbar vigilar, coral crítico.



Una sola voz tipográfica (Lexend) de titular a cuerpo; Spline Sans Mono solo para cifras y estados de agente.



Forma en píldora heredada del logotipo: barras, etiquetas, controles, campos del hero.



Todo dato del producto lleva la etiqueta «Datos de ejemplo».



Colors

Una paleta de marca cerrada de seis colores, extendida solo con tonos de Tinta para las capas del panel y con variantes legibles de la tríada según el suelo.

Primary





Coral Diagnóstico (coral): estado crítico en datos y arranque del degradado de marca. En texto sobre fondo claro se usa su variante Coral Tinta (coral-ink); sobre Tinta, Coral Suave (coral-on-tinta).



Ámbar Vigilancia (ambar): estado «vigilar», final del degradado, icono activo del agente, foco de campos sobre Tinta y selección de texto. En texto sobre claro, Ámbar Tostado (ambar-ink); sobre Tinta, Ámbar Claro (ambar-on-tinta).



Secondary





Turquesa Salud (turquesa): estado sano o fortaleza, forma «real» del radar, línea de tendencia, pista de construcción completada, viñetas de verificación. Turquesa Suave (turquesa-soft) es el tercer escalón de la escala de calor de cuatro pasos (coral, ámbar, turquesa-soft, turquesa). En texto: turquesa-ink sobre claro, turquesa-on-tinta sobre Tinta.



Neutral





Tinta (tinta): texto principal sobre claro y fondo de los paneles del producto, del botón oscuro y del pulgar del control segmentado.



Tinta 2 / Tinta 3 (tinta-2, tinta-3): capas dentro del panel; tinta-2 para filas, burbujas y campos, tinta-3 para iconos en reposo, etiquetas de muestra y hover del botón oscuro.



Línea Tinta (tinta-line): divisores y bordes dentro de los paneles.



Niebla (niebla): suelo de la página y fondo de citas dentro de tarjetas claras.



Papel (paper): tarjetas claras, campo del hero, control segmentado, detalle de área.



Tinta Suave (ink-soft): texto secundario sobre claro.



Línea (line): bordes de 1px y divisores sobre claro.



Sobre Tinta / Sobre Tinta Suave (on-tinta, on-tinta-soft): texto principal y secundario dentro de los paneles.



Gris (gris): gris de marca; borde de hover de las píldoras y evidencias destacadas en el mapa de áreas.



Error (error-ink): mensajes de error y borde de campo inválido sobre claro.



Named Rules

The Gradient Belongs to the Bar Rule. El degradado coral→ámbar (90deg) solo aparece donde repite la barra central del símbolo: el botón principal, el subrayado del titular y la barra del paso activo. Nunca rellena datos, fondos de sección ni texto.

The Semantic Triad Rule. En cualquier dato de diagnóstico, turquesa significa sano, ámbar significa vigilar, coral significa crítico. No se intercambian ni se usan como decoración junto a datos.

The Two Grounds Rule. La página es Niebla; el producto es Tinta. Cada color semántico tiene su variante de texto para cada suelo (ink sobre claro, on-tinta sobre Tinta) y no se mezclan.

Typography

Display Font: Lexend (con ui-sans-serif, system-ui)
Body Font: Lexend (con ui-sans-serif, system-ui)
Label/Mono Font: Spline Sans Mono (con ui-monospace, SF Mono)

Character: Lexend es la voz del wordmark: titulares en 600 apretados (-0.03em) y cuerpo en 300, ligero y muy legible. La mono aparece solo cuando el producto habla en cifras.

Hierarchy





Display (600, clamp(2.6rem, 4.6vw, 4.25rem), 1.05): titular del hero, uno por página.



Headline (600, clamp(2.1rem, 3.8vw, 3.4rem), 1.05): títulos de sección; los verbos del recorrido van a clamp(1.9rem, 3vw, 2.6rem).



Title (600, clamp(1.4rem, 2vw, 1.75rem), 1.05): títulos de tarjeta; 22–24px en detalle de área y lista de espera. Las preguntas del FAQ usan 500 a 19px.



Lead (300, 18–19px, 1.55–1.6): subtítulos de sección y del hero, 34–58ch.



Body (300, 16.5px, 1.6): texto corrido, máximo ~60ch.



Label (500, 14–15px): etiquetas de campo, navegación, nombres de agente, preguntas del test.



Score (Spline Sans Mono 400–500, 12–13px, cifras tabulares): puntuaciones, celdas del mapa de calor, estados de agente, ejes de tendencia.



Named Rules

The One Voice Rule. Lexend es la única familia de texto. La mono se reserva para números y estados de máquina; nunca para titulares ni prosa.

The Light Body Rule. El cuerpo va en peso 300; el énfasis sube a 500, los titulares a 600. No hay pesos intermedios decorativos.

Layout

Contenedor centrado de 1320px con gutter fluido (clamp(16px, 4vw, 40px)) y secciones con ritmo vertical de clamp(88px, 11vw, 152px). Las composiciones son asimétricas a dos columnas (proporciones 1 : 1.1–1.15, o 0.8 : 1.2 en el FAQ) que se apilan por debajo de 900–980px. La sección de funcionamiento fija el panel escenario (sticky, top 112px) mientras los pasos avanzan; en móvil cada paso incrusta su propia pantalla. La cuadrícula de «a medida» es un bento de 6 columnas con huecos de 16px (tiles de 4+2 y 2+4), que pasa a 3+3 y luego a una columna. Dentro de los paneles el inset es 22px y los huecos entre filas 6–10px.

Elevation & Depth

Sistema mayoritariamente plano. Las superficies claras no tienen sombra: se separan con borde de 1px en Línea y cambio de fondo (Niebla → Papel). Solo tres cosas se elevan: el panel Tinta, con una sombra larga y difusa que lo asienta como objeto; el botón principal, con un brillo coral suave sobre claro; y el campo del hero, con una sombra mínima. Dentro del panel, la profundidad es tonal (tinta → tinta-2 → tinta-3).

Shadow Vocabulary





Panel asentado (box-shadow: 0 30px 60px -30px rgba(18,22,51,0.55), 0 1px 0 rgba(255,255,255,0.06) inset): todos los paneles Tinta.



Brillo de acción (box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 8px 20px -8px rgba(255,90,54,0.55); hover 0 12px 28px -10px rgba(255,90,54,0.7)): botón principal sobre suelo claro.



Acción sobre Tinta (box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 6px 14px -8px rgba(0,0,0,0.5)): botón principal dentro de un panel.



Campo elevado (box-shadow: 0 4px 10px -6px rgba(18,22,51,0.18)): fila de email del hero.



Anillo de foco (box-shadow: 0 0 0 3px rgba(18,22,51,0.12); sobre Tinta rgba(255,176,32,0.18)): campos con foco.



Named Rules

The No Glow on Tinta Rule. Sobre un panel Tinta ningún elemento lleva sombra de color; el botón principal pasa a una sombra neutra.

The Tonal Panel Rule. Dentro del panel la jerarquía se construye con los tonos de Tinta, no con sombras.

Shapes

La forma sale del símbolo. Cuatro radios: píldora (999px) para toda barra, etiqueta, botón, control y campo en línea; 24px para paneles y tarjetas; 14px para filas y campos internos; 10px para teselas de icono y celdas del mapa de calor. Las barras de datos son píldoras de 8px sobre una guía punteada en lugar de una pista rellena. Las burbujas de chat usan 16px con la esquina de salida a 6px. Bordes siempre de 1px.

Named Rules

The Pill Bar Rule. Cualquier magnitud (puntuación, progreso, leyenda, subrayado) se dibuja como una barra-píldora, eco de la barra del símbolo.

Components



Buttons





Shape: píldora completa (999px), alto 52px (42px pequeño, 48px dentro del campo del hero).



Primary: degradado coral→ámbar con texto Tinta, Lexend 600 a 16px, padding 0 26px; flecha Phosphor bold que se desplaza 3px en hover.



Dark: fondo Tinta, texto on-tinta; hover a tinta-3. Es la acción de la navegación.



Hover / Focus: hover solo en punteros finos; :active escala a 0.97 (160ms, ease-out); foco con contorno coral de 2px y separación de 3px.



Loading: spinner de 18px en Tinta, botón deshabilitado a 0.85 de opacidad.



Chips





Tags: píldoras de 26px, 12px/500. Sobre Tinta: fondo de la tríada al 16–18% con texto on-tinta; la etiqueta de muestra usa tinta-3. Sobre claro: tríada al 14–20% con texto ink, y la de muestra en Niebla con borde Línea.



Pill options: píldoras de 40px con borde tinta-line; hover a Gris; seleccionada invierte a on-tinta con texto Tinta.



Fuentes y documentos: píldoras de 34–46px con icono Phosphor y borde de 1px.



Cards / Containers





Corner Style: 24px.



Background: Tinta (panel de producto, tiles oscuros) o Papel con borde Línea (tiles claros, detalle de área).



Shadow Strategy: solo el panel Tinta se eleva (ver Elevation & Depth).



Internal Padding: 22px en paneles, clamp(24px, 3vw, 36px) en tiles; cabecera de panel 18px 22px con divisor tinta-line.



Inputs / Fields





Style: campos de 50px, radio 14px, borde #cfd2e3 sobre Papel; sobre Tinta, fondo tinta-2 y borde tinta-line. El email del hero es una fila-píldora de Papel con el botón dentro.



Focus: borde a Tinta con anillo de 3px; sobre Tinta, borde Ámbar con anillo ámbar.



Error: borde y mensaje en error-ink sobre claro, coral-on-tinta sobre Tinta; mensajes con aria-live.



Navigation





Barra fija de 72px sobre Niebla translúcida (82%) con desenfoque; el borde inferior aparece al hacer scroll. Enlaces Lexend 500 a 15px en ink-soft que pasan a Tinta; se ocultan por debajo de 860px dejando logo y botón oscuro pequeño.



Segmented Control





Píldora de Papel con borde Línea y padding 4px; un pulgar Tinta se desliza (300ms ease-out) bajo la opción activa, que pasa a on-tinta.



Agent Console (signature)





Panel Tinta con cabecera (icono de app, título, etiqueta «Datos de ejemplo»), columna de agentes con teselas de icono de 34px (tinta-3 en reposo, Ámbar activo, turquesa al terminar), feed de hallazgos que entran con fundido, desplazamiento de 8px y desenfoque (420ms ease-out), y barras de puntuación que crecen desde la izquierda (900ms). Pie con progreso y botón de repetir.



Heat Map (signature)





Rejilla de celdas de 10px de radio con cifra mono en Tinta; escala de cuatro pasos coral, ámbar, turquesa-soft, turquesa. Leyenda con barras-píldora de 16×8px.



Do's and Don'ts



Do:





Do mostrar el producto dentro de paneles Tinta de 24px con la sombra de panel asentado.



Do etiquetar cada dato, gráfico o caso con «Datos de ejemplo» o «Ejemplo» mientras no haya clientes reales.



Do codificar el estado solo con la tríada: turquesa sano, ámbar vigilar, coral crítico, usando la variante de texto de cada suelo.



Do dibujar magnitudes como barras-píldora y poner las cifras en Spline Sans Mono tabular.



Do animar con ease-out (cubic-bezier(0.23, 1, 0.32, 1)) y respetar prefers-reduced-motion mostrando el estado final.



Do usar iconos Phosphor (regular, bold en botones) a 16–20px.



Don't:





Don't usar el degradado coral→ámbar en datos, fondos de sección, texto o iconos.



Don't poner sombras de color dentro de un panel Tinta.



Don't usar coral, ámbar o turquesa como decoración junto a datos donde puedan leerse como estado.



Don't introducir una segunda familia de texto; la mono no sirve para titulares ni prosa.



Don't inventar clientes, logos ni métricas reales.

