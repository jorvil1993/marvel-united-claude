#!/bin/sh
# Rehace la lista de imágenes del service worker y sube su versión (así el celular se actualiza).
cd "$(dirname "$0")/.." || exit 1
{ echo "const VERSION = 'tm-$(date +%Y%m%d%H%M)';"; echo "const IMAGENES = ["; find assets -type f \( -name '*.jpg' -o -name '*.png' \) | sort | sed "s/.*/  '&',/"; echo "];"; sed -n '/^const NUCLEO/,$p' sw.js; } > sw.tmp && mv sw.tmp sw.js && node --check sw.js && head -1 sw.js
