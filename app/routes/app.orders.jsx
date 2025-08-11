// import { useLoaderData } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import { Card, Page, DataTable, Button, Badge } from "@shopify/polaris";

// export const loader = async ({ request }) => {
//   const { admin, session } = await authenticate.admin(request);
  
//   const orders = await admin.rest.resources.Order.all({
//     session,
//     status: "any",
//     limit: 50,
//   });

//   return json({ orders: orders.data });
// };

// export default function Orders() {
//   const { orders } = useLoaderData();

//   const rows = orders.map((order) => [
//     order.order_number,
//     order.customer?.first_name + " " + order.customer?.last_name,
//     `$${order.total_price}`,
//     <Badge status={order.fulfillment_status === "fulfilled" ? "success" : "attention"}>
//       {order.fulfillment_status || "Unfulfilled"}
//     </Badge>,
//     <Button size="small" onClick={() => sendToLogistics(order.id)}>
//       Send to Logistics
//     </Button>
//   ]);

// //   const sendToLogistics = async (orderId) => {
// //     // This will send order to your backend API
// //     console.log("Sending order to logistics:", orderId);
// //   };
// const sendToLogistics = async (order) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           shopifyOrderId: order.id,
//           customerName: `${order.customer?.first_name} ${order.customer?.last_name}`,
//           address: order.shipping_address,
//           total: order.total_price,
//         }),
//       });
      
//       if (response.ok) {
//         alert('Order sent to logistics successfully!');
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       alert('Failed to send order to logistics');
//     }
//   };
//   return (
//     <Page title="Orders Management">
//       <Card>
//         <DataTable
//           columnContentTypes={['text', 'text', 'text', 'text', 'text']}
//           headings={['Order #', 'Customer', 'Total', 'Status', 'Action']}
//           rows={rows}
//         />
//       </Card>
//     </Page>
//   );
// }



























// import { useLoaderData } from "@remix-run/react";
// import { json } from "@remix-run/node"; // Missing import
// import { authenticate } from "../shopify.server";
// import { Card, Page, DataTable, Button, Badge } from "@shopify/polaris";

// export const loader = async ({ request }) => {
//   try {
//     const { admin, session } = await authenticate.admin(request);
    
//     // Fixed the API call structure
//     const ordersResponse = await admin.rest.Order.all({
//       session,
//       status: "any",
//       limit: 50,
//     });

//     return json({ orders: ordersResponse.data || [] });
//   } catch (error) {
//     console.error("Error loading orders:", error);
//     return json({ orders: [] });
//   }
// };

// export default function Orders() {
//   const { orders } = useLoaderData();

//   const sendToLogistics = async (order) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           shopifyOrderId: order.id,
//           customerName: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
//           address: order.shipping_address,
//           total: order.total_price,
//         }),
//       });
      
//       if (response.ok) {
//         alert('Order sent to logistics successfully!');
//       } else {
//         throw new Error('Failed to send order');
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//       alert('Failed to send order to logistics');
//     }
//   };

//   const rows = orders.map((order) => [
//     order.order_number,
//     `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'N/A',
//     `$${order.total_price}`,
//     <Badge key={`badge-${order.id}`} status={order.fulfillment_status === "fulfilled" ? "success" : "attention"}>
//       {order.fulfillment_status || "Unfulfilled"}
//     </Badge>,
//     <Button 
//       key={`button-${order.id}`} 
//       size="small" 
//       onClick={() => sendToLogistics(order)}
//     >
//       Send to Logistics
//     </Button>
//   ]);

//   return (
//     <Page title="Orders Management">
//       <Card>
//         <DataTable
//           columnContentTypes={['text', 'text', 'text', 'text', 'text']}
//           headings={['Order #', 'Customer', 'Total', 'Status', 'Action']}
//           rows={rows}
//         />
//       </Card>
//     </Page>
//   );
// }
































































// import { useEffect, useState } from "react";
// import { json } from "@remix-run/node";
// import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
// import {
//   Page,
//   Layout,
//   Text,
//   Card,
//   Button,
//   DataTable,
//   Toast,
//   Frame,
//   Banner,
//   EmptyState,
//   Spinner,
// } from "@shopify/polaris";
// import { authenticate } from "../shopify.server";

// // Loader to fetch orders
// export const loader = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
  
//   try {
//     const response = await admin.graphql(`
//       {
//         orders(first: 50, reverse: true) {
//           edges {
//             node {
//               id
//               name
//               createdAt
//               customer {
//                 displayName
//               }
//               totalPriceSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               fulfillmentStatus
//               displayFulfillmentStatus
//               tags
//             }
//           }
//         }
//       }
//     `);

//     const responseJson = await response.json();
//     const orders = responseJson.data?.orders?.edges || [];

//     return json({ orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return json({ orders: [], error: "Failed to fetch orders",error: error });
//   }
// };

// // Action to handle sending orders to logistics
// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const formData = await request.formData();
//   const orderIds = JSON.parse(formData.get("orderIds") || "[]");
  
//   try {
//     // Send orders to your backend
//     const backendResponse = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         orders: orderIds,
//         source: "shopify_app"
//       }),
//     });

//     if (!backendResponse.ok) {
//       throw new Error("Failed to send orders to logistics system");
//     }

//     // Tag orders as sent to logistics
//     for (const orderId of orderIds) {
//       await admin.graphql(`
//         mutation orderUpdate($input: OrderInput!) {
//           orderUpdate(input: $input) {
//             order {
//               id
//               tags
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `, {
//         variables: {
//           input: {
//             id: orderId,
//             tags: ["sent-to-logistics"]
//           }
//         }
//       });
//     }

//     return json({ 
//       success: true, 
//       message: `${orderIds.length} order(s) sent to logistics system successfully!` 
//     });
//   } catch (error) {
//     console.error("Error sending orders:", error);
//     return json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// };

// export default function Orders() {
//   const { orders, error } = useLoaderData();
//   const actionData = useActionData();
//   const submit = useSubmit();
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Handle bulk selection
//   const handleSelectionChange = (selectedResources) => {
//     setSelectedOrders(selectedResources);
//   };

//   // Send selected orders to logistics
//   const handleSendToLogistics = async () => {
//     if (selectedOrders.length === 0) return;
    
//     setIsLoading(true);
    
//     const formData = new FormData();
//     formData.append("orderIds", JSON.stringify(selectedOrders));
    
//     submit(formData, { method: "post" });
    
//     setTimeout(() => {
//       setIsLoading(false);
//       setSelectedOrders([]);
//     }, 2000);
//   };

//   // Prepare table data
//   const tableData = orders.map(({ node }) => {
//     const isAlreadySent = node.tags.includes("sent-to-logistics");
    
//     return [
//       node.name,
//       node.customer?.displayName || "Guest",
//       `${node.totalPriceSet.shopMoney.amount} ${node.totalPriceSet.shopMoney.currencyCode}`,
//       node.displayFulfillmentStatus || "Unfulfilled",
//       new Date(node.createdAt).toLocaleDateString(),
//       isAlreadySent ? "✅ Sent" : "❌ Not sent",
//       node.id,
//     ];
//   });

//   const tableHeaders = [
//     "Order",
//     "Customer",
//     "Total",
//     "Status",
//     "Date",
//     "Logistics Status",
//   ];

//   if (error) {
//     return (
//       <Page>
//         <Banner status="critical">
//           <p>{error}</p>
//         </Banner>
//       </Page>
//     );
//   }

//   return (
//     <Frame>
//       <Page
//         title="Orders Management"
//         subtitle="Select and send orders to your logistics system"
//         primaryAction={{
//           content: `Send ${selectedOrders.length} Order(s) to Logistics`,
//           onAction: handleSendToLogistics,
//           disabled: selectedOrders.length === 0 || isLoading,
//           loading: isLoading,
//         }}
//       >
//         <Layout>
//           <Layout.Section>
//             {actionData?.success && (
//               <Banner status="success" onDismiss={() => {}}>
//                 <p>{actionData.message}</p>
//               </Banner>
//             )}
            
//             {actionData?.error && (
//               <Banner status="critical" onDismiss={() => {}}>
//                 <p>{actionData.error}</p>
//               </Banner>
//             )}

//             <Card>
//               <Text variant="headingMd" as="h2">
//                 Recent Orders
//               </Text>
//               <Text variant="bodyMd" as="p" color="subdued">
//                 Select orders to send to your logistics system
//               </Text>
              
//               {tableData.length === 0 ? (
//                 <EmptyState
//                   heading="No orders found"
//                   image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
//                 >
//                   <p>When you receive orders, they'll appear here.</p>
//                 </EmptyState>
//               ) : (
//                 <DataTable
//                   columnContentTypes={[
//                     "text",
//                     "text", 
//                     "text",
//                     "text",
//                     "text",
//                     "text",
//                   ]}
//                   headings={tableHeaders}
//                   rows={tableData}
//                   selectable
//                   selectedRows={selectedOrders}
//                   onSelectionChange={handleSelectionChange}
//                 />
//               )}
//             </Card>
//           </Layout.Section>
          
//           <Layout.Section oneThird>
//             <Card>
//               <Text variant="headingMd" as="h2">
//                 Quick Actions
//               </Text>
//               <div style={{ marginTop: "1rem" }}>
//                 <Button
//                   url="http://localhost:3000"
//                   external
//                   outline
//                   fullWidth
//                 >
//                   Open Admin Portal
//                 </Button>
//               </div>
//               <div style={{ marginTop: "0.5rem" }}>
//                 <Text variant="bodyMd" as="p" color="subdued">
//                   View and manage orders in your logistics dashboard
//                 </Text>
//               </div>
//             </Card>
            
//             <Card>
//               <Text variant="headingMd" as="h2">
//                 Statistics
//               </Text>
//               <div style={{ marginTop: "1rem" }}>
//                 <Text variant="bodyMd" as="p">
//                   Total Orders: {orders.length}
//                 </Text>
//                 <Text variant="bodyMd" as="p">
//                   Sent to Logistics: {orders.filter(({node}) => node.tags.includes("sent-to-logistics")).length}
//                 </Text>
//                 <Text variant="bodyMd" as="p">
//                   Selected: {selectedOrders.length}
//                 </Text>
//               </div>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </Frame>
//   );
// }






























// PROPER CODE WITH UI
// import { useState } from "react";
// import { json } from "@remix-run/node";
// import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
// import {
//   Page,
//   Layout,
//   Text,
//   Card,
//   Button,
//   DataTable,
//   Frame,
//   Banner,
//   EmptyState,
//   Spinner,
//   InlineStack,
// } from "@shopify/polaris";
// import { authenticate } from "../shopify.server";

// // Helper function for safe data access
// const safeAccess = (obj, path, defaultValue = null) => {
//   return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
// };

// // Loader to fetch orders with better error handling
// export const loader = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
  
//   try {
//     const response = await admin.graphql(`
//       {
//         orders(first: 50, reverse: true) {
//           edges {
//             node {
//               id
//               name
//               createdAt
//               customer {
//                 displayName
//               }
//               totalPriceSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               fulfillmentStatus
//               displayFulfillmentStatus
//               tags
//             }
//           }
//           pageInfo {
//             hasNextPage
//           }
//         }
//       }
//     `);

//     const responseJson = await response.json();
    
//     if (responseJson.errors) {
//       throw new Error(responseJson.errors.map(e => e.message).join(', '));
//     }

//     const orders = safeAccess(responseJson, 'data.orders.edges', []);
    
//     return json({ 
//       orders,
//       hasNextPage: safeAccess(responseJson, 'data.orders.pageInfo.hasNextPage', false)
//     });
    
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return json({ 
//       orders: [], 
//       error: error instanceof Error ? error.message : 'Failed to fetch orders',
//       hasNextPage: false 
//     }, { status: 500 });
//   }
// };

// // Enhanced action with better error handling
// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
  
//   try {
//     const formData = await request.formData();
//     const orderIds = JSON.parse(formData.get("orderIds") || "[]");
    
//     if (!Array.isArray(orderIds) ){
//       throw new Error("Invalid order IDs format");
//     }

//     // Validate order IDs
//     if (orderIds.length === 0) {
//       return json({ 
//         success: false, 
//         error: "No orders selected" 
//       }, { status: 400 });
//     }

//     // Send to backend
//     const backendResponse = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ orders: orderIds, source: "shopify_app" }),
//     });

//     if (!backendResponse.ok) {
//       const errorData = await backendResponse.json().catch(() => ({}));
//       throw new Error(errorData.message || "Failed to send orders to logistics system");
//     }

//     // Tag orders in Shopify
//     const results = await Promise.allSettled(
//       orderIds.map(orderId => 
//         admin.graphql(`
//           mutation orderUpdate($input: OrderInput!) {
//             orderUpdate(input: $input) {
//               order { id tags }
//               userErrors { field message }
//             }
//           }
//         `, {
//           variables: {
//             input: {
//               id: orderId,
//               tags: ["sent-to-logistics"]
//             }
//           }
//         })
//       )
//     );

//     // Check for errors in tagging
//     const taggingErrors = results
//       .filter(result => result.status === 'rejected')
//       .map(result => result.reason.message);

//     if (taggingErrors.length > 0) {
//       console.error("Tagging errors:", taggingErrors);
//     }

//     return json({ 
//       success: true, 
//       message: `${orderIds.length} order(s) processed successfully!`,
//       warnings: taggingErrors.length > 0 ? 
//         `${taggingErrors.length} orders couldn't be tagged` : undefined
//     });

//   } catch (error) {
//     console.error("Error in action:", error);
//     return json({ 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Failed to process orders'
//     }, { status: 500 });
//   }
// };

// export default function Orders() {
//   const { orders, error, hasNextPage } = useLoaderData();
//   const actionData = useActionData();
//   const submit = useSubmit();
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Handle bulk selection
//   const handleSelectionChange = (selectedResources) => {
//     setSelectedOrders(selectedResources);
//   };

//   // Send selected orders to logistics
//   const handleSendToLogistics = () => {
//     if (selectedOrders.length === 0) return;
    
//     setIsProcessing(true);
//     const formData = new FormData();
//     formData.append("orderIds", JSON.stringify(selectedOrders));
//     submit(formData, { method: "post" });
//   };

//   // Prepare safe table data
//   const tableData = orders.map(({ node }) => {
//     const isAlreadySent = safeAccess(node, 'tags', []).includes("sent-to-logistics");
//     const amount = safeAccess(node, 'totalPriceSet.shopMoney.amount', '0');
//     const currency = safeAccess(node, 'totalPriceSet.shopMoney.currencyCode', '');
    
//     return [
//       safeAccess(node, 'name', 'N/A'),
//       safeAccess(node, 'customer.displayName', 'Guest'),
//       `${amount} ${currency}`.trim(),
//       safeAccess(node, 'displayFulfillmentStatus', 'Unfulfilled'),
//       new Date(safeAccess(node, 'createdAt')).toLocaleDateString(),
//       isAlreadySent ? "✅ Sent" : "❌ Not sent",
//       safeAccess(node, 'id'),
//     ];
//   });

//   const tableHeaders = [
//     "Order",
//     "Customer",
//     "Total",
//     "Status",
//     "Date",
//     "Logistics Status",
//   ];

//   // Calculate statistics
//   const stats = {
//     totalOrders: orders.length,
//     sentToLogistics: orders.filter(({ node }) => 
//       safeAccess(node, 'tags', []).includes("sent-to-logistics")
//     ).length,
//     selected: selectedOrders.length,
//   };

//   return (
//     <Frame>
//       <Page
//         title="Orders Management"
//         subtitle="Select and send orders to your logistics system"
//         primaryAction={{
//           content: `Send ${selectedOrders.length} Order(s) to Logistics`,
//           onAction: handleSendToLogistics,
//           disabled: selectedOrders.length === 0 || isProcessing,
//           loading: isProcessing,
//         }}
//         secondaryActions={hasNextPage ? [{
//           content: 'Load More Orders',
//           onAction: () => console.log('Implement pagination'),
//         }] : undefined}
//       >
//         <Layout>
//           <Layout.Section>
//             {/* Status banners */}
//             {actionData?.success && (
//               <Banner
//                 status="success"
//                 onDismiss={() => {}}
//                 title={actionData.message}
//               >
//                 {actionData.warnings && <p>{actionData.warnings}</p>}
//               </Banner>
//             )}
            
//             {actionData?.error && (
//               <Banner status="critical" onDismiss={() => {}}>
//                 <p>{actionData.error}</p>
//               </Banner>
//             )}

//             {error && (
//               <Banner status="critical" onDismiss={() => {}}>
//                 <p>{error}</p>
//               </Banner>
//             )}

//             {/* Main orders card */}
//             <Card>
//               <InlineStack align="space-between" blockAlign="center">
//                 <Text variant="headingMd" as="h2">
//                   Recent Orders
//                 </Text>
//                 <Text variant="bodyMd" as="p" color="subdued">
//                   Showing {orders.length} orders
//                 </Text>
//               </InlineStack>
              
//               {orders.length === 0 ? (
//                 <EmptyState
//                   heading="No orders found"
//                   image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
//                 >
//                   <p>When you receive orders, they'll appear here.</p>
//                 </EmptyState>
//               ) : (
//                 <DataTable
//                   columnContentTypes={["text", "text", "text", "text", "text", "text"]}
//                   headings={tableHeaders}
//                   rows={tableData}
//                   selectable
//                   selectedRows={selectedOrders}
//                   onSelectionChange={handleSelectionChange}
//                   footerContent={`Showing ${orders.length} of ${stats.totalOrders} orders`}
//                 />
//               )}
//             </Card>
//           </Layout.Section>
          
//           <Layout.Section oneThird>
//             {/* Quick actions card */}
//             <Card>
//               <Text variant="headingMd" as="h2">
//                 Quick Actions
//               </Text>
//               <div style={{ marginTop: "1rem" }}>
//                 <Button
//                   url="http://localhost:3000"
//                   external
//                   outline
//                   fullWidth
//                 >
//                   Open Logistics Dashboard
//                 </Button>
//               </div>
//             </Card>
            
//             {/* Statistics card */}
//             <Card>
//               <Text variant="headingMd" as="h2">
//                 Statistics
//               </Text>
//               <div style={{ marginTop: "1rem" }}>
//                 <Text variant="bodyMd" as="p">
//                   <strong>Total Orders:</strong> {stats.totalOrders}
//                 </Text>
//                 <Text variant="bodyMd" as="p">
//                   <strong>Sent to Logistics:</strong> {stats.sentToLogistics}
//                 </Text>
//                 <Text variant="bodyMd" as="p">
//                   <strong>Selected:</strong> {stats.selected}
//                 </Text>
//               </div>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </Frame>
//   );
// }












// TESTING CODE

// import React, { useEffect, useState } from 'react';

// const Orders = () => {
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const orderId = urlParams.get('orderId');
//     const orderNumber = urlParams.get('orderNumber');

//     if (orderId && orderNumber) {
//       setOrder({ id: orderId, number: orderNumber });
//     }
//   }, []);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Order Booked</h2>
//       {order ? (
//         <div>
//           <p><strong>Order ID:</strong> {order.id}</p>
//           <p><strong>Order Number:</strong> {order.number}</p>
//           {/* You can add a “Confirm Booking” or “Save” button here later */}
//         </div>
//       ) : (
//         <p>No order found in URL.</p>
//       )}
//     </div>
//   );
// };

// export default Orders;




// // routes/api/orders.jsx
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage"; // ✅ This is the function that retrieves token for a shop

// export async function loader({ request }) {
//   try {
//     // 🔒 Authenticate the session
//     const { session } = await authenticate.admin(request);
//     const shop = session.shop;
//     console.log("shop",shop);
    
//     // 🔑 Get token for current shop from memory store
//     const token = getToken(shop);
//     console.log("shop_token",token);

//     if (!token) {
//       return json({ success: false, error: "Token not found for this store" }, { status: 401 });
//     }

//     // 📨 Fetch orders from external API
//     const res = await fetch("https://backend.rushr-admin.com/api/orders", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();

//     return json({ success: true, orders: data.orders || [] });
//   } catch (err) {
//     console.error("❌ Error fetching orders:", err);
//     return json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
//   }
// }


// routes/api/orders.jsx
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import { getToken } from "../utils/tokenStorage"; // ✅ This is the function that retrieves token for a shop

// export async function loader({ request }) {
//   try {
//     // 🔒 Authenticate the session
//     const { session } = await authenticate.admin(request);
//     const shop = session.shop;

//     // 🔑 Get token for current shop from memory store
//     const token = getToken(shop);

//     if (!token) {
//       return json({ success: false, error: "Token not found for this store" }, { status: 401 });
//     }

//     // 📨 Fetch orders from external API
//     const res = await fetch("https://backend.rushr-admin.com/api/orders", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();

//     return json({ success: true, orders: data.orders || [] });
//   } catch (err) {
//     console.error("❌ Error fetching orders:", err);
//     return json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
//   }
// }




import { json } from "@remix-run/node";
import { authenticate, apiVersion } from "../shopify.server";
import { getToken } from "../utils/tokenStorage";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loader = ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const action = async ({ request }) => {
  try {
    // 1. Parse request
    const { orderIds } = await request.json();
    if (!orderIds?.length) {
      return json({ error: "No order IDs provided" }, { status: 400, headers: corsHeaders });
    }

    // 2. Authenticate with Shopify
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;
    
    // console.log(`🔑 Authenticated with shop: ${shop}`);
    // console.log(`🔄 Using API version: ${apiVersion}`);

    // // 3. Verify we have a valid access token
    // if (!accessToken) {
    //   return json({ error: "Missing access token" }, { status: 401, headers: corsHeaders });
    // }
// ===== PASTE DEBUG CODE HERE =====
console.log("🔍 Session details:", {
  shop: session.shop,
  isActive: session.isActive(),
  expires: session.expires,
  scopes: session.scopes,
});

try {
  const testUrl = `https://${session.shop}/admin/api/${apiVersion}/shop.json`;
  const testResponse = await axios.get(testUrl, {
    headers: {
      "X-Shopify-Access-Token": session.accessToken,
    }
  });
  console.log("✅ Access token test successful", testResponse.data);
} catch (testError) {
  console.error("❌ Access token test failed:", {
    status: testError.response?.status,
    data: testError.response?.data,
  });
  throw new Error("Shopify access token validation failed");
}
    // 4. Get Rushrr token
    const rushrrToken = getToken(shop);
    if (!rushrrToken) {
      return json({ error: "Missing Rushrr token" }, { status: 400, headers: corsHeaders });
    }

    // 5. Process orders
    const results = [];
    const errors = [];

    for (const orderId of orderIds) {
      try {
        // First try REST API
        const restUrl = `https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`;
        const restResponse = await axios.get(restUrl, {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });

        const order = restResponse.data.order;
        results.push({
          orderId,
          status: "success",
          data: {
            id: order.id,
            name: order.name,
            email: order.email,
            total_price: order.total_price,
          }
        });

        // Send to Rushrr API
        await axios.post(
          'https://backend.rushr-admin.com/api/orders/create-order',
          {
            shopifyStoreUrl: shop,
            orders: [order],
          },
          {
            headers: {
              'Authorization': `Bearer ${rushrrToken}`,
              'Content-Type': 'application/json',
            }
          }
        );

      } catch (error) {
        console.error(`❌ Error processing order ${orderId}:`, error);
        
        // Enhanced error information
        const errorInfo = {
          orderId,
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: {
              // Mask sensitive headers
              'x-shopify-access-token': error.config?.headers?.['X-Shopify-Access-Token'] ? '***redacted***' : undefined,
              authorization: error.config?.headers?.Authorization ? '***redacted***' : undefined,
            },
          },
        };

        errors.push(errorInfo);
      }
    }

    return json(
      {
        success: errors.length === 0,
        processed: results.length,
        failed: errors.length,
        results,
        errors,
      },
      { 
        status: errors.length === 0 ? 200 : 207, // 207 Multi-Status
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error("❌ Top-level error:", error);
    return json(
      { 
        error: "Internal server error",
        details: error.message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
};