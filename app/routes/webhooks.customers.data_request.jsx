import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
    
    // Handle customer data request
    // You should implement logic to gather customer data and respond accordingly
    // This is required for GDPR compliance
    
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log("Webhook verification failed:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};