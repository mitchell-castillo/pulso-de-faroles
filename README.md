# Pulso de Faroles

Daily Games · 26 octubre 2026. Seis plazas originales inspiradas en la mecánica clásica Lights Out. Apaga cada farol y sus vecinos, sin reloj ni anuncios.

## Jugar
GitHub Pages se configura desde main, raíz. Catálogo: https://mitchell-castillo.github.io/daily-games/

## Desarrollo
Node22+, sin dependencias: `npm run check`. Servidor local: `python3 -m http.server 4188 --bind 127.0.0.1`.

Tab/Enter/Espacio y flechas; deshacer; reinicio y borrado con confirmación. Progreso guardado solo en el navegador.

## Verificación
50 pruebas automatizadas y QA real de escritorio: seis finales, teclado, deshacer, diálogos, recarga y sincronización entre pestañas. Ver QA.md para límites.
