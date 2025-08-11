

// // app/routes/api.save-token.jsx
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { saveToken, getAllTokens } from "../utils/tokenStorage";
// import { saveRushrrToken } from "../utils/rushrrToken";

// export const action = async ({ request }) => {
//   if (request.method !== "POST") {
//     return json({ error: `Method ${request.method} not allowed` }, { status: 405 });
//   }

//   try {
//     console.log("🔄 Starting token save process...");

//     const { session } = await authenticate.admin(request);
//     const shop = String(session.shop);
//     console.log("✅ Session authenticated for shop:", shop);

//     const accessToken = session.accessToken;
//     if (!accessToken) {
//       return json({ error: "Access token is missing from session" }, { status: 400 });
//     }

//     // Read Rushrr token from request body (or use fixed for tests)
//     const requestBody = await request.json();
//     const rushrrToken = requestBody?.rushrrToken || "ba926b1d..."; // replace with actual or pass in body

//     // Save Shopify access token (ensure saveToken expects shop string)
//     await saveToken(shop, accessToken);
//     console.log("✅ Shopify access token saved for shop:", shop);

//     // Save Rushrr token per shop
//     if (rushrrToken) {
//       await saveRushrrToken(shop, rushrrToken);
//       console.log("✅ Rushrr token saved for shop:", shop);
//     } else {
//       console.log("⚠️ No Rushrr token provided in request body — skipped saving Rushrr token");
//     }

//     await getAllTokens();

//     return json({
//       success: true,
//       message: `Tokens saved successfully${rushrrToken ? " (Shopify + Rushrr)" : " (Shopify only)"}`,
//       shop,
//     });
//   } catch (err) {
//     console.error("❌ Error in save-token action:", err);
//     return json(
//       { error: "Failed to save token", details: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : undefined },
//       { status: 500 }
//     );
//   }
// };


import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { saveToken, getAllTokens } from "../utils/tokenStorage";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { error: `Method ${request.method} not allowed` },
      { status: 405 }
    );
  }

  try {
    console.log("🔄 Starting token save process...");
    
    const { session } = await authenticate.admin(request);
    console.log("✅ Session authenticated for shop:", session.shop);
    
    const requestBody = await request.json();
    console.log("📝 Request body:", requestBody);
    
    const { token } = requestBody;

    if (!token) {
      console.log("❌ No token provided in request");
      return json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    console.log("🔑 Attempting to save token for shop:", session.shop);
    console.log("🔑 Token to save:", token);
    
    // 🔑 Save the API token in memory
    const success = saveToken(session.shop, token);
    
    if (success) {
      console.log("✅ Token saved successfully for shop:", session.shop);
      
      // Log all tokens for debugging
      getAllTokens();
      
      return json({ 
        success: true, 
        message: "Token saved successfully",
        shop: session.shop
      });
    } else {
      console.log("❌ Failed to save token");
      throw new Error("saveToken function returned false");
    }
  } catch (err) {
    console.error("❌ Error in save-token action:", err);
    console.error("❌ Error stack:", err.stack);
    return json(
      { 
        error: "Failed to save token", 
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      { status: 500 }
    );
  }
};