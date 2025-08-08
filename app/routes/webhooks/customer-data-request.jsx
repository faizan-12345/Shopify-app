// app/routes/webhooks/customer-data-request.jsx
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  // Verify HMAC here (optional but recommended)
  const body = await request.text();
  console.log("Customer Data Request:", body);

  return new Response("Customer data request received", { status: 200 });
};
