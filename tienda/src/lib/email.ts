import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

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
  const shortOrderId = orderId.slice(0, 8)

  const itemList = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(i.price / 100).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <div style="max-width:600px;margin:0 auto;background:#ffffff">
        <div style="background:#000;padding:32px 24px;text-align:center">
          <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.02em">
            Carbon<span style="color:#30d158">Z</span>
          </h1>
        </div>
        <div style="padding:32px 24px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(48,209,88,0.12);display:inline-flex;align-items:center;justify-content:center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <h2 style="text-align:center;font-size:24px;font-weight:800;color:#000;margin:0 0 8px">
            ¡Gracias, ${name}!
          </h2>
          <p style="text-align:center;color:#666;font-size:14px;margin:0 0 24px">
            Tu pedido <strong>${shortOrderId}</strong> está confirmado.
          </p>
          <div style="background:#f5f5f5;border-radius:8px;padding:12px 16px;margin-bottom:24px;text-align:center">
            <span style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">ID del pedido</span><br>
            <span style="color:#000;font-size:14px;font-weight:600;font-family:monospace">${orderId}</span>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="border-bottom:2px solid #000">
                <th style="padding:8px;text-align:left;font-size:12px;font-weight:600;color:#000;text-transform:uppercase">Producto</th>
                <th style="padding:8px;text-align:center;font-size:12px;font-weight:600;color:#000;text-transform:uppercase">Cantidad</th>
                <th style="padding:8px;text-align:right;font-size:12px;font-weight:600;color:#000;text-transform:uppercase">Precio</th>
              </tr>
            </thead>
            <tbody>${itemList}</tbody>
          </table>
          <div style="border-top:2px solid #000;padding-top:16px;margin-bottom:24px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:16px;font-weight:600;color:#000">Total</span>
              <span style="font-size:20px;font-weight:800;color:#000">€${(total / 100).toFixed(2)}</span>
            </div>
          </div>
          <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-bottom:24px">
            <h3 style="font-size:14px;font-weight:600;color:#000;margin:0 0 8px">📦 Información de envío</h3>
            <p style="font-size:13px;color:#666;margin:0;line-height:1.6">
              Envío gratis a toda Europa.<br>
              Recibirás un email con el número de tracking en <strong>3-5 días laborables</strong>.
            </p>
          </div>
          <div style="text-align:center;margin-bottom:16px">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://carbonz.vercel.app'}" 
               style="display:inline-block;background:#000;color:#fff;padding:12px 32px;border-radius:980px;text-decoration:none;font-size:14px;font-weight:600">
              Volver a la tienda
            </a>
          </div>
        </div>
        <div style="padding:24px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:12px;color:#999;margin:0">© ${new Date().getFullYear()} CarbonZ</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await sgMail.send({
      to: email,
      from: 'ibon.mb151@gmail.com',
      subject: `Pedido ${shortOrderId} confirmado ✓`,
      html,
    })
    console.log('Confirmation email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    return { success: false, error }
  }
}
