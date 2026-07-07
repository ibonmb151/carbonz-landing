import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Política de Privacidad — CarbonZ',
  description:
    'Política de privacidad de CarbonZ. Información sobre el tratamiento de datos personales.',
}

const sections = [
  {
    title: '1. Responsable del tratamiento',
    body: `El responsable del tratamiento de los datos personales recogidos en este sitio web es:

**CarbonZ**
Ibón Jon Mariscal
Email: carbonz.vercel.app@gmail.com

En adelante, "CarbonZ" o "el Responsable".`,
  },
  {
    title: '2. Datos que recopilamos',
    body: `En el marco de la prestación de nuestros servicios, recopilamos los siguientes datos personales:

- **Datos identificativos**: nombre y apellidos
- **Datos de contacto**: dirección de correo electrónico
- **Datos de envío**: dirección postal, código postal, ciudad y país
- **Datos de pago**: información de tarjeta de crédito/débito (procesada exclusivamente a través de Stripe; CarbonZ no almacena datos de pago)
- **Datos de navegación**: dirección IP, tipo de navegador, páginas visitadas (mediante cookies técnicas)`,
  },
  {
    title: '3. Finalidad del tratamiento',
    body: `Tus datos personales son tratados con las siguientes finalidades:

- **Gestión de pedidos**: procesar, preparar y enviar los productos adquiridos
- **Comunicaciones comerciales**: enviar confirmaciones de pedido, actualizaciones de envío y comunicaciones relacionadas con tu compra
- **Atención al cliente**: responder a consultas, solicitudes y reclamaciones
- **Cumplimiento legal**: obligaciones fiscales, contables y legales

No realizamos profiling ni decisiones automatizadas con tus datos.`,
  },
  {
    title: '4. Base legal del tratamiento',
    body: `El tratamiento de tus datos se basa en:

- **Ejecución del contrato** (art. 6.1.b RGPD): el tratamiento es necesario para la prestación del servicio de venta y envío del producto adquirido
- **Obligación legal** (art. 6.1.c RGPD): conservación de facturas y registros contables según la normativa fiscal española
- **Interés legítimo** (art. 6.1.f RGPD): prevención de fraude y mejora de nuestros servicios`,
  },
  {
    title: '5. Conservación de los datos',
    body: `Tus datos personales serán conservados durante los siguientes plazos:

- **Datos de pedido**: 6 años desde la última transacción, en cumplimiento de las obligaciones fiscales y contables (Ley General Tributaria, art. 66)
- **Datos de navegación**: hasta 12 meses
- **Solicitudes de atención al cliente**: hasta la resolución de la solicitud, y 2 años adicionales

Una vez finalizado el plazo de conservación, los datos serán eliminados de forma segura.`,
  },
  {
    title: '6. Tus derechos',
    body: `De conformidad con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), tienes derecho a:

- **Acceso**: conocer qué datos personales tenemos sobre ti
- **Rectificación**: solicitar la corrección de datos inexactos
- **Supresión**: solicitar la eliminación de tus datos ("derecho al olvido")
- **Oposición**: oponerte al tratamiento de tus datos para fines directamente comerciales
- **Limitación**: solicitar la limitación del tratamiento en determinadas circunstancias
- **Portabilidad**: recibir tus datos en formato estructurado y de uso común

Para ejercer estos derechos, envía un email a **carbonz.vercel.app@gmail.com** con una copia de tu documento de identidad.

También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en https://www.aepd.es.`,
  },
  {
    title: '7. Destinatarios de los datos',
    body: `Tus datos pueden ser comunicados a los siguientes terceros:

- **Stripe, Inc.** (procesamiento de pagos): tratamiento necesario para la ejecución del contrato de compraventa. Stripe actúa como encargado del tratamiento. Más información: https://stripe.com/privacy
- **Vercel, Inc.** (alojamiento web): los datos se alojan en servidores de Vercel dentro de la Unión Europea. Más información: https://vercel.com/legal/privacy-policy
- **Google LLC** (email y analytics): utilizando Gmail para comunicaciones y Google Analytics para análisis de tráfico web. Más información: https://policies.google.com/privacy

No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo sin las garantías adecuadas (cláusulas contractuales estándar u otros mecanismos del art. 46 RGPD).`,
  },
  {
    title: '8. Cookies',
    body: `CarbonZ utiliza únicamente **cookies técnicas** necesarias para el funcionamiento de la tienda:

- **Cookie de sesión**: necesaria para mantener el estado de tu carrito de compra
- **Cookie de aceptación**: almacena tu preferencia sobre el uso de cookies

No utilizamos cookies de análisis, publicitarias ni de rastreo. No se produce ningún perfilado del usuario.

Para más información, consulta nuestra Política de Privacidad en su totalidad o escríbenos a carbonz.vercel.app@gmail.com.`,
  },
  {
    title: '9. Seguridad de los datos',
    body: `CarbonZ ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de tus datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta el estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a los que están expuestos.

Estas medidas incluyen:

- Comunicación cifrada mediante SSL/TLS (HTTPS)
- Procesamiento de pagos a través de Stripe (PCI DSS Level 1)
- Acceso restringido a datos personales
- Monitorización y auditoría periódica`,
  },
  {
    title: '10. Cambios en esta política',
    body: `Nos reservamos el derecho a modificar esta Política de Privacidad para adaptarla a novedades legislativas, jurisprudenciales o por cualquier otro motivo.

Te notificaremos cualquier cambio relevante a través de correo electrónico o mediante un aviso destacado en nuestra tienda.

**Última actualización**: 7 de julio de 2026`,
  },
]

export default function PoliticaPrivacidad() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'var(--white)',
        fontFamily: 'var(--font)',
      }}
    >
      <ScrollProgress />

      {/* Nav pill */}
      <nav className="nav-pill visible">
        <Link href="/#producto">Producto</Link>
        <Link href="/#detalles">Detalles</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/#comprar" className="pill-cta">
          Visitar tienda
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '180px 48px 80px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--green)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          Política de Privacidad
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--gray-500)',
            marginBottom: 8,
          }}
        >
          Última actualización: 7 de julio de 2026
        </p>
      </section>

      {/* Content */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 48px 128px',
        }}
      >
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--gray-400)',
            lineHeight: 1.8,
            marginBottom: 48,
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          En CarbonZ nos tomamos tu privacidad muy en serio. Esta Política de
          Privacidad describe cómo recopilamos, usamos y protegemos tu
          información personal cuando utilizas nuestra tienda en línea y
          adquires nuestros productos.
        </p>

        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 16,
                letterSpacing: '-0.02em',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--gray-400)',
                lineHeight: 1.8,
              }}
            >
              {section.body.split('\n\n').map((paragraph, j) => {
                // Handle bold text with ** markers
                const parts = paragraph.split(/\*\*(.*?)\*\*/g)
                return (
                  <p key={j} style={{ marginBottom: 16 }}>
                    {parts.map((part, k) =>
                      k % 2 === 1 ? (
                        <strong key={k} style={{ color: 'var(--white)' }}>
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 48px',
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-700)' }}>
            © 2026 CarbonZ
          </span>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link
              href="/"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Tienda
            </Link>
            <Link
              href="/blog"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Blog
            </Link>
            <Link
              href="/politica-privacidad"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terminos"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
