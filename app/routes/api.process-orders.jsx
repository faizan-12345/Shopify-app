// import { json } from "@remix-run/node";
// import { authenticate, apiVersion } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage";
// import axios from "axios";

// // Enhanced CORS headers for extension compatibility
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
//   "Access-Control-Allow-Credentials": "true",
//   "Access-Control-Max-Age": "86400",
// };

// // Handle CORS preflight
// export const loader = ({ request }) => {
//   console.log("🔄 CORS preflight request received for process-orders");
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// };

// // Main order processing endpoint
// export const action = async ({ request }) => {
//   console.log("📨 Process orders request received");
//   console.log("Method:", request.method);
//   console.log("URL:", request.url);
//   console.log("Headers:", Object.fromEntries(request.headers.entries()));

//   if (request.method !== "POST") {
//     console.log("❌ Method not allowed:", request.method);
//     return json(
//       { error: `Method ${request.method} not allowed` },
//       { status: 405, headers: corsHeaders }
//     );
//   }

//   try {
//     // Parse request body first
//     let requestBody;
//     try {
//       requestBody = await request.json();
//       console.log("📦 Request body:", requestBody);
//     } catch (parseError) {
//       console.error("❌ Failed to parse request body:", parseError);
//       return json(
//         {
//           success: false,
//           error: "Invalid JSON in request body",
//           details: parseError.message
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }
    
//     const { orderIds } = requestBody;
    
//     if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
//       return json(
//         { 
//           success: false,
//           error: "Invalid or missing orderIds. Expected array of order IDs." 
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     console.log("🔐 Authenticating request...");
    
//     // Authenticate the session
//     const { session } = await authenticate.admin(request);
//     const { shop, accessToken } = session;
    
//     console.log("✅ Authentication successful for shop:", shop);
    
//     // Get Rushrr API token
//     const rushrrApiToken = getToken(shop);
    
//     if (!rushrrApiToken) {
//       console.log("❌ No Rushrr API token found");
//       return json(
//         { 
//           success: false,
//           error: "Rushrr API token not found. Please configure your token in the app settings." 
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     console.log("🔑 Token found, processing orders:", orderIds);

//     // Process each order
//     const results = [];
//     const errors = [];

//     for (const orderId of orderIds) {
//       try {
//         console.log(`📥 Fetching order ${orderId} from Shopify...`);
//         console.log(`🔗 Using API version: ${apiVersion}`);
//         console.log(`🔗 Full URL: https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`);

//         // Try GraphQL API first (better for protected customer data)
//         console.log(`🔄 Trying GraphQL API for order ${orderId}...`);

//         const graphqlQuery = {
//           query: `
//             query getOrder($id: ID!) {
//               order(id: $id) {
//                 id
//                 name
//                 createdAt
//                 updatedAt
//                 email
//                 phone
//                 totalPriceSet {
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 customer {
//                   id
//                   firstName
//                   lastName
//                   email
//                   phone
//                 }
//                 shippingAddress {
//                   firstName
//                   lastName
//                   address1
//                   address2
//                   city
//                   province
//                   country
//                   zip
//                   phone
//                 }
//                 billingAddress {
//                   firstName
//                   lastName
//                   address1
//                   address2
//                   city
//                   province
//                   country
//                   zip
//                   phone
//                 }
//                 lineItems(first: 100) {
//                   edges {
//                     node {
//                       id
//                       title
//                       quantity
//                       variant {
//                         id
//                         title
//                         sku
//                         price
//                       }
//                       product {
//                         id
//                         title
//                         vendor
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           `,
//           variables: {
//             id: `gid://shopify/Order/${orderId}`,
//           },
//         };

//         let shopifyResponse;
//         let order;

//         try {
//           shopifyResponse = await axios.post(
//             `https://${shop}/admin/api/${apiVersion}/graphql.json`,
//             JSON.stringify(graphqlQuery),
//             {
//               headers: {
//                 "X-Shopify-Access-Token": accessToken,
//                 "Content-Type": "application/json",
//               },
//               timeout: 10000,
//             }
//           );

//           if (shopifyResponse.data.data?.order) {
//             console.log(`✅ GraphQL API successful for order ${orderId}`);
//             order = shopifyResponse.data.data.order;

//             // Convert GraphQL format to REST format for compatibility
//             order = {
//               id: orderId,
//               order_number: order.name?.replace('#', '') || orderId,
//               email: order.email,
//               phone: order.phone,
//               total_price: order.totalPriceSet?.shopMoney?.amount || "0.00",
//               currency: order.totalPriceSet?.shopMoney?.currencyCode || "USD",
//               created_at: order.createdAt,
//               updated_at: order.updatedAt,
//               customer: order.customer ? {
//                 id: order.customer.id,
//                 first_name: order.customer.firstName,
//                 last_name: order.customer.lastName,
//                 email: order.customer.email,
//                 phone: order.customer.phone,
//               } : null,
//               shipping_address: order.shippingAddress,
//               billing_address: order.billingAddress,
//               line_items: order.lineItems?.edges?.map(edge => ({
//                 id: edge.node.id,
//                 title: edge.node.title,
//                 quantity: edge.node.quantity,
//                 variant_id: edge.node.variant?.id,
//                 variant_title: edge.node.variant?.title,
//                 sku: edge.node.variant?.sku,
//                 price: edge.node.variant?.price,
//                 product_id: edge.node.product?.id,
//                 product_title: edge.node.product?.title,
//                 vendor: edge.node.product?.vendor,
//               })) || [],
//             };
//           } else {
//             throw new Error('Order not found in GraphQL response');
//           }
//         } catch (graphqlError) {
//           console.log(`⚠️ GraphQL failed, trying REST API: ${graphqlError.message}`);

//           try {
//             // Fallback to REST API
//             shopifyResponse = await axios.get(
//               `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`,
//               {
//                 headers: {
//                   "X-Shopify-Access-Token": accessToken,
//                   "Content-Type": "application/json",
//                 },
//                 timeout: 10000,
//               }
//             );

//             order = shopifyResponse.data.order;
//             console.log(`✅ REST API successful for order ${orderId}`);
//           } catch (restError) {
//             console.log(`❌ Both GraphQL and REST failed for order ${orderId}`);
//             console.log(`GraphQL error: ${graphqlError.message}`);
//             console.log(`REST error: ${restError.message}`);

//             // If both fail, create a minimal order object for processing
//             console.log(`🔄 Creating minimal order object for processing...`);
//             order = {
//               id: orderId,
//               order_number: orderId,
//               email: "unknown@example.com",
//               phone: null,
//               total_price: "0.00",
//               currency: "USD",
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//               customer: null,
//               shipping_address: null,
//               billing_address: null,
//               line_items: [],
//               _api_access_limited: true, // Flag to indicate limited data
//             };
//           }
//         }
        
//         if (!order) {
//           throw new Error(`Order ${orderId} not found`);
//         }

//         console.log(`✅ Order ${orderId} fetched successfully`);

//         // Prepare payload for external API
//         const orderPayload = {
//           shopifyStoreUrl: `https://${shop}`,
//           orders: [{
//             ...order,
//             orderReferenceNumber: String(order.order_number),
//           }],
//         };

//         console.log(`📤 Sending order ${orderId} to external API...`);
        
//         // Send to external API
//         const externalResponse = await axios.post(
//           'https://backend.rushr-admin.com/api/orders/create-order',
//           orderPayload,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${rushrrApiToken}`,
//             },
//             timeout: 15000,
//           }
//         );

//         console.log(`✅ Order ${orderId} sent successfully`);
//         results.push({
//           orderId,
//           success: true,
//           orderNumber: order.order_number,
//           externalResponse: externalResponse.data,
//         });

//       } catch (error) {
//         console.error(`❌ Error processing order ${orderId}:`, {
//           message: error.message,
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//           headers: error.response?.headers,
//           url: error.config?.url,
//         });
//         errors.push({
//           orderId,
//           error: error.message,
//           details: {
//             status: error.response?.status,
//             statusText: error.response?.statusText,
//             data: error.response?.data,
//             url: error.config?.url,
//           },
//         });
//       }
//     }

//     const successCount = results.length;
//     const errorCount = errors.length;
    
//     console.log(`📊 Processing complete: ${successCount} success, ${errorCount} errors`);

//     return json(
//       {
//         success: successCount > 0,
//         message: `Processed ${orderIds.length} orders: ${successCount} successful, ${errorCount} failed`,
//         results: {
//           successful: results,
//           failed: errors,
//           summary: {
//             total: orderIds.length,
//             successful: successCount,
//             failed: errorCount,
//           }
//         }
//       },
//       { 
//         status: 200,
//         headers: corsHeaders 
//       }
//     );

//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     return json(
//       { 
//         success: false,
//         error: "Internal server error",
//         details: err.message 
//       },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };



















// import { json } from "@remix-run/node";
// import { authenticate, apiVersion } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage";
// import axios from "axios";

// // Enhanced CORS headers
// const corsHeaders = (headers = {}) => ({
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
//   "Access-Control-Allow-Credentials": "true",
//   "Access-Control-Max-Age": "86400",
//   ...headers
// });

// // Handle CORS preflight
// export const loader = ({ request }) => {
//   console.log("🔄 CORS preflight request received for process-orders");
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders(),
//   });
// };

// // Main order processing endpoint
// export const action = async ({ request }) => {
//   console.log("📨 Process orders request received");
//   console.log("Method:", request.method);
//   console.log("URL:", request.url);
//   console.log("Headers:", Object.fromEntries(request.headers.entries()));

//   if (request.method !== "POST") {
//     console.log("❌ Method not allowed:", request.method);
//     return json(
//       { error: `Method ${request.method} not allowed` },
//       { status: 405, headers: corsHeaders() }
//     );
//   }

//   try {
//     // Parse request body
//     const requestBody = await request.json();
//     console.log("📦 Request body:", requestBody);
    
//     const { orderIds } = requestBody;
    
//     if (!orderIds || !Array.isArray(orderIds)) {
//       return json(
//         { 
//           success: false,
//           error: "Invalid or missing orderIds. Expected array of order IDs." 
//         },
//         { status: 400, headers: corsHeaders() }
//       );
//     }

//     console.log("🔐 Authenticating request...");
    
//     // Authenticate the session
//     const { session } = await authenticate.admin(request);
//     const { shop, accessToken } = session;
    
//     console.log("✅ Authentication successful for shop:", shop);
    
//     // Get Rushrr API token
//     const rushrrApiToken = getToken(shop);
    
//     if (!rushrrApiToken) {
//       console.log("❌ No Rushrr API token found");
//       return json(
//         { 
//           success: false,
//           error: "Rushrr API token not found. Please configure your token in the app settings." 
//         },
//         { status: 400, headers: corsHeaders() }
//       );
//     }

//     console.log("🔑 Token found, processing orders:", orderIds);

//     // Process each order
//     const results = [];
//     const errors = [];

//     for (const orderId of orderIds) {
//       try {
//         console.log(`📥 Fetching order ${orderId} from Shopify...`);
        
//         // First try REST API (more reliable for basic order data)
//         let order;
//         try {
//           const restResponse = await axios.get(
//             `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`,
//             {
//               headers: {
//                 "X-Shopify-Access-Token": accessToken,
//                 "Content-Type": "application/json",
//               },
//               timeout: 10000,
//             }
//           );
          
//           order = restResponse.data.order;
//           console.log(`✅ REST API successful for order ${orderId}`);
//         } catch (restError) {
//           console.log(`⚠️ REST API failed, trying GraphQL: ${restError.message}`);
          
//           // Fallback to GraphQL
//           try {
//             const graphqlQuery = {
//               query: `
//                 query getOrder($id: ID!) {
//                   order(id: $id) {
//                     id
//                     name
//                     email
//                     phone
//                     totalPriceSet {
//                       shopMoney {
//                         amount
//                         currencyCode
//                       }
//                     }
//                     shippingAddress {
//                       firstName
//                       lastName
//                       address1
//                       address2
//                       city
//                       province
//                       country
//                       zip
//                       phone
//                     }
//                     lineItems(first: 100) {
//                       edges {
//                         node {
//                           id
//                           title
//                           quantity
//                           variant {
//                             id
//                             title
//                             sku
//                             price
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               `,
//               variables: {
//                 id: `gid://shopify/Order/${orderId}`,
//               },
//             };

//             const graphqlResponse = await axios.post(
//               `https://${shop}/admin/api/${apiVersion}/graphql.json`,
//               graphqlQuery,
//               {
//                 headers: {
//                   "X-Shopify-Access-Token": accessToken,
//                   "Content-Type": "application/json",
//                 },
//                 timeout: 10000,
//               }
//             );

//             const graphqlOrder = graphqlResponse.data.data?.order;
//             if (!graphqlOrder) {
//               throw new Error('Order not found in GraphQL response');
//             }

//             // Convert GraphQL to REST-like format
//             order = {
//               id: orderId,
//               order_number: graphqlOrder.name?.replace('#', '') || orderId,
//               email: graphqlOrder.email,
//               phone: graphqlOrder.phone,
//               total_price: graphqlOrder.totalPriceSet?.shopMoney?.amount || "0.00",
//               currency: graphqlOrder.totalPriceSet?.shopMoney?.currencyCode || "USD",
//               shipping_address: graphqlOrder.shippingAddress,
//               line_items: graphqlOrder.lineItems?.edges?.map(edge => ({
//                 id: edge.node.id,
//                 title: edge.node.title,
//                 quantity: edge.node.quantity,
//                 variant_id: edge.node.variant?.id,
//                 variant_title: edge.node.variant?.title,
//                 sku: edge.node.variant?.sku,
//                 price: edge.node.variant?.price,
//               })) || [],
//               _graphql_fallback: true,
//             };
//             console.log(`✅ GraphQL fallback successful for order ${orderId}`);
//           } catch (graphqlError) {
//             console.log(`❌ Both REST and GraphQL failed for order ${orderId}`);
//             throw new Error(`Failed to fetch order: ${graphqlError.message}`);
//           }
//         }

//         if (!order) {
//           throw new Error(`Order ${orderId} data not available`);
//         }

//         console.log(`✅ Order ${orderId} fetched successfully`);

//         // Prepare payload for external API
//         const orderPayload = {
//           shopifyStoreUrl: `https://${shop}`,
//           orders: [{
//             shopifyOrderId: order.id,
//             orderReferenceNumber: order.order_number || order.id,
//             customerEmail: order.email || "no-email@example.com",
//             customerPhone: order.phone || "",
//             totalAmount: order.total_price || "0.00",
//             currency: order.currency || "USD",
//             shippingAddress: order.shipping_address || {},
//             lineItems: order.line_items || [],
//           }],
//         };

//         console.log(`📤 Sending order ${orderId} to external API...`);
        
//         // Send to external API
//         const externalResponse = await axios.post(
//           'https://backend.rushr-admin.com/api/orders/create-order',
//           orderPayload,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${rushrrApiToken}`,
//             },
//             timeout: 15000,
//           }
//         );

//         if (externalResponse.data?.success === false) {
//           throw new Error(externalResponse.data.message || "External API rejected the order");
//         }

//         console.log(`✅ Order ${orderId} sent successfully`);
//         results.push({
//           orderId,
//           success: true,
//           orderNumber: order.order_number || order.id,
//           externalResponse: externalResponse.data,
//         });

//       } catch (error) {
//         console.error(`❌ Error processing order ${orderId}:`, error);
//         errors.push({
//           orderId,
//           error: error.message,
//           details: error.response?.data || error.stack,
//         });
//       }
//     }

//     console.log(`📊 Processing complete: ${results.length} success, ${errors.length} errors`);

//     return json(
//       {
//         success: results.length > 0,
//         processed: results.length,
//         failed: errors.length,
//         results,
//         errors,
//       },
//       { 
//         status: results.length > 0 ? 200 : 400,
//         headers: corsHeaders({
//           "Content-Type": "application/json",
//         }),
//       }
//     );

//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     return json(
//       { 
//         success: false,
//         error: "Internal server error",
//         details: err.message 
//       },
//       { status: 500, headers: corsHeaders() }
//     );
//   }
// };






// import { json } from "@remix-run/node";
// import { apiVersion } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage";
// import { getValidAccessToken } from "../utils/shopifyAuth";
// import axios from "axios";

// // Enhanced CORS headers for extension compatibility
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
//   "Access-Control-Allow-Credentials": "true",
//   "Access-Control-Max-Age": "86400",
// };

// // Handle CORS preflight
// export const loader = ({ request }) => {
//   console.log("🔄 CORS preflight request received for process-orders");
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// };

// // Main order processing endpoint
// export const action = async ({ request }) => {
//   console.log("📨 Process orders request received");
//   console.log("Method:", request.method);
//   console.log("URL:", request.url);

//   if (request.method !== "POST") {
//     console.log("❌ Method not allowed:", request.method);
//     return json(
//       { error: `Method ${request.method} not allowed` },
//       { status: 405, headers: corsHeaders }
//     );
//   }

//   try {
//     // Parse request body first
//     let requestBody;
//     try {
//       requestBody = await request.json();
//       console.log("📦 Request body:", requestBody);
//     } catch (parseError) {
//       console.error("❌ Failed to parse request body:", parseError);
//       return json(
//         {
//           success: false,
//           error: "Invalid JSON in request body",
//           details: parseError.message
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }
    
//     const { orderIds } = requestBody;
    
//     if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
//       return json(
//         { 
//           success: false,
//           error: "Invalid or missing orderIds. Expected array of order IDs." 
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     console.log("🔐 Authenticating request...");
    
//     // Get the authorization header
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return json(
//         { 
//           success: false,
//           error: "Missing or invalid authorization header" 
//         },
//         { status: 401, headers: corsHeaders }
//       );
//     }

//     // Decode the JWT to get shop domain
//     const token = authHeader.replace('Bearer ', '');
//     let shop;
    
//     try {
//       // Decode JWT without verification (since it's from Shopify extension)
//       const base64Payload = token.split('.')[1];
//       const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
      
//       // Extract shop domain from the JWT
//       if (payload.dest) {
//         shop = payload.dest.replace('https://', '').replace('http://', '');
//       } else if (payload.iss) {
//         shop = payload.iss.replace('https://', '').replace('http://', '').replace('/admin', '');
//       }
      
//       console.log("✅ Shop extracted from JWT:", shop);
//     } catch (decodeError) {
//       console.error("❌ Failed to decode JWT:", decodeError);
//       return json(
//         { 
//           success: false,
//           error: "Invalid JWT token" 
//         },
//         { status: 401, headers: corsHeaders }
//       );
//     }

//     if (!shop) {
//       return json(
//         { 
//           success: false,
//           error: "Could not determine shop from token" 
//         },
//         { status: 401, headers: corsHeaders }
//       );
//     }

//     // Get valid access token for this shop
//     const accessToken = await getValidAccessToken(shop);
    
//     if (!accessToken) {
//       console.error("❌ No valid access token found for shop:", shop);
//       return json(
//         { 
//           success: false,
//           error: "No active session found. Please reinstall the app on your store." 
//         },
//         { status: 401, headers: corsHeaders }
//       );
//     }
    
//     // Get Rushrr API token
//     const rushrrApiToken = await getToken(shop);
    
//     if (!rushrrApiToken) {
//       console.log("❌ No Rushrr API token found for shop:", shop);
//       return json(
//         { 
//           success: false,
//           error: "Rushrr API token not found. Please configure your token in the app settings." 
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     console.log("🔑 Both tokens found, processing orders:", orderIds);

//     // Process each order
//     const results = [];
//     const errors = [];

//     for (const orderId of orderIds) {
//       try {
//         console.log(`📥 Fetching order ${orderId} from Shopify...`);
        
//         let order;
        
//         try {

//           // Use REST API with the access token
//           const shopifyResponse = await axios.get(
//             `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`,
//             {
//               headers: {
//                 "X-Shopify-Access-Token": accessToken,
//                 "Content-Type": "application/json",
//               },
//               timeout: 10000,
//             }
//           );

//           order = shopifyResponse.data.order;
//           console.log(`✅ Order ${orderId} fetched successfully`);
//         } catch (fetchError) {
//           console.error(`❌ Failed to fetch order ${orderId}:`, fetchError.response?.data || fetchError.message);
          
//           // Check if it's an authentication error
//           if (fetchError.response?.status === 401) {
//             throw new Error("Authentication failed. The access token may be expired. Please reinstall the app.");
//           }
          
//           // For other errors, throw to be caught by outer try-catch
//           throw fetchError;
//         }

//         // Prepare payload for external API
//         const orderPayload = {
//           shopifyStoreUrl: `https://${shop}`,
//           orders: [{
//             ...order,
//             orderReferenceNumber: String(order.order_number || order.id),
//           }],
//         };

//         console.log(`📤 Sending order ${orderId} to Rushrr API...`);
        
//         // Send to external API
//         const externalResponse = await axios.post(
//           'https://backend.rushr-admin.com/api/orders/create-order',
//           orderPayload,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${rushrrApiToken}`,
//             },
//             timeout: 15000,
//           }
//         );

//         console.log(`✅ Order ${orderId} sent successfully`);
//         results.push({
//           orderId,
//           success: true,
//           orderNumber: order.order_number || order.id,
//           externalResponse: externalResponse.data,
//         });

//       } catch (error) {
//         console.error(`❌ Error processing order ${orderId}:`, {
//           message: error.message,
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           data: error.response?.data,
//         });
//         errors.push({
//           orderId,
//           error: error.message,
//           details: {
//             status: error.response?.status,
//             statusText: error.response?.statusText,
//             data: error.response?.data,
//           },
//         });
//       }
//     }

//     const successCount = results.length;
//     const errorCount = errors.length;
    
//     console.log(`📊 Processing complete: ${successCount} success, ${errorCount} errors`);

//     return json(
//       {
//         success: successCount > 0,
//         message: `Processed ${orderIds.length} orders: ${successCount} successful, ${errorCount} failed`,
//         results: {
//           successful: results,
//           failed: errors,
//           summary: {
//             total: orderIds.length,
//             successful: successCount,
//             failed: errorCount,
//           }
//         }
//       },
//       { 
//         status: 200,
//         headers: corsHeaders 
//       }
//     );

//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     return json(
//       { 
//         success: false,
//         error: "Internal server error",
//         details: err.message 
//       },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };


import { json } from "@remix-run/node";
import { apiVersion } from "../shopify.server";
import { getValidAccessToken } from "../utils/shopifyAuth";
// import {getToken} from "../utils/tokenStorage";
import { getRushrrToken } from "../utils/rushrrToken"; // ✅ use correct Rushrr token getter
import axios from "axios";

// Enhanced CORS headers for extension compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

// Handle CORS preflight
export const loader = () => {
  console.log("🔄 CORS preflight request received for process-orders");
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const action = async ({ request }) => {
  console.log("📨 Process orders request received");

  if (request.method !== "POST") {
    return json(
      { error: `Method ${request.method} not allowed` },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
      console.log("📦 Request body:", requestBody);
    } catch (err) {
      return json(
        { success: false, error: "Invalid JSON in request body", details: err.message },
        { status: 400, headers: corsHeaders }
      );
    }

    const { orderIds } = requestBody;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return json(
        { success: false, error: "Invalid or missing orderIds. Expected array." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate JWT from header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(
        { success: false, error: "Missing or invalid authorization header" },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let shop;
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());
      shop = payload.dest
        ? payload.dest.replace(/^https?:\/\//, "")
        : payload.iss?.replace(/^https?:\/\//, "").replace("/admin", "");
      console.log("✅ Shop extracted from JWT:", shop);
    } catch {
      return json(
        { success: false, error: "Invalid JWT token" },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!shop) {
      return json(
        { success: false, error: "Could not determine shop from token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // ✅ Get Shopify access token
    const accessToken = await getValidAccessToken(shop);
    if (!accessToken) {
      return json(
        { success: false, error: "No active Shopify session found. Please reinstall app." },
        { status: 401, headers: corsHeaders }
      );
    }

    // ✅ Get Rushrr API token
    // const rushrrApiToken = await getRushrrToken();
    const rushrrApiToken = await getRushrrToken(shop);
    console.log("🔑 Rushrrrrrrrrrrrrrrrrrr API token:", rushrrApiToken);
    if (!rushrrApiToken) {
      return json(
        { success: false, error: "Rushrr API token not found. Please configure in app settings." },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("🔑 Both tokens found, processing orders:", orderIds);

    const results = [];
    const errors = [];

    for (const orderId of orderIds) {
      try {
        // Fetch order from Shopify
        const shopifyResponse = await axios.get(
          // `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`,
          `https://${shop.replace('.myshopify.com', '')}.myshopify.com/admin/api/${apiVersion}/orders/${orderId}.json`,
          {
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );
        const order = shopifyResponse.data.order;

        // Prepare payload for Rushrr
        const orderPayload = {
          shopifyStoreUrl: `https://${shop}`,
          orders: [
            {
              ...order,
              orderReferenceNumber: String(order.order_number || order.id),
            },
          ],
        };

        // Send to Rushrr
        const externalResponse = await axios.post(
          "https://backend.rushr-admin.com/api/orders/create-order",
          orderPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${rushrrApiToken}`,
            },
            timeout: 15000,
          }
        );

        results.push({
          orderId,
          success: true,
          orderNumber: order.order_number || order.id,
          externalResponse: externalResponse.data,
        });
      } catch (error) {
        errors.push({
          orderId,
          error: error.message,
          details: {
            status: error.response?.status,
            data: error.response?.data,
          },
        });
      }
    }

    return json(
      {
        success: results.length > 0,
        message: `Processed ${orderIds.length} orders: ${results.length} successful, ${errors.length} failed`,
        results: { successful: results, failed: errors },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return json(
      { success: false, error: "Internal server error", details: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
};
