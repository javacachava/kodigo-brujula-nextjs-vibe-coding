# Proceso de Vibe Coding · Brújula

Registro del flujo de desarrollo guiado por IA para la actividad de la Semana 21 (Full Stack Junior 34, Kodigo).

- **Herramienta de IA:** Claude Code (modelo Claude Sonnet 5.5) dentro de VS Code, con acceso a terminal, sistema de archivos y navegador automatizado (Playwright).
- **Fecha de desarrollo:** 6 de noviembre de 2026.
- **Rol de la persona:** definir el objetivo, dirigir y aprobar el resultado. **Rol de la IA:** proponer la arquitectura, escribir el código, ejecutarlo y verificarlo.
- **Resultado:** [Brújula](./README.md), una app que recomienda el mejor día para viajar según el pronóstico de 7 días.

## 1. Prompts principales

Solo hubo una instrucción humana en esta sesión; todo lo demás nació de ella y de lo que la verificación fue revelando.

### Prompt 1 · Instrucción inicial

Se pegó el enunciado completo de la actividad (requisitos técnicos y entregables) y se añadió:

> «realiza eso crea una carpeta y hazlo»

La temática era libre, así que la IA tuvo que decidirla (ver decisión D1). De ese prompt se derivó el siguiente plan de trabajo, que la IA siguió y fue ajustando:

1. Revisar el entorno (Node, git, `gh`, `vercel`) y la documentación de la versión de Next.js instalada.
2. Elegir un tema con una API externa gratuita y sin clave.
3. Construir por capas: datos → Route Handlers → sistema de diseño → páginas → estados de carga/error.
4. Verificar cada capa antes de seguir (compilación, tipos, lint, pruebas en navegador).
5. Documentar el proceso y publicar (GitHub + Vercel).

> Si más adelante se hacen ajustes con nuevos prompts, conviene agregarlos aquí con su resultado para mantener el registro fiel.

## 2. Iteraciones realizadas con la IA

| # | Iteración | Qué generó la IA | Cómo se validó | Commit |
| --- | --- | --- | --- | --- |
| 0 | Base del proyecto | `create-next-app` con TypeScript, Tailwind y App Router | `npm run dev` arranca | `88b3b0e` |
| 1 | Capa de datos | Cliente de Open-Meteo con `use cache`, tipos, puntaje de viaje, 2 Route Handlers | `curl` a ambos endpoints con entradas válidas e inválidas (200 / 400) | `702c28f` |
| 2 | Sistema de diseño | Tokens claro/oscuro, tipografía, layout, navegación, hook de favoritos | `tsc` y `eslint` limpios | `d413633` |
| 3 | Portada | Hero con buscador, tarjetas de destinos destacados, skeletons, `loading`/`error`/`not-found` | Revisión visual en el navegador | `ed85e40` |
| 4 | Explorar y detalle | Buscador con debounce, página de ciudad dinámica con su `loading`, `error` y `not-found` | Búsqueda real («lima», «roma») y detalle de varias ciudades | `cc2e986` |
| 5 | Favoritos y Acerca | Tablero con clima en vivo y ranking; página explicativa | Flujo completo: guardar en `/explorar` y verlo en `/favoritos` | `4906d5f` |
| 6 | Correcciones tras verificar | 2 bugs de lógica y 3 detalles visuales (ver sección 4) | Nueva compilación y repetición de las pruebas | `90d9ac6` |

## 3. Decisiones técnicas

- **D1 · Tema: planificador de viajes por clima.** Cumple todos los requisitos sin inventar datos: la API de geocodificación alimenta un buscador (cliente) y el pronóstico alimenta páginas de detalle (servidor). El «puntaje de viaje» da una razón de ser a la app más allá de mostrar números.
- **D2 · Open-Meteo como API externa.** Gratuita y sin clave; evita exponer secretos y permite que cualquiera clone y ejecute el proyecto. Aun así se mantienen URLs configurables y una clave opcional en `.env.local` / `.env.example`.
- **D3 · Route Handlers como puente.** El cliente nunca llama a Open-Meteo directamente: pasa por `/api/ciudades` y `/api/clima`, que validan los parámetros, normalizan la respuesta y centralizan el manejo de errores.
- **D4 · Cache Components (`use cache` + `cacheLife`).** `create-next-app` activó esta función en Next.js 16.4, así que se adoptó en lugar de desactivarla: el pronóstico se cachea 15 minutos, las búsquedas horas y los datos de ciudad días.
- **D5 · Server Components por defecto, Client Components solo donde hay interacción.** Servidor: portada, detalle, acerca, tarjetas. Cliente: buscador, favoritos, navegación activa, botón de corazón.
- **D6 · Favoritos con `useSyncExternalStore`.** Evita el desajuste de hidratación de leer `localStorage` en el primer render y sincroniza entre pestañas. `useState`/`useEffect` se usan donde corresponden (búsqueda con debounce y carga de clima por favorito).
- **D7 · Tailwind 4 con tokens CSS.** Un solo conjunto de variables (`--paper`, `--ink`, `--accent`…) redefinido para modo oscuro mantiene coherencia y evita colores sueltos en los componentes.
- **D8 · Sin dependencias extra.** No se instalaron librerías de UI, estado ni validación: cada una habría añadido peso a un proyecto de alcance acotado.

## 4. Desafíos encontrados y cómo se resolvieron con apoyo de la IA

### 4.1 La versión instalada no coincide con el conocimiento previo de la IA

`create-next-app` instaló Next.js **16.4.5** con Cache Components activo, y generó un `AGENTS.md` que advierte que la versión tiene cambios incompatibles. En lugar de escribir de memoria, la IA leyó la documentación incluida en `node_modules/next/dist/docs/` antes de programar. Eso evitó un error silencioso: en esta versión `error.tsx` recibe la prop **`retry`**, no `reset` como en versiones anteriores (`retry` es estable desde la 16.3). Los patrones de `params` asíncrono y `<Suspense>` para datos dinámicos también se tomaron de esa documentación.

### 4.2 Error de compilación con Tailwind 4

`@apply btn …` dentro de `globals.css` falló con `Cannot apply unknown utility class btn`: en Tailwind 4 una clase propia definida en `@layer components` no puede usarse con `@apply`. La IA lo detectó en el primer `next build` y resolvió expandiendo las utilidades en `.btn-primary` y `.btn-ghost`.

### 4.3 Un ID de ciudad inexistente devolvía error en vez de «404»

Al probar `/ciudad/99999999` el log mostró `UpstreamError ... 400`. La IA había supuesto que Open-Meteo respondería 404, pero responde **400** con `"Location ID not found."`. Se corrigió `getCityById` para tratar 400 y 404 como «no encontrado», de modo que se muestre la página `not-found` en lugar de la pantalla de error.

### 4.4 Los errores pierden su clase al cruzar `use cache`

Para probar el estado de error se arrancó una copia de la app con `FORECAST_API_URL` apuntando a un puerto cerrado. `/api/clima` respondía **500** en lugar del **502** previsto. Causa: un error lanzado dentro de una función con `"use cache"` llega al exterior sin su clase ni su mensaje (en producción se sanitiza), por lo que `error instanceof UpstreamError` era siempre falso. Solución: los Route Handlers traducen cualquier falla a `502` con un mensaje claro y registran el error original en el servidor. La página de detalle, en cambio, muestra correctamente su `error.tsx` con el botón «Reintentar».

### 4.5 Detalles visuales que solo se ven en el navegador

La revisión con capturas de pantalla encontró tres problemas que ni el compilador ni el linter detectan:

- El puntaje de la semana era **ilegible** sobre el panel oscuro (color de la insignia sobre fondo del mismo tono).
- `capitalize` convertía «6 de noviembre» en «6 De Noviembre»; se reemplazó por `first-letter:uppercase`.
- En móvil, la tira de 7 días quedaba pegada al borde izquierdo y recortaba la etiqueta «Mejor día» por el `snap` del scroll horizontal; se añadió `scroll-px-4` y espacio superior.

## 5. Cómo se evitó aceptar código sin revisarlo

- **Compilación y tipos:** `next build` (incluye TypeScript estricto) y `tsc --noEmit` después de cada bloque.
- **Linter:** `eslint` con la configuración de Next.js sin advertencias.
- **Pruebas de los endpoints:** `curl` con entradas válidas, inválidas y con el upstream caído.
- **Pruebas en navegador (Playwright):** búsqueda real, detalle, favoritos entre páginas, estado de error, estado de carga, modo oscuro y dos anchos de pantalla (390 px y 1280 px). Las capturas están en [`docs/capturas/`](./docs/capturas).
- **Verificación de documentación:** las decisiones sobre APIs de Next.js 16 se contrastaron con la documentación instalada, no con la memoria del modelo.

## 6. Limitaciones conocidas y mejoras posibles

- No hay pruebas automatizadas; `travel-score.ts` es una función pura ideal para empezar con pruebas unitarias.
- Los favoritos viven en `localStorage`: no se comparten entre dispositivos. Una base de datos (por ejemplo Supabase) con autenticación lo resolvería.
- Las búsquedas se cachean por texto exacto, sin límite explícito de entradas.
- El puntaje usa pesos fijos; podría ajustarse según el tipo de viaje (playa, senderismo, ciudad).
