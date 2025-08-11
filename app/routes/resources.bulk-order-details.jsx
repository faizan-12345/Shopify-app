
// import { json } from "@remix-run/node";
// import { authenticate, apiVersion } from "../../app/shopify.server";
// import { getToken } from "../utils/tokenStorage";
// import axios from "axios";

// // CORS HEADERS - Updated to handle all necessary headers
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "https://extensions.shopifycdn.com",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
//   "Access-Control-Allow-Credentials": "true",
//   "Access-Control-Max-Age": "86400", // 24 hours
// };

// // Handle CORS preflight (OPTIONS) and GET requests
// export const loader = ({ request }) => {
//   console.log("🔄 CORS preflight or GET request received");
//   console.log("Request method:", request.method);
//   console.log("Request headers:", Object.fromEntries(request.headers.entries()));

//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// };

// // Helper to fetch a product by ID
// const fetchProductById = async (shop, accessToken, productId) => {
//   try {
//     console.log("shop", shop);
//     console.log("🔑🔑🔑🔑🔑🔑 accessToken from my custom code right now ", accessToken);
//     console.log("productId", productId);
//     const res = await axios.get(
//       `https://${shop}/admin/api/${apiVersion}/products/${productId}.json`,
//       {
//         headers: {
//           "X-Shopify-Access-Token": accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return res.data.product;
//   } catch (err) {
//     console.warn(`⚠️ Failed to fetch product ${productId}`);
//     return null;
//   }
// };

// // const fetchProductById = async (shop, accessToken, productId) => {
// //   const gqlQuery = {
// //     query: `
// //       query getProduct($id: ID!) {
// //         product(id: $id) {
// //           id
// //           title
// //           handle
// //           vendor
// //           tags
// //           images(first: 1) {
// //             edges {
// //               node {
// //                 originalSrc
// //               }
// //             }
// //           }
// //         }
// //       }`,
// //     variables: {
// //       id: `gid://shopify/Product/${productId}`,
// //     },
// //   };

// //   try {
// //     const res = await axios.post(
// //       `https://${shop}/admin/api/2024-07/graphql.json`,
// //       JSON.stringify(gqlQuery),
// //       {
// //         headers: {
// //           "X-Shopify-Access-Token": accessToken,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     const product = res.data.data.product;
// //     return {
// //       ...product,
// //       image: product.images.edges[0]?.node.originalSrc || null,
// //     };
// //   } catch (err) {
// //     console.warn(`⚠️ Failed to fetch product ${productId}`, err.response?.data || err.message);
// //     return null;
// //   }
// // };

// // const fetchOrderById = async (shop, accessToken, orderId) => {
// //   const gqlQuery = {
// //     query: `
// //       query getOrder($id: ID!) {
// //         order(id: $id) {
// //           id
// //           name
// //           createdAt
// //           totalPriceSet {
// //             shopMoney {
// //               amount
// //               currencyCode
// //             }
// //           }
// //           lineItems(first: 100) {
// //             edges {
// //               node {
// //                 id
// //                 title
// //                 quantity
// //                 product {
// //                   id
// //                   title
// //                 }
// //               }
// //             }
// //           }
// //         }
// //       }
// //     `,
// //     variables: {
// //       id: `gid://shopify/Order/${orderId}`,
// //     },
// //   };

// //   try {
// //     const res = await axios.post(
// //       `https://${shop}/admin/api/2024-07/graphql.json`,
// //       JSON.stringify(gqlQuery),
// //       {
// //         headers: {
// //           "X-Shopify-Access-Token": accessToken,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );
// //     return res.data.data.order;
// //   } catch (err) {
// //     console.error(`❌ Failed to fetch order ${orderId}`, err.response?.data || err.message);
// //     return null;
// //   }
// // };



// // Handle POST to fetch bulk orders
// export const action = async ({ request }) => {
//   console.log("📨 Received request:", request.method);
//   console.log("📨 Request URL:", request.url);
//   console.log("📨 Request headers:", Object.fromEntries(request.headers.entries()));

//   if (request.method !== "POST") {
//     console.log("❌ Method not allowed:", request.method);
//     return json(
//       { error: `Method ${request.method} not allowed` },
//       {
//         status: 405,
//         headers: corsHeaders,
//       }
//     );
//   }

//   try {
//     console.log("🔐 Starting authentication...");
//     const { session } = await authenticate.admin(request);
//     const { shop, accessToken } = session;

//     console.log("🏪 Processing request for shop:", shop);
//     console.log("🔑🔑🔑🔑🔑🔑🔑 Access token available:", !!accessToken);
    
//     // 🔑 Get the saved Rushrr API token from memory store
//     const rushrrApiToken = getToken(shop);
    
//     if (!rushrrApiToken) {
//       console.log("❌ No Rushrr API token found for shop:", shop);
//       return json(
//         { error: "Rushrr API token not found. Please setup the token first." },
//         {
//           status: 400,
//           headers: corsHeaders,
//         }
//       );
//     }
    
//     console.log("🔑 Using Rushrr API token:", rushrrApiToken);

//     const { orderIds } = await request.json();

//     if (!orderIds || !Array.isArray(orderIds)) {
//       return json(
//         { error: "Invalid or missing orderIds" },
//         {
//           status: 400,
//           headers: corsHeaders,
//         }
//       );
//     }

//     console.log("🔁 Fetching orders:", orderIds);
//     console.log("🔑 Using Rushrr API token:", rushrrApiToken);

//     // Step 1: Fetch all orders (using Shopify access token for Shopify API)
//     console.log("🔄 Fetching orders from Shopify API...");
//     const orders = await Promise.all(
//       orderIds.map(async (id) => {
//         try {
//           console.log(`📦 Fetching order ${id} from Shopify...`);
//           const res = await axios.get(
//             `https://${shop}/admin/api/${apiVersion}/orders/${id}.json`,
//             {
//               headers: {
//                 "X-Shopify-Access-Token": accessToken,
//                 "Content-Type": "application/json",
//               },
//               timeout: 10000, // 10 second timeout
//             }
//           );
//           console.log(`✅ Successfully fetched order ${id}`);
//           return res.data.order;
//         } catch (error) {
//           console.error(`❌ Order ${id} failed:`, {
//             status: error?.response?.status,
//             statusText: error?.response?.statusText,
//             data: error?.response?.data,
//             message: error.message
//           });
//           return null;
//         }
//       })
//     );

//     const filteredOrders = orders.filter(Boolean);

//     console.log(`📊 Successfully fetched ${filteredOrders.length} out of ${orderIds.length} orders`);

//     if (filteredOrders.length === 0) {
//       console.log("❌ No orders could be fetched");
//       return json(
//         { error: "No orders could be fetched. Please check order IDs and permissions." },
//         {
//           status: 404,
//           headers: corsHeaders,
//         }
//       );
//     }

//     // Step 2: Collect unique product IDs
//     const productIdSet = new Set();
//     filteredOrders.forEach((order) => {
//       if (order.line_items && Array.isArray(order.line_items)) {
//         order.line_items.forEach((item) => {
//           if (item.product_id) {
//             productIdSet.add(item.product_id);
//           }
//         });
//       }
//     });

//     const uniqueProductIds = Array.from(productIdSet);

//     // Step 3: Fetch product info for each unique product (using Shopify access token)
//     const productMap = {};
//     const productResults = await Promise.all(
//       uniqueProductIds.map(async (pid) => {
//         const product = await fetchProductById(shop, accessToken, pid);
//         if (product) productMap[pid] = product;
//         return product;
//       })
//     );

//     // Step 4: Enrich line_items with product data (e.g., image, vendor, etc.)
//     const enrichedOrders = filteredOrders.map((order) => {
//       const enrichedLineItems = order.line_items.map((item) => {
//         const product = productMap[item.product_id];
//         return {
//           ...item,
//           product_details: product
//             ? {
//                 title: product.title,
//                 vendor: product.vendor,
//                 image: product.image?.src || null,
//                 handle: product.handle,
//                 tags: product.tags,
//               }
//             : null,
//         };
//       });

//       return {
//         ...order,
//         line_items: enrichedLineItems,
//       };
//     });

//     // ✅ Return the data with Rushrr API token instead of Shopify access token
//     return json(
//       {
//         shopifyStoreUrl: shop, // e.g., rushrr.myshopify.com
//         orders: enrichedOrders,
//         token: rushrrApiToken, // 👈 Return the Rushrr API token instead of Shopify access token
//       },
//       { headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("❌ Error:", err.response?.data || err.message);
//     return json(
//       { error: "Bulk fetch failed" },
//       {
//         status: 500,
//         headers: corsHeaders,
//       }
//     );
//   }
// };


import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getToken } from "../utils/tokenStorage";

// Common CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// 👇 This fixes the OPTIONS error
export const loader = () => {
  return new Response("OK", {
    status: 200,
    headers: CORS_HEADERS
  });
};

// 👇 Your action remains as is (CORS already handled in previous response)
export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }



  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: `Method ${request.method} not allowed` }),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    console.log("🔐 Trying Shopify session authentication...");
    
    const { session, admin } = await authenticate.admin(request);

    if (!session) {
      console.log("❌ No Shopify session found");
      return json(
        { error: "No valid Shopify session" },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    console.log("✅ Shopify session found:", session.shop);
    console.log("🔑 Has accessToken:", !!session.accessToken);

    const apiToken = getToken(session.shop);
    if (!apiToken) {
      console.log("❌ No API token found for shop:", session.shop);
      return json(
        {
          error: "No API token configured for this store",
          details: "Please configure your Rushrr API token first"
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    console.log("🔍 Token retrieved:", !!apiToken);

    const { orderIds } = await request.json();
    console.log("🔁 Processing order IDs:", orderIds);

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return json(
        { error: "No order IDs provided" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const debugInfo = {
      requestedIds: orderIds,
      totalRequested: orderIds.length,
      apiVersion: "2024-10",
      shop: session.shop,
      canAccessOrdersApi: !!admin
    };

    const orders = [];
    let successCount = 0;
    let failCount = 0;

    for (const orderId of orderIds) {
      try {
        console.log(`📡 Fetching order ${orderId}...`);

        const response = await admin.rest.resources.Order.find({
          session,
          id: orderId
        });

        if (!response) {
          console.log(`❌ Order ${orderId} not found`);
          failCount++;
          continue;
        }

        const order = response;

        order.orderReferenceNumber = String(order.order_number || order.number);

        if (!order.shipping_address && order.billing_address) {
          console.log(`📦 Using billing address as shipping for ${order.id}`);
          order.shipping_address = { ...order.billing_address };
        }

        orders.push(order);
        successCount++;

        console.log(`✅ Order ${orderId} fetched`, {
          id: order.id,
          name: order.name,
          email: order.customer?.email
        });
      } catch (orderError) {
        console.error(`❌ Failed to fetch order ${orderId}`, orderError);
        failCount++;
      }
    }

    debugInfo.successfullyFetched = successCount;
    debugInfo.failed = failCount;

    if (orders.length === 0) {
      return json(
        {
          error: "Failed to fetch any orders",
          details: "Check if the order IDs are valid and accessible",
          debugInfo
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    console.log(`✅ Fetched ${orders.length} orders`);
    return json(
      {
        orders,
        token: apiToken,
        shopifyStoreUrl: session.shop,
        debugInfo,
        success: true,
        message: `Successfully fetched ${orders.length} orders`
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("❌ Error in bulk-order-details:", error);
    return json(
      {
        error: "Server error",
        details: error.message,
        debugInfo: {
          errorType: error.constructor.name,
          message: error.message
        }
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
};