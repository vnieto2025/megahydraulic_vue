# Plantilla de Prompt: Frontend Moderno

Copia esta estructura y rellena los corchetes `[ ]` según tu proyecto.

---

## Plantilla base

```
Quiero que desarrolles [tipo de interfaz: landing page / dashboard / app web / formulario / etc.]
para [descripción breve del producto/servicio].

CONTEXTO Y PROPÓSITO:
- Producto: [qué hace tu app/negocio]
- Audiencia: [quién lo va a usar]
- Sensación que debe transmitir: [ej: confianza y seriedad / creatividad y energía /
  simplicidad y calma / poder y velocidad]

ESTILO VISUAL:
- Referencia de diseño: [ej: Linear, Vercel, Stripe, Notion, Arc Browser, Framer]
- Estética: [ej: minimalista, glassmorphism, neo-brutalist, dark mode SaaS, editorial]
- Paleta de color: [colores específicos o "elige una paleta cohesiva con un color de
  acento distintivo, evita el degradado azul-morado genérico"]
- Tipografía: [ej: "usa una fuente sans-serif moderna con personalidad, tamaños grandes
  y bold en títulos, buena jerarquía tipográfica"]

ESTRUCTURA / SECCIONES:
1. [Sección 1, ej: Hero con headline + CTA]
2. [Sección 2, ej: Features en grid de 3 columnas]
3. [Sección 3, ej: Testimonios / social proof]
4. [Sección 4, ej: Footer]

INTERACTIVIDAD Y DETALLES:
- Micro-animaciones al hacer scroll y hover states en botones/cards
- Transiciones suaves (no instantáneas, usa easing)
- Estados de los componentes: loading, empty state, error (si aplica)
- Diseño 100% responsive (mobile-first)

TÉCNICO:
- Stack: [ej: React + Tailwind / HTML+CSS+JS puro]
- [Cualquier restricción: sin librerías externas / usar shadcn/ui / etc.]
```

---

## Ejemplo relleno (landing page fintech)

```
Quiero que desarrolles una landing page para una app fintech que ayuda a jóvenes
a invertir con montos pequeños desde el celular.

CONTEXTO Y PROPÓSITO:
- Producto: app de microinversiones
- Audiencia: jóvenes de 22-35 años, primera vez invirtiendo
- Sensación que debe transmitir: confianza y modernidad, sin ser intimidante

ESTILO VISUAL:
- Referencia de diseño: estilo Stripe / Mercury (fintech moderno, limpio)
- Estética: minimalista con acentos de color vibrantes
- Paleta de color: fondo blanco/gris muy claro, acento en verde esmeralda,
  detalles en negro para contraste
- Tipografía: sans-serif moderna, headline grande y bold, buen espaciado

ESTRUCTURA:
1. Hero con headline potente + CTA "Empieza con $10"
2. Sección de "cómo funciona" en 3 pasos con íconos
3. Grid de features/beneficios
4. Testimonios de usuarios
5. Footer con links

INTERACTIVIDAD:
- Animación sutil de entrada en cada sección al hacer scroll
- Botones con hover state y micro-transición
- Totalmente responsive

TÉCNICO:
- React + Tailwind CSS
```

---

## Tips extra

- **Itera en pasos.** Primero pide la estructura general, luego refina: "hazme el hero más impactante" o "cambia la paleta a tonos más oscuros".
- **Pide alternativas.** "Dame 2 variantes del hero: una más minimalista y otra más bold."
- **Menciona lo que NO quieres.** Es tan útil como decir lo que sí: "evita el gradiente morado-azul típico de IA" ayuda mucho.
