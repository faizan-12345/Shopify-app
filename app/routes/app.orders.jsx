
// import { json } from "@remix-run/node";
// import { authenticate, apiVersion } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage";
// import axios from "axios";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export const loader = ({ request }) => {
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// };

// export const action = async ({ request }) => {
//   try {
//     // 1. Parse request
//     const { orderIds } = await request.json();
//     if (!orderIds?.length) {
//       return json({ error: "No order IDs provided" }, { status: 400, headers: corsHeaders });
//     }

//     // 2. Authenticate with Shopify
//     const { session } = await authenticate.admin(request);
//     const { shop, accessToken } = session;
    
//     // console.log(`🔑 Authenticated with shop: ${shop}`);
//     // console.log(`🔄 Using API version: ${apiVersion}`);

//     // // 3. Verify we have a valid access token
//     // if (!accessToken) {
//     //   return json({ error: "Missing access token" }, { status: 401, headers: corsHeaders });
//     // }
// // ===== PASTE DEBUG CODE HERE =====
// console.log("🔍 Session details:", {
//   shop: session.shop,
//   isActive: session.isActive(),
//   expires: session.expires,
//   scopes: session.scopes,
// });

// try {
//   const testUrl = `https://${session.shop}/admin/api/${apiVersion}/shop.json`;
//   const testResponse = await axios.get(testUrl, {
//     headers: {
//       "X-Shopify-Access-Token": session.accessToken,
//     }
//   });
//   console.log("✅ Access token test successful", testResponse.data);
// } catch (testError) {
//   console.error("❌ Access token test failed:", {
//     status: testError.response?.status,
//     data: testError.response?.data,
//   });
//   throw new Error("Shopify access token validation failed");
// }
//     // 4. Get Rushrr token
//     const rushrrToken = getToken(shop);
//     if (!rushrrToken) {
//       return json({ error: "Missing Rushrr token" }, { status: 400, headers: corsHeaders });
//     }

//     // 5. Process orders
//     const results = [];
//     const errors = [];

//     for (const orderId of orderIds) {
//       try {
//         // First try REST API
//         const restUrl = `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`;
//         const restResponse = await axios.get(restUrl, {
//           headers: {
//             "X-Shopify-Access-Token": accessToken,
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         });

//         const order = restResponse.data.order;
//         results.push({
//           orderId,
//           status: "success",
//           data: {
//             id: order.id,
//             name: order.name,
//             email: order.email,
//             total_price: order.total_price,
//           }
//         });

//         // Send to Rushrr API
//         await axios.post(
//           'https://backend.rushr-admin.com/api/orders/create-order',
//           {
//             shopifyStoreUrl: shop,
//             orders: [order],
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${rushrrToken}`,
//               'Content-Type': 'application/json',
//             }
//           }
//         );

//       } catch (error) {
//         console.error(`❌ Error processing order ${orderId}:`, error);
        
//         // Enhanced error information
//         const errorInfo = {
//           orderId,
//           error: error.message,
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           config: {
//             url: error.config?.url,
//             method: error.config?.method,
//             headers: {
//               // Mask sensitive headers
//               'x-shopify-access-token': error.config?.headers?.['X-Shopify-Access-Token'] ? '***redacted***' : undefined,
//               authorization: error.config?.headers?.Authorization ? '***redacted***' : undefined,
//             },
//           },
//         };

//         errors.push(errorInfo);
//       }
//     }

//     return json(
//       {
//         success: errors.length === 0,
//         processed: results.length,
//         failed: errors.length,
//         results,
//         errors,
//       },
//       { 
//         status: errors.length === 0 ? 200 : 207, // 207 Multi-Status
//         headers: corsHeaders 
//       }
//     );

//   } catch (error) {
//     console.error("❌ Top-level error:", error);
//     return json(
//       { 
//         error: "Internal server error",
//         details: error.message 
//       },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };

// routes/api/orders.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getToken } from "../utils/tokenStorage"; // ✅ This is the function that retrieves token for a shop

export async function loader({ request }) {
  try {
    // 🔒 Authenticate the session
    const { session } = await authenticate.admin(request);
    const shop = session.shop;

    // 🔑 Get token for current shop from memory store
    const token = getToken(shop);

    if (!token) {
      return json({ success: false, error: "Token not found for this store" }, { status: 401 });
    }

    // 📨 Fetch orders from external API
    const res = await fetch("https://backend.rushr-admin.com/api/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return json({ success: true, orders: data.orders || [] });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}