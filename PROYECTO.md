# 🏍️ Proyecto: Tienda Online Cúpulas Carbono Forjado Z900

> **Fecha de inicio**: 4 julio 2026
> **Estado**: Planificación / Pendiente de arrancar
> **Responsable**: Ibón Jon Mariscal

---

## 📋 Resumen del Proyecto

Crear una tienda online para vender **cúpulas de fibra de carbono forjada** para moto **Kawasaki Z900**, muy parecidas a la original pero con acabado premium de carbono forjado (forged carbon).

### Propuesta de Valor
- **Producto**: Cúpulas de carbono forjado (patrón irregular, look premium)
- **Mercado**: Propietarios de Kawasaki Z900 (2020-2024, 2025+)
- **Diferenciador**: Carbono forjado real (no acrílico con acabado carbono como Puig)
- **Margen estimado**: Alto (coste fabricación vs PVP ~150-250€)

---

## 📊 Análisis de Mercado y Competencia

### Competidores Principales

| Marca | Material | Precio | Diferenciador |
|-------|----------|--------|---------------|
| **Puig** | Acrílico + acabado carbono | 118-142€ | Líder, homologada TÜV |
| **MotoFixPro** | Carbono real 3K tejida | 70-81€ | Precio bajo, calidad media |
| **Turn1** | 100% carbono forjado, autoclave | ~235€+ | Premium, envío USA |
| **MotoVision** | Carbono + fibra vidrio | ~100-150€ | Gama media |
| **Barracuda** | Plexiglás | 139€ | Diseño italiano |
| **FF-Carbon** | Carbono + fibra de vidrio | Variable | Plain/twill weave |
| **RPM Carbon** | Dry carbon, premium | Variable | Acabado UV |

### Nicho de Mercado
- **Carbono forjado (forged carbon)** = patrón irregular, muy demandado en motos high-end
- Pocos fabricantes lo hacen bien para la Z900
- Mercado: Z900 2020-2024 (generación actual) + Z900 2025+ (nueva generación)

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Frontend** | Next.js 16 + Tailwind + shadcn/ui | Rápido, componentes listos, SEO perfecto |
| **Backend** | Next.js API Routes + Server Actions | Todo en un solo proyecto |
| **Database** | PlanetScale (MySQL serverless) | Serverless, escala gratis, branching |
| **Pagos** | Stripe Checkout + Webhooks | Seguro, sin PCI compliance |
| **Auth** | NextAuth.js | Login admin con Google/GitHub |
| **Imágenes** | Cloudinary | CDN global, optimización automática |
| **Email** | Resend | Transaccional (confirmaciones + tracking) |
| **Deploy** | Vercel | 1 click, preview URLs, analytics |

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────┐
│                  VERCEL (Hosting)                │
│  Next.js 16 + App Router + React Server Comp.   │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  STOREFRONT │  │  CHECKOUT   │  │  ADMIN   │ │
│  │  /          │  │  /checkout  │  │  /admin  │ │
│  │  /productos │  │  Stripe     │  │  CRM     │ │
│  │  /carrito   │  │  Elements   │  │  Pedidos │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
│                                                   │
├─────────────────────────────────────────────────┤
│  DATABASE: PlanetScale (MySQL serverless)        │
│  AUTH: NextAuth.js (admin login)                 │
│  STORAGE: Cloudinary (imágenes productos)        │
│  EMAIL: Resend (confirmaciones + tracking)       │
└─────────────────────────────────────────────────┘
```

### Estructura de Archivos

```
tienda-z900/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── productos/
│   │   ├── page.tsx                # Catálogo
│   │   └── [id]/page.tsx           # Ficha producto
│   ├── carrito/
│   │   └── page.tsx                # Carrito
│   ├── checkout/
│   │   └── page.tsx                # Checkout multi-paso
│   ├── cuenta/
│   │   ├── page.tsx                # Dashboard cliente
│   │   ├── pedidos/page.tsx        # Historial pedidos
│   │   └── pedido/[id]/page.tsx    # Detalle pedido + tracking
│   ├── admin/
│   │   ├── page.tsx                # Dashboard admin
│   │   ├── pedidos/page.tsx        # Gestión pedidos
│   │   ├── clientes/page.tsx       # CRM
│   │   ├── productos/page.tsx      # CRUD productos
│   │   └── envios/page.tsx         # Gestión envíos
│   └── api/
│       ├── checkout/route.ts       # Stripe checkout
│       ├── webhook/route.ts        # Stripe webhooks
│       └── tracking/route.ts       # Tracking envíos
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── CheckoutForm.tsx
│   └── TrackingStatus.tsx
├── prisma/
│   └── schema.prisma               # Schema de BD
├── lib/
│   ├── stripe.ts                   # Config Stripe
│   ├── db.ts                       # Config PlanetScale
│   └── email.ts                    # Config Resend
└── public/
    └── images/productos/           # Fotos productos
```

---

## 🛒 Funcionalidades de la Tienda

### Storefront (Lo que ve el cliente)

#### Landing Page
- Hero con imagen de la Z900 y la cúpula
- Propuesta de valor: "Carbono forjado real, no imitaciones"
- Testimonios de clientes
- Video de instalación (opcional)
- CTA a catálogo

#### Catálogo
- Grid de productos con imagen, nombre, precio
- Filtros: año Z900, tipo de acabado, precio
- Ordenación: precio, novedad, más vendidos

#### Ficha de Producto
- Galería de imágenes con zoom
- Especificaciones técnicas:
  - Material: Carbono forjado 100%
  - Compatible con: Z900 2020-2024 / 2025+
  - Acabado: Glossy / Matte
  - Peso: ~XXX gramos (más ligera que la original)
- Botón "Añadir al carrito"
- Productos relacionados

#### Carrito
- Lista de productos con cantidad
- Eliminar productos
- Resumen: subtotal, envío, IVA, total
- Persistencia (guarda aunque cierres el navegador)

#### Checkout Multi-paso
1. **Datos personales**: nombre, email, teléfono
2. **Dirección de envío**: dirección, ciudad, CP, provincia
3. **Pago**: Stripe Elements (tarjeta, Apple Pay, Google Pay)
4. **Confirmación**: resumen del pedido + email automático

#### Cuenta de Cliente
- Registro / Login (email + contraseña)
- Historial de pedidos
- Direcciones guardadas
- Datos personales editables
- Seguimiento de pedidos activos

---

### Panel de Administración (Lo que ves TÚ)

#### Dashboard
```
┌─────────────────────────────────────────────────┐
│  📊 DASHBOARD                                   │
├─────────────────────────────────────────────────┤
│  VENTAS HOY: €487,00                            │
│  PEDIDOS PENDIENTES: 3                          │
│  CLIENTES NUEVOS HOY: 2                         │
│  ENVÍOS SALIENTES: 1                            │
│                                                 │
│  GRÁFICO VENTAS ULTIMOS 30 DÍAS                 │
│  ACCIONES PENDIENTES                            │
└─────────────────────────────────────────────────┘
```

#### Gestión de Pedidos
- Lista de todos los pedidos con filtros
- Estados: Pendiente → En preparación → Enviado → Entregado
- Al hacer clic en un pedido:
  - Datos del cliente
  - Productos comprados
  - Totales con IVA
  - Botón "Marcar como enviado"
  - Campo para nº de tracking
  - Botón "Enviar email tracking al cliente"

#### CRM / Clientes
- Lista de clientes con búsqueda
- Por cada cliente:
  - Nombre, email, teléfono, dirección
  - Nº total de pedidos
  - Importe total gastado
  - Fecha de primer y último pedido
  - Historial completo de compras
- Exportar a CSV

#### Gestión de Productos
- CRUD de productos
- Variantes por:
  - Año compatible (2020-2024, 2025+)
  - Acabado (Glossy, Matte)
  - Precio
- Upload de imágenes (Cloudinary)
- Stock manual (si aplica)

#### Gestión de Envíos
- Estados del envío visible
- Integración con transportistas (Correos, GLS, DHL)
- Generación de etiquetas
- Tracking automático por email

---

## 📦 Sistema de Envíos y Tracking

### Flujo de Envío

```
PEDIDO CONFIRMADO → PREPARACIÓN → ENVIADO → ENTREGADO
       │                │            │          │
       ▼                ▼            ▼          ▼
  Email auto      Tú empaquetas  Pones tracking  Cliente
  "Confirmado"    y llevas a     en panel y      confirma
                  Correos        email auto      recepción
```

### Estados del Pedido (visto por el cliente)

| Estado | Descripción | Email automático |
|--------|-------------|------------------|
| ✅ Confirmado | Pago recibido | "Tu pedido está confirmado" |
| 📦 En preparación | Estás preparando el paquete | — |
| 🚚 Enviado | En manos del transportista | "Tu pedido va en camino — Tracking: JS123..." |
| 📍 En ruta | En camino a tu dirección | — |
| ✅ Entregado | Recibido | "Tu pedido ha sido entregado" |

### Tracking Online
El cliente accede a `/mi-cuenta/pedidos/147` y ve:
- Timeline visual del estado
- Nº de tracking con enlace al transportista
- Fecha estimada de entrega

---

## 💰 Costes e Inversión

### Infraestructura (Tier Gratis)

| Servicio | Tier Gratis | Limitación |
|----------|------------|------------|
| **Vercel** | Hobby | Sin dominio propio (sería `tutienda.vercel.app`) |
| **PlanetScale** | 5GB | Suficiente para empezar |
| **Cloudinary** | 25k imágenes/mes | Más que suficiente |
| **Stripe** | 0€ fijos | Comisión: 1.4% + 0.25€ por transacción (UE) |
| **Resend** | 100 emails/día | Suficiente para empezar |

### Inversión Necesaria

| Concepto | Coste | Cuándo |
|----------|-------|--------|
| **Dominio** | ~10-15€/año | Ahora. Ej: `carbonoz900.com` |
| **Vercel Pro** (opcional) | 20€/año | Si quieres dominio propio |
| **TOTAL** | **~15-30€/año** | — |

### Coste por Venta (Stripe)
- **1.4% + 0.25€** por transacción en UE
- Ejemplo: Venta de 189€ → Stripe se lleva ~2.90€
- **Margen**: Si fabricas a ~40-60€ y vendes a 189€ → margen ~130-150€

---

## 🧑‍💼 Intervenciones Humanas

### Lo que YO hago (Desarrollo)
- ✅ Escribir todo el código de la tienda
- ✅ Configurar base de datos, autenticación, pagos
- ✅ Integrar Stripe, emails, tracking
- ✅ Crear el panel admin/CRM
- ✅ Hacer el deploy en Vercel
- ✅ Soporte técnico post-deploy

### Lo que TÚ haces (Negocio)

#### Para Arrancar
| Dato Needed | Estado |
|-------------|--------|
| Nombre de marca/tienda | ⏳ Pendiente |
| Logo | ⏳ Pendiente |
| Fotos de los productos (mínimo 5-8 por cúpula) | ⏳ Pendiente |
| Precios de cada modelo | ⏳ Pendiente |
| Modelos de cúpulas (variantes) | ⏳ Pendiente |
| Cuenta Stripe | ⏳ Pendiente |
| Cuenta Vercel | ⏳ Pendiente |
| Dominio | ⏳ Pendiente |

#### Operativa Diaria (cuando haya ventas)
| Tarea | Frecuencia |
|-------|-----------|
| Empaquetar y enviar pedidos | Cada venta |
| Responder clientes | Diario |
| Actualizar inventario (panel admin) | Cuando fabricas |
| Gestionar devoluciones | Caso a caso |
| Publicar en redes sociales | 2-3x/semana |
| Actualizar productos (nuevos modelos) | Cuando saques |

### Lo que se Automatiza
- ✅ Cobro (Stripe cobra y notifica)
- ✅ Email confirmación (automático al comprar)
- ✅ Email tracking (automático al enviar)
- ✅ Notificación admin (avisa cuando hay pedido nuevo)
- ✅ Tracking visible online (cliente ve su pedido sin preguntar)

---

## ⚠️ Limitaciones

### Limitaciones Técnicas
| Limitación | Solución |
|------------|----------|
| Sin inventario real | Sistema manual o integrar con tu proceso de fabricación |
| Envíos manuales | Tú empaquetas y llevas a transportista |
| Sin ERP | Para empezar sobra. Luego integrar Holded o similar |
| Multi-moneda | Empezar solo España/UE |

### Limitaciones de Negocio
| Limitación | Realidad |
|------------|----------|
| Eres tú solo | Fabricas + envías + atiendes + gestionas |
| Escalabilidad | Si vendes 100+/mes, necesitas ayuda |
| Devoluciones | Gestión manual (14 días obligatorio UE) |
| Soporte al cliente | Todo cae en ti |
| Marketing | La tienda no se vende sola |
| Competencia | Puig tiene distribución global |

---

## 📅 Timeline Estimada

| Fase | Duración | Contenido |
|------|----------|-----------|
| **Fase 1 — MVP** | 1-2 semanas | Tienda básica + Checkout + 1-2 productos |
| **Fase 2 — Completa** | +1 semana | CRM, panel admin, tracking envíos |
| **Fase 3 — Premium** | +1 semana | Blog, SEO avanzado, multi-idioma |

**Total hasta tienda funcional**: 2-3 semanas

---

## 🎯 Decisiones Pendientes

- [ ] Nombre de la marca/tienda
- [ ] Dominio a comprar
- [ ] Logo de la marca
- [ ] Fotos de las cúpulas (producto final)
- [ ] Precios de cada modelo/variante
- [ ] Modelos exactos (¿solo Z900 2020-2024? ¿También 2025+?)
- [ ] Política de envíos (¿envío gratis? ¿mínimo para envío gratis?)
- [ ] Política de devoluciones
- [ ] Cuenta Stripe (crear o ya existe?)
- [ ] Cuenta Vercel (crear o ya existe?)

---

## 📁 Archivos del Proyecto

- `PROYECTO.md` — Este archivo (plan completo)
- `DECISIONES.md` — Registro de decisiones tomadas (pendiente)
- `PRODUCTOS.md` — Catálogo de productos y variantes (pendiente)
- `CONTENIDO.md` — Textos para la web (pendiente)

---

*Última actualización: 4 julio 2026*
