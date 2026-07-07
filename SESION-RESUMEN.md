# CarbonZ Landing — Resumen de Sesión

## URL Producción
**https://carbonz.vercel.app** (GitHub: `ibonmb151/carbonz-landing`)

---

## Decisions Taken

### Hero — Split Slide Transition
- **Decisión**: Usar transición "Split Slide" donde **2 imágenes están a la vez** en pantalla
- **Comportamiento**: Una imagen sale por la izquierda, la otra por la derecha. Las nuevas entran desde lados opuestos
- **Posiciones**: Frame 0 = centro (88% width, enorme), Frame 1 = izquierda (52%), Frame 2 = derecha (52%), Frame 3 = izquierda (52%)
- **Scroll**: Hero mide **280vh** — cada imagen dura ~70vh de scroll (transiciones rápidas)
- **Primera imagen**: Enorme al 88% del ancho de pantalla, sin max-width. El resto al 52% con max-width 540px
- **Fondo**: Radial gradient oscuro (#222→#0e0e0e) que coincide con el tono de las fotos (~#0a-#1e en esquinas)
- **Máscara**: `mask-image: radial-gradient(ellipse 90% 85%, black 60%, transparent)` — bordes suaves que funden imágenes con fondo

### Imágenes
- **hero-frontal.png** — Vista frontal (primera, enorme)
- **diagonal.png** — Vista diagonal (usada en sticky section "Diseño")
- **lateral2.png** — Vista lateral (usada en split "Instalación")
- **trasera.png** — Vista trasera (usada en card 04 "Hecha a mano" del features grid)

### Secciones — Orden Final
1. **Hero** (280vh) — Split slide con 4 imágenes
2. **Marquee** — "20% OFF · SOLO ESTE MES · ENVÍO GRATIS" verde
3. **Text Reveal** — "Cada fibra es única"
4. **Sticky Diseño** — Texto izquierda + imagen diagonal derecha (parallax)
5. **Split Proceso** — Imagen frontal izquierda + texto derecha
6. **Split Instalación** — Texto izquierda + imagen lateral derecha (reverse)
7. **Features Grid** — "Por qué forjado" — Grid 2x2 con 4 cards (NO horizontal scroll)
8. **Specs** — Split layout: título izquierda + tabla derecha
9. **CTA Final** — "¿Listo para volar?" con speed lines futuristas + stock alert

### CTA Final — "¿Listo para volar?"
- **Fondo**: Speed lines animadas (10 líneas verdes cruzan a diferentes velocidades) + glow radial pulsante
- **Stock alert**: Inline sin border/pill — solo dot verde pulsante + "Quedan **2** unidades — *última oportunidad*"
- **Text**: "¿Listo para volar?" en una línea (sin `<br>`)
- **Precio**: 151€ (was 189€) con badge -20%
- **Botones**: "Añadir al carrito" + "Preguntar por WhatsApp"

### Footer
- **Layout**: Links a la izquierda (`justify-content: flex-start`) — espacio a la derecha para WhatsApp icon
- **Sin curvatura**: `border-radius: 0` en html y footer — acabado cuadrado

### WhatsApp Button
- Aparece **solo al llegar al final del documento** (sección CTA), no al salir del hero
- Lógica: `y + winH >= docH - winH * 0.8`

### Header
- **Desktop**: Sin header bar (height: 0, transparent). Solo nav pill flotante
- **Mobile**: Header con hamburger menu
- **Nav pill**: Aparece al hacer scroll 50% del hero

---

## Technical Details

### Scroll & Positioning
- Hero usa `position: fixed` vía JS (no CSS sticky) — más fiable cross-browser
- Hero se queda como fondo fijo después del scroll — secciones con `z-index: 2` y `background: #111` scrollean sobre él
- `scroll-behavior: smooth` + `overscroll-behavior: none`

### CSS Variables
```css
--green: #30d158
--green-soft: rgba(48, 209, 88, 0.08)
--black: #000
--white: #f5f5f7
--pure-white: #fff
--gray-300/400/500/600/700: tonos de gris
--font: 'Inter', -apple-system, sans-serif
```

### Responsive
- Mobile breakpoint: 768px (secciones split → 1 columna)
- Features grid → 1 columna en 600px
- Hero frames: 88% desktop → 72% mobile

### Deploy
```bash
git push
vercel --prod --yes
vercel alias set <deployment-url> carbonz.vercel.app
```

---

## Lo que queda por hacer (Fase 2)
- Carrito funcional
- Checkout con Stripe
- Panel admin/CRM
- Blog SEO ("Cómo instalar la cúpula en tu Z900")
- Testimonios
- FAQ
- Open Graph meta tags + favicon
- Dominio personalizado
