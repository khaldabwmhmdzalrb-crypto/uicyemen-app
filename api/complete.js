export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid } = req.body || {};
  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "PI_API_KEY is not configured" });
  }

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      }
    );

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to complete payment", details: error.message });
  }
}
