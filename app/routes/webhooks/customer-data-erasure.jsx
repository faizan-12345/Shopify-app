// app/routes/webhooks/customer-data-erasure.jsx
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const body = await request.text();
  console.log("Customer Data Erasure:", body);

  return new Response("Customer data erasure received", { status: 200 });
};
