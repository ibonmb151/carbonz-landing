import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'carbonz.vercel.app@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface OrderConfirmationEmail {
  email: string
  name: string
  orderId: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}

export async function sendOrderConfirmation({
  email,
  name,
  orderId,
  total,
  items,
}: OrderConfirmationEmail) {
  const itemList = items
    .map(
      (i) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:#f5f5f7;font-weight:500">
          ${i.name}
        </td>
        <td style="padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;font-size:15px;color:#8e8e93">
          ×${i.quantity}
        </td>
        <td style="padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;font-size:15px;color:#f5f5f7;font-weight:600">
          €${(i.price / 100).toFixed(2)}
        </td>
      </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111111;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center">
              <div style="margin-bottom:24px">
                <span style="font-size:28px;font-weight:800;color:#f5f5f7;letter-spacing:-0.03em">
                  Carbon<span style="color:#30d158">Z</span>
                </span>
              </div>
              <div style="width:36px;height:36px;border-radius:50%;background:rgba(48,209,88,0.1);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#f5f5f7;letter-spacing:-0.03em;line-height:1.2">
                Pedido confirmado
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#8e8e93">
                Gracias, ${name}
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding:0 40px 32px">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;text-align:center">
                <div style="font-size:11px;color:#636366;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;font-weight:600">
                  N.º de pedido
                </div>
                <div style="font-size:11px;color:#f5f5f7;font-family:'SF Mono',Monaco,Consolas,monospace;font-weight:600;letter-spacing:0.02em;word-break:break-all;line-height:1.6">
                  ${orderId}
                </div>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px">
              <div style="height:1px;background:rgba(255,255,255,0.06)"></div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:32px 40px 0">
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <td style="padding:0 0 12px;font-size:11px;color:#636366;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Producto</td>
                    <td style="padding:0 0 12px;font-size:11px;color:#636366;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;text-align:center">Cant.</td>
                    <td style="padding:0 0 12px;font-size:11px;color:#636366;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;text-align:right">Precio</td>
                  </tr>
                </thead>
                <tbody>
                  ${itemList}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:24px 40px 32px">
              <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:20px"></div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;color:#8e8e93;font-weight:500">Envío</td>
                  <td style="text-align:right;font-size:14px;color:#30d158;font-weight:600">Gratis</td>
                </tr>
                <tr>
                  <td style="padding-top:12px;font-size:14px;color:#8e8e93;font-weight:500">IVA (21%)</td>
                  <td style="padding-top:12px;text-align:right;font-size:14px;color:#f5f5f7;font-weight:500">€${(total * 0.21 / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding-top:16px;font-size:18px;color:#f5f5f7;font-weight:700">Total</td>
                  <td style="padding-top:16px;text-align:right;font-size:22px;color:#f5f5f7;font-weight:800;letter-spacing:-0.02em">€${(total / 100).toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping -->
          <tr>
            <td style="padding:0 40px 32px">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px">
                <div style="margin-bottom:8px">
                  <span style="font-size:14px;color:#f5f5f7;font-weight:600">📦 Envío</span>
                </div>
                <p style="margin:0;font-size:13px;color:#8e8e93;line-height:1.6">
                  Envío gratis a toda Europa.<br>
                  Recibirás un email con el tracking en <strong style="color:#f5f5f7">3-5 días laborables</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://carbonz.vercel.app'}" style="display:inline-block;background:#f5f5f7;color:#0a0a0a;padding:14px 36px;border-radius:980px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.01em">
                Volver a la tienda
              </a>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
          <tr>
            <td style="padding:24px 0;text-align:center">
              <p style="margin:0;font-size:12px;color:#48484a;line-height:1.6">
                © ${new Date().getFullYear()} CarbonZ · Forged Carbon Cupulas
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`

  try {
    await transporter.sendMail({
      from: '"CarbonZ" <carbonz.vercel.app@gmail.com>',
      to: email,
      subject: `Pedido confirmado ✓`,
      html,
    })
    console.log('Confirmation email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

// ─── Tracking Email ────────────────────────────────────────

interface TrackingEmailData {
  email: string
  name: string
  orderId: string
  trackingNumber: string
}

export async function sendTrackingEmail({
  email,
  name,
  orderId,
  trackingNumber,
}: TrackingEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111111;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center">
              <div style="margin-bottom:24px">
                <span style="font-size:28px;font-weight:800;color:#f5f5f7;letter-spacing:-0.03em">
                  Carbon<span style="color:#30d158">Z</span>
                </span>
              </div>
              <div style="width:36px;height:36px;border-radius:50%;background:rgba(48,209,88,0.1);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                  <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#f5f5f7;letter-spacing:-0.03em;line-height:1.2">
                Tu pedido va en camino
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#8e8e93">
                Hola, ${name}
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding:0 40px 32px">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;text-align:center">
                <div style="font-size:11px;color:#636366;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;font-weight:600">
                  N.º de pedido
                </div>
                <div style="font-size:11px;color:#f5f5f7;font-family:'SF Mono',Monaco,Consolas,monospace;font-weight:600;letter-spacing:0.02em;word-break:break-all;line-height:1.6">
                  ${orderId}
                </div>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px">
              <div style="height:1px;background:rgba(255,255,255,0.06)"></div>
            </td>
          </tr>

          <!-- Tracking Number -->
          <tr>
            <td style="padding:32px 40px">
              <div style="background:rgba(48,209,88,0.06);border:1px solid rgba(48,209,88,0.15);border-radius:12px;padding:24px;text-align:center">
                <div style="font-size:11px;color:#30d158;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;font-weight:600">
                  N.º de seguimiento
                </div>
                <div style="font-size:18px;color:#f5f5f7;font-family:'SF Mono',Monaco,Consolas,monospace;font-weight:700;letter-spacing:0.02em;word-break:break-all;line-height:1.6">
                  ${trackingNumber}
                </div>
              </div>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td style="padding:0 40px 32px">
              <p style="margin:0;font-size:14px;color:#8e8e93;line-height:1.7;text-align:center">
                Tu pedido ha sido enviado y ya está en camino.<br>
                Puedes usar el número de seguimiento para rastrear tu envío.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://carbonz.vercel.app'}" style="display:inline-block;background:#f5f5f7;color:#0a0a0a;padding:14px 36px;border-radius:980px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.01em">
                Volver a la tienda
              </a>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
          <tr>
            <td style="padding:24px 0;text-align:center">
              <p style="margin:0;font-size:12px;color:#48484a;line-height:1.6">
                © ${new Date().getFullYear()} CarbonZ · Forged Carbon Cupulas
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`

  try {
    await transporter.sendMail({
      from: '"CarbonZ" <carbonz.vercel.app@gmail.com>',
      to: email,
      subject: `📦 Tu pedido #${orderId.slice(0, 12)} ha sido enviado`,
      html,
    })
    console.log('Tracking email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('Tracking email error:', error)
    return { success: false, error }
  }
}
