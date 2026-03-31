import axios from 'axios';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio Sandbox default

/**
 * Send a WhatsApp message via Twilio API
 * @param {string} toPhone - Customer phone number in international format (e.g. +905551234567)
 * @param {string} message - Message text to send
 */
export const sendWhatsAppMessage = async (toPhone, message) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log('[WhatsApp] Twilio credentials not configured. Skipping message.');
    console.log(`[WhatsApp SIMULATION] To: ${toPhone}\nMessage: ${message}`);
    return { simulated: true, to: toPhone, message };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append('From', TWILIO_WHATSAPP_FROM);
    formData.append('To', `whatsapp:${toPhone}`);
    formData.append('Body', message);

    const response = await axios.post(url, formData, {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log(`[WhatsApp] Message sent to ${toPhone}: SID ${response.data.sid}`);
    return response.data;
  } catch (error) {
    console.error('[WhatsApp] Send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Build the notification message based on order status
 */
export const buildStatusMessage = (orderNumber, status, customerName) => {
  const greeting = `Merhaba ${customerName || 'Değerli Müşterimiz'},`;

  if (status === 'IN_PRODUCTION') {
    return (
      `${greeting}\n\n` +
      `✅ *${orderNumber}* numaralı siparişiniz onaylandı ve üretime alındı!\n\n` +
      `🏭 Siparişiniz ustalı ellerle hazırlanıyor. Tamamlandığında tekrar bilgilendireceğiz.\n\n` +
      `📞 Sorularınız için: +90 551 928 30 40\n` +
      `— Kareyel İş Elbiseleri`
    );
  }

  if (status === 'COMPLETED') {
    return (
      `${greeting}\n\n` +
      `🎉 *${orderNumber}* numaralı siparişiniz tamamlandı!\n\n` +
      `📦 Ürünleriniz hazır. Teslimat ile ilgili iletişime geçeceğiz.\n\n` +
      `📞 Sorularınız için: +90 551 928 30 40\n` +
      `— Kareyel İş Elbiseleri`
    );
  }

  if (status === 'PENDING') {
    return (
      `${greeting}\n\n` +
      `🛍️ Siparişiniz başarıyla alındı! Sipariş No: *${orderNumber}*\n\n` +
      `⏳ Admin onayından sonra üretime geçilecektir. Sizi bilgilendireceğiz.\n\n` +
      `📞 Sorularınız için: +90 551 928 30 40\n` +
      `— Kareyel İş Elbiseleri`
    );
  }

  return `${greeting}\n\nSipariş durumunuz güncellendi: *${orderNumber}* → ${status}`;
};
