# NEXT STYLE

Sitio web de NEXT STYLE — poleras básicas y personalizadas en Santa Cruz de la Sierra, Bolivia.
Sitio estático (HTML + CSS + JS, sin dependencias ni paso de compilación). Se publica en Vercel.

## Estructura
- `index.html` — la página.
- `assets/styles.css`, `assets/main.js`, `assets/boot.js` — estilos y comportamiento.
- `assets/img/` — fotos originales de las poleras (sin modificar).
- `assets/fonts/` — Bebas Neue e Inter, alojadas en el propio sitio.
- `vercel.json` — cabeceras de seguridad (CSP) y caché.

## Cómo editar
- **Teléfono / WhatsApp:** busca `59162185788` en `index.html` y `assets/main.js`.
- **Precios y textos:** directamente en `index.html`.
- **Nueva foto de polera:** copia el `.jpg` a `assets/img/` y agrega una tarjeta copiando una existente.
- No uses `style="..."` en el HTML: la política de seguridad lo bloquea (usa clases en `styles.css`).

## Probar en local
`python3 -m http.server 8000` y abre http://localhost:8000
