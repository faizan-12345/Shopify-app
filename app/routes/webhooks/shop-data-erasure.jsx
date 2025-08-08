// app/routes/webhooks/shop-data-erasure.jsx
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const body = await request.text();
  console.log("Shop Data Erasure:", body);

  return new Response("Shop data erasure received", { status: 200 });
};
