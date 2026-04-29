const BASE_SANDBOX = "https://api-m.sandbox.paypal.com";
const BASE_LIVE = "https://api-m.paypal.com";

function baseUrl() {
  return process.env.PAYPAL_MODE === "live" ? BASE_LIVE : BASE_SANDBOX;
}

export async function getPayPalAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("PayPal client id/secret not configured");
  }
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal token: ${t}`);
  }
  const j = (await res.json()) as { access_token: string };
  return j.access_token;
}

export async function createPayPalOrder(
  valueUsd: string,
  customId: string
): Promise<string> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${baseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: customId,
          amount: {
            currency_code: "USD",
            value: valueUsd,
          },
        },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal create: ${t}`);
  }
  const j = (await res.json()) as { id: string };
  return j.id;
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(
    `${baseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal capture: ${t}`);
  }
  return res.json();
}
