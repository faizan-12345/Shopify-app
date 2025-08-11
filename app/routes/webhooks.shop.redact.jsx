import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
    
    // Handle shop data redaction
    // You should implement logic to delete/redact shop data
    // This is required for GDPR compliance
    
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log("Webhook verification failed:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};