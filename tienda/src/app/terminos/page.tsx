import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — CarbonZ',
  description:
    'Términos y condiciones de uso y compraventa de CarbonZ.',
}

const sections = [
  {
    title: '1. Aceptación de los términos',
    body: `Al acceder y utilizar el sitio web de CarbonZ (carbonz.vercel.app) y/o realizar una compra, el usuario acepta íntegramente los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, te rogamos que no utilices este sitio web.

Estos términos pueden ser modificados en cualquier momento. Las modificaciones serán efectivas desde su publicación en el sitio web. El uso continuado del sitio tras dichas modificaciones constituirá la aceptación de las mismas.`,
  },
  {
    title: '2. Información sobre los productos',
    body: `CarbonZ se dedica a la venta de cúpulas de fibra de carbono forjada para la motocicleta Kawasaki Z900.

Las descripciones, imágenes y especificaciones de los productos mostrados en la tienda se proporcionan con la mayor precisión posible. Sin embargo, pueden existir variaciones menores respecto al producto final debido al proceso artesanal de fabricación, ya que cada pieza de carbono forjado presenta un patrón visual único e irrepetible.

Las imágenes del producto son orientativas y pueden diferir ligeramente en color o textura respecto al producto physical.`,
  },
  {
    title: '3. Precios',
    body: `Todos los precios mostrados en la tienda están indicados en **euros (EUR)** e incluyen el **IVA (21%)** según la legislación fiscal española.

CarbonZ se reserva el derecho a modificar los precios en cualquier momento, sin perjuicio de los pedidos ya confirmados.

Los gastos de envío son **gratuitos** para envíos dentro de Europa. Para destinos fuera de Europa, los gastos de envío se calcularán durante el proceso de compra.`,
  },
  {
    title: '4. Proceso de compra y pago',
    body: `Para realizar una compra, el usuario debe:

1. Seleccionar el producto deseado
2. Añadirlo al carrito de compra
3. Completar los datos de envío
4. Proceder al pago a través de Stripe

El pago se realiza de forma segura a través de **Stripe**, que acepta tarjetas de crédito y débito (Visa, Mastercard, American Express). CarbonZ no almacena ni tiene acceso a los datos de tu tarjeta de pago.

El pedido se considerará confirmado una vez recibida la confirmación de pago por parte de Stripe. Recibirás un email de confirmación con los detalles de tu pedido.`,
  },
  {
    title: '5. Envíos',
    body: `El envío es **gratuito** a toda Europa. El plazo estimado de entrega es de **3 a 5 días laborables** desde la confirmación del pedido.

Una vez enviado el producto, recibirás un correo electrónico con el número de seguimiento (tracking) para que puedas localizar tu envío.

CarbonZ no se hace responsable de retrasos imputables a la empresa de transporte o a circunstancias ajenas a nuestro control (fuerza mayor, condiciones climáticas adversas, etc.).`,
  },
  {
    title: '6. Derecho de desistimiento y devoluciones',
    body: `De conformidad con la normativa de consumo de la Unión Europea (Directiva 2011/83/UE), tienes derecho a desistir del contrato en un plazo de **14 días naturales** desde la recepción del producto, sin necesidad de justificar la decisión.

Para ejercer el derecho de desistimiento, debes notificarnos tu decisión mediante declaración inequívoca (correo electrónico a carbonz.vercel.app@gmail.com) antes de que venza el plazo de 14 días.

**Condiciones para la devolución:**

- El producto debe estar en **perfecto estado** (sin usar, sin montar, sin rayaduras ni daños)
- Debe incluir el **embalaje original** completo
- El producto debe ser devuelto a la dirección que te indicaremos
- Los gastos de devolución corren por cuenta del cliente, salvo que el producto tenga un defecto de fabricación

Una vez recibido y verificado el producto devuelto, procederemos al reembolso en un plazo máximo de **14 días naturales** desde la recepción de la devolución. El reembolso se realizará por el mismo medio de pago utilizado en la compra original.`,
  },
  {
    title: '7. Garantía',
    body: `Todos los productos de CarbonZ cuentan con una **garantía legal de 2 años** conforme a la Directiva 1999/44/CE y la legislación española (Real Decreto Legislativo 1/2007).

La garantía cubre defectos de fabricación y defectos materiales que hagan que el producto no se ajuste a lo descrito o no sea apto para su uso habitual.

**No están cubiertos por la garantía:**

- Daños derivados de un uso indebido, negligencia o accidentes
- Desgaste natural por uso normal
- Modificaciones no autorizadas por el cliente
- Daños estéticos menores inherentes al proceso artesanal de fabricación del carbono forjado

Para solicitar una reclamación en garantía, contacta con nosotros en carbonz.vercel.app@gmail.com indicando el número de pedido y una descripción del defecto.`,
  },
  {
    title: '8. Limitación de responsabilidad',
    body: `En ningún caso CarbonZ será responsable por:

- Daños indirectos, pérdidas de beneficios o perjuicios económicos derivados del uso del producto
- Daños derivados de la instalación incorrecta del producto por parte del cliente
- Daños a la motocicleta o a terceros derivados del uso del producto

La responsabilidad máxima de CarbonZ en cualquier caso quedará limitada al **precio total del producto** adquirido.`,
  },
  {
    title: '9. Protección de datos',
    body: `El tratamiento de tus datos personales se rige por nuestra **Política de Privacidad**, que puedes consultar en el siguiente enlace:

[/politica-privacidad](/politica-privacidad)

Al utilizar nuestro sitio web, aceptas el tratamiento de tus datos conforme a lo descrito en dicha política.`,
  },
  {
    title: '10. Legislación aplicable y jurisdicción',
    body: `Los presentes Términos y Condiciones se rigen por la **legislación española**.

Para la resolución de cualquier controversia derivada de la interpretación o ejecución de estos términos, las partes se someten a los Juzgados y Tribunales de **Bilbao (Vizcaya)**, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.

Si eres consumidor, este acuerdo no afecta a los derechos que te correspondan como tal según la legislación applicable en tu lugar de residencia.`,
  },
  {
    title: '11. Contacto',
    body: `Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos a través de:

- **Email**: carbonz.vercel.app@gmail.com
- **WhatsApp**: +34 666 666 666

**Última actualización**: 7 de julio de 2026`,
  },
]

export default function Terminos() {
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
          Términos y Condiciones
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
          Estos Términos y Condiciones regulan la relación entre CarbonZ y los
          usuarios que accedan y/o realicen compras a través del sitio web
          carbonz.vercel.app. Por favor, léelos detenidamente antes de realizar
          una compra.
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
