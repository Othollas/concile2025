export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { to, message } = req.body;

    console.log("to", to)
    console.log("message", message)

    if (!to || !message) return res.status(400).json({ error: "Il manque le destinataire ou le message" });

    try {
        const response = await fetch(`${process.env.TEXTBEE_BASE_URL}/gateway/devices/${process.env.TEXTBEE_DEVICE_ID}/send-sms`, {
            method: "POST",
            headers: {
                // 'Authorization': `Bearer ${process.env.TEXTBEE_API_KEY}`,
                'Content-Type': 'application/json',
                'x-api-key': process.env.TEXTBEE_API_KEY
            },
            body: JSON.stringify({
                recipients: [ to ],       // numéro du destinataire, exemple: "+33612345678"
                message   // ton message
            })
        });

        const data = await response.json()
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur" })
    }
}