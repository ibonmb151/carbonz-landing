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
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS not configured')
    return { success: false, error: 'EmailJS not configured' }
  }

  const shortOrderId = orderId.slice(0, 8)
  const itemList = items
    .map((i) => `${i.name} x${i.quantity} — €${(i.price / 100).toFixed(2)}`)
    .join('\n')

  const templateParams = {
    customerName: name,
    customerEmail: email,
    orderId: shortOrderId,
    total: `€${(total / 100).toFixed(2)}`,
    items: itemList,
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        template_params: templateParams,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('EmailJS error:', text)
      return { success: false, error: text }
    }

    console.log('Confirmation email sent via EmailJS')
    return { success: true }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return { success: false, error }
  }
}
