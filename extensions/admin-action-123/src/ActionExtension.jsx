// import {useEffect, useState} from 'react';
// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text,
// } from '@shopify/ui-extensions-react/admin';

// // The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
// const TARGET = 'admin.product-details.action.render';

// export default reactExtension(TARGET, () => <App />);

// function App() {
//   // The useApi hook provides access to several useful APIs like i18n, close, and data.
//   const {i18n, close, data} = useApi(TARGET);
//   console.log({data});
//   const [productTitle, setProductTitle] = useState('');
//   // Use direct API calls to fetch data from Shopify.
//   // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API
//   useEffect(() => {
//     (async function getProductInfo() {
//       const getProductQuery = {
//         query: `query Product($id: ID!) {
//           product(id: $id) {
//             title
//           }
//         }`,
//         variables: {id: data.selected[0].id},
//       };

//       const res = await fetch("shopify:admin/api/graphql.json", {
//         method: "POST",
//         body: JSON.stringify(getProductQuery),
//       });

//       if (!res.ok) {
//         console.error('Network error');
//       }

//       const productData = await res.json();
//       setProductTitle(productData.data.product.title);
//     })();
//   }, [data.selected]);
//   return (
//     // The AdminAction component provides an API for setting the title and actions of the Action extension wrapper.
//     <AdminAction
//       primaryAction={
//         <Button
//           onPress={() => {
//             console.log('saving');
//             close();
//           }}
//         >
//           Done
//         </Button>
//       }
//       secondaryAction={
//         <Button
//           onPress={() => {
//             console.log('closing');
//             close();
//           }}
//         >
//           Close
//         </Button>
//       }
//     >
//       <BlockStack>
//         {/* Set the translation values for each supported language in the locales directory */}
//         <Text fontWeight="bold">{i18n.translate('welcome', {target: TARGET})}</Text>
//         <Text>Current product: {productTitle}</Text>
//       </BlockStack>
//     </AdminAction>
//   );
// }
















// import { useEffect, useState } from "react";
// import { Text, BlockStack, InlineStack, Button, Spinner } from "@shopify/polaris";

// export default function ActionExtension({ selected }) {
//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const sendOrders = async () => {
//       try {
//         const sessionRes = await fetch("/api/shopify/session");
//         const { shop, accessToken } = await sessionRes.json();

//         const orderIds = selected.map(order => order.id);

//         const response = await fetch("http://localhost:3001/api/shopify/fetch-orders", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderIds, shop, accessToken })
//         });

//         const { orders } = await response.json();

//         await fetch("http://localhost:3001/api/orders/create", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orders })
//         });

//         setSuccess(true);
//       } catch (err) {
//         console.error("Failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selected && selected.length > 0) {
//       sendOrders();
//     }
//   }, [selected]);

//   return (
//     <BlockStack gap="400" padding="400">
//       {loading ? (
//         <InlineStack gap="200" align="center">
//           <Spinner />
//           <Text variant="bodyMd" tone="subdued">Sending selected orders to app…</Text>
//         </InlineStack>
//       ) : success ? (
//         <Text variant="bodyMd" tone="success">
//           ✅ Selected orders have been sent successfully!
//         </Text>
//       ) : (
//         <Text variant="bodyMd" tone="critical">
//           ❌ Failed to send orders.
//         </Text>
//       )}
//     </BlockStack>
//   );
// }



// export default function ActionExtension() {
//   return (
//     <script
//       type="application/json+shopify"
//       data-type="redirect"
//       dangerouslySetInnerHTML={{
//         __html: JSON.stringify({
//           path: "/apps/testing-logistic-app/app/orders"
//         }),
//       }}
//     />
//   );
// }














// Perfect code rendering the code text in the model 

// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text
// } from '@shopify/ui-extensions-react/admin';

// // This should match your TOML file target
// const TARGET = 'admin.order-index.selection-action.render';

// export default reactExtension(TARGET, () => <App />);

// function App() {
//   const { close } = useApi(TARGET);

//   return (
//     <AdminAction
//       primaryAction={
//         <Button onPress={close}>
//           Close
//         </Button>
//       }
//     >
//       <BlockStack>
//         <Text variant="headingLg">Hello World!</Text>
//         <Text>This is a test to see if the extension renders properly.</Text>
//         <Text>If you can see this, the extension is working!</Text>
//       </BlockStack>
//     </AdminAction>
//   );
// }



// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text,
//   Banner,
// } from '@shopify/ui-extensions-react/admin';
// import { useState } from 'react';

// const TARGET = 'admin.order-index.selection-action.render';

// export default reactExtension(TARGET, () => <App />);

// function App() {
//   const { close, data } = useApi(TARGET);

//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   const selectedOrders = data?.selected || [];
//   const selectedOrderIds = selectedOrders.map(order => order.id);

//   const handleBookOrder = () => {
//     if (selectedOrders.length === 0) {
//       setMessage('No orders selected');
//       setMessageType('critical');
//       return;
//     }

//     console.log("📦 Selected Order raw objects:", selectedOrders);

//     const debugData = selectedOrders.map((order, index) => {
//       return `🔹 Order ${index + 1}\n` +
//         ` - ID: ${order.id}\n` +
//         ` - Order Name: ${order.name}\n` +
//         ` - Created At: ${order.createdAt}\n` +
//         ` - Total: ${order.totalPriceSet?.presentmentMoney?.amount} ${order.totalPriceSet?.presentmentMoney?.currencyCode}\n` +
//         ` - Customer: ${order?.customer?.displayName || 'N/A'}`;
//     }).join('\n\n');

//     setMessage(`🧾 Order Details Debug:\n\n${debugData}`);
//     setMessageType('success');
//   };

//   return (
//     <AdminAction
//       primaryAction={
//         <Button onPress={close} kind="secondary">
//           Cancel
//         </Button>
//       }
//       secondaryAction={
//         <Button
//           onPress={handleBookOrder}
//           variant="primary"
//           disabled={selectedOrderIds.length === 0}
//         >
//           Show Debug Info
//         </Button>
//       }
//     >
//       <BlockStack gap="400">
//         <Text variant="headingLg">Debug Order Data</Text>

//         {selectedOrderIds.length > 0 ? (
//           <Text>
//             You have selected {selectedOrderIds.length} order(s).
//           </Text>
//         ) : (
//           <Text tone="subdued">
//             No orders selected. Please select orders first.
//           </Text>
//         )}

//         {message && (
//           <Banner tone={messageType}>
//             <Text as="p" break>
//               {message}
//             </Text>
//           </Banner>
//         )}

//         <Text variant="bodySm" tone="subdued">
//           Click "Show Debug Info" to display selected order details below.
//         </Text>

//         <Text variant="bodySm" tone="subdued">
//           Selected IDs: {selectedOrderIds.join(', ')}
//         </Text>
//       </BlockStack>
//     </AdminAction>
//   );
// }


// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text,
//   Banner,
// } from '@shopify/ui-extensions-react/admin';
// import { useState, useEffect } from 'react';

// const TARGET = 'admin.order-index.selection-action.render';

// export default reactExtension(TARGET, () => <App />);

// function App() {
//   const { close, data } = useApi(TARGET);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [orderDetails, setOrderDetails] = useState([]);

//   const selectedOrders = data?.selected || [];
//   const selectedOrderIds = selectedOrders.map(order => order.id);

//   const fetchOrderDetails = async () => {
//     if (selectedOrderIds.length === 0) return;
    
//     setLoading(true);
//     try {
//       // GraphQL query to fetch order details
//       const getOrdersQuery = {
//         query: `
//           query getOrders($ids: [ID!]!) {
//             nodes(ids: $ids) {
//               ... on Order {
//                 id
//                 name
//                 createdAt
//                 totalPriceSet {
//                   shopMoney {
//                     amount
//                     currencyCode
//                   }
//                 }
//                 customer {
//                   firstName
//                   lastName
//                   email
//                 }
//                 lineItems(first: 10) {
//                   edges {
//                     node {
//                       title
//                       quantity
//                       variant {
//                         price
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         `,
//         variables: { ids: selectedOrderIds },
//       };

//       // Use Shopify's built-in GraphQL endpoint
//       const res = await fetch("shopify:admin/api/graphql.json", {
//         method: "POST",
//         body: JSON.stringify(getOrdersQuery),
//       });

//       if (!res.ok) {
//         throw new Error('Network error');
//       }

//       const response = await res.json();
      
//       if (response.errors) {
//         throw new Error(response.errors.map(e => e.message).join(', '));
//       }

//       const orders = response.data.nodes;
//       setOrderDetails(orders);

//       // Format the order details for display
//       const debugData = orders.map((order, index) => {
//         const lineItemsText = order.lineItems?.edges?.map(edge => 
//           `${edge.node.title} (Qty: ${edge.node.quantity})`
//         ).join(', ') || 'No items';

//         return `🧾 Order ${index + 1}\n` +
//           ` - ID: ${order.id}\n` +
//           ` - Name: ${order.name}\n` +
//           ` - Created At: ${new Date(order.createdAt).toLocaleDateString()}\n` +
//           ` - Total: ${order.totalPriceSet?.shopMoney?.amount} ${order.totalPriceSet?.shopMoney?.currencyCode}\n` +
//           ` - Customer: ${order.customer?.firstName || ''} ${order.customer?.lastName || ''} (${order.customer?.email || 'N/A'})\n` +
//           ` - Items: ${lineItemsText}`;
//       }).join('\n\n');

//       setMessage(debugData);
//       setMessageType('success');
//     } catch (err) {
//       console.error('Failed to fetch order details:', err);
//       setMessage(`Error fetching order details: ${err.message}`);
//       setMessageType('critical');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-fetch when orders are selected (optional)
//   useEffect(() => {
//     if (selectedOrderIds.length > 0) {
//       // Optionally auto-fetch when selection changes
//       // fetchOrderDetails();
//     }
//   }, [selectedOrderIds.length]);

//   return (
//     <AdminAction
//       primaryAction={
//         <Button onPress={close} kind="secondary">
//           Close
//         </Button>
//       }
//       secondaryAction={
//         <Button
//           onPress={fetchOrderDetails}
//           variant="primary"
//           disabled={selectedOrderIds.length === 0 || loading}
//         >
//           {loading ? 'Loading...' : 'Show Order Details'}
//         </Button>
//       }
//     >
//       <BlockStack gap="400">
//         <Text variant="headingLg">Selected Order Information</Text>

//         {selectedOrderIds.length > 0 ? (
//           <Text>
//             You selected {selectedOrderIds.length} order(s).
//           </Text>
//         ) : (
//           <Text tone="subdued">
//             No orders selected. Please select orders first.
//           </Text>
//         )}

//         {message && (
//           <Banner tone={messageType}>
//             <Text as="p" break>
//               {message}
//             </Text>
//           </Banner>
//         )}
//       </BlockStack>
//     </AdminAction>
//   );
// }


// import { useEffect, useState } from 'react';
// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text,
// } from '@shopify/ui-extensions-react/admin';

// const TARGET = 'admin.order-index.selection-action.render';

// export default reactExtension(TARGET, () => <BulkOrderAction />);

// function BulkOrderAction() {
//   const { close, data } = useApi(TARGET);
//   const [orderIds, setOrderIds] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [responseMsg, setResponseMsg] = useState('');

//   // Extract all order IDs from selected orders
//  useEffect(() => {
//   console.log('🔍 Full data object from useApi:', data); // Add this line

//   if (data?.selected?.length > 0) {
//     const ids = data.selected.map((item) => item.id.split('/').pop());
//     setOrderIds(ids);
//   }
// }, [data]);


//   // Send to app/backend
// const handleSendToApp = async () => {
//   setIsLoading(true);
//   try {
//     // Step 1: Call Remix backend to get order details
//     const remixRes = await fetch('/resources/bulk-order-details', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ orderIds }),
//     });

//     const orderDetails = await remixRes.json();
//     console.log('✅ Order details received from Remix:', orderDetails);

//     // Step 2 & 3: Send each order individually with modified payload
//     for (const order of orderDetails.orders) {
//       // Add `orderReferenceNumber` (keep `order_number`)
//       order.orderReferenceNumber = String(order.order_number);;

//       const individualPayload = {
//         shopifyStoreUrl: `https://${orderDetails.shopifyStoreUrl}`,
//         orders: [order],
//       };

//       const externalRes = await fetch('https://backend.rushr-admin.com/api/orders/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${orderDetails.token}`,
//         },
//         body: JSON.stringify(individualPayload),
//       });

//       const result = await externalRes.json();
//       console.log('✅ Sent order:', order.id, 'Response:', result);
//     }
//     // console.log(orderIds);
    
//     setResponseMsg('✅ Orders sent to external app successfully!');
//   } catch (err) {
//     console.error('❌ Error in sending orders:', err.message);
//     setResponseMsg('❌ Failed to send orders.');
//   } finally {
//     setIsLoading(false);
//   }
// };




//   return (
//     <AdminAction
//       primaryAction={
//         <Button disabled={!orderIds.length} loading={isLoading} onPress={handleSendToApp}>
//           Send to App
//         </Button>
//       }
//       secondaryAction={<Button onPress={close}>Cancel</Button>}
//     >
//       <BlockStack spacing="tight">
//         <Text fontWeight="bold">Selected Orders</Text>
//         {orderIds.length === 0 ? (
//           <Text>No orders selected.</Text>
//         ) : (
//           <Text>Orders: {orderIds.join(', ')}</Text>
//         )}
//         {responseMsg && <Text>{responseMsg}</Text>}
//       </BlockStack>
//     </AdminAction>
//   );
// }









































// import { useEffect, useState } from 'react';
// import {
//   reactExtension,
//   useApi,
//   AdminAction,
//   BlockStack,
//   Button,
//   Text,
// } from '@shopify/ui-extensions-react/admin';

// const TARGET = 'admin.order-index.selection-action.render';

// export default reactExtension(TARGET, () => <BulkOrderAction />);

// function BulkOrderAction() {
//   const { close, data } = useApi(TARGET);
//   const [orderIds, setOrderIds] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [responseMsg, setResponseMsg] = useState('');
//   const [debugInfo, setDebugInfo] = useState('');

//   // Extract all order IDs from selected orders
//  useEffect(() => {
//   console.log('🔍 Full data object from useApi:', data); // Add this line

//   if (data?.selected?.length > 0) {
//     const ids = data.selected.map((item) => item.id.split('/').pop());
//     setOrderIds(ids);
//   }
// }, [data]);


//   // Send to app/backend - BULLETPROOF VERSION
// const handleSendToApp = async () => {
//   setIsLoading(true);
//   setResponseMsg('🔄 Starting...');
//   setDebugInfo('');

//   try {
//     console.log('🚀 BULLETPROOF: Starting order processing for IDs:', orderIds);

//     // Step 1: Validate we have order IDs
//     if (!orderIds || orderIds.length === 0) {
//       throw new Error('No orders selected. Please select orders first.');
//     }

//     setResponseMsg('🔄 Connecting to app...');
//     setDebugInfo(`Processing ${orderIds.length} order(s): ${orderIds.join(', ')}`);

//     // Step 2: Try to connect to ANY working endpoint
//     const endpoints = [
//       '/api/process-orders',
//       '/resources/bulk-order-details',
//       '/api/create-order',
//       '/api/health' // Just to test connection
//     ];

//     let workingEndpoint = null;
//     let connectionTest = null;

//     // Test connection first
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`🔍 Testing connection to: ${endpoint}`);
//         const testResponse = await fetch(endpoint, {
//           method: endpoint === '/api/health' ? 'GET' : 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: endpoint === '/api/health' ? undefined : JSON.stringify({ test: true }),
//         });

//         if (testResponse.status < 500) { // Any response except server error
//           workingEndpoint = endpoint;
//           connectionTest = testResponse.status;
//           console.log(`✅ Connection successful to ${endpoint} (status: ${testResponse.status})`);
//           break;
//         }
//       } catch (e) {
//         console.log(`❌ Failed to connect to ${endpoint}:`, e.message);
//         continue;
//       }
//     }

//     if (!workingEndpoint) {
//       throw new Error('❌ Cannot connect to app. Please restart your development server:\n\n1. Stop the server (Ctrl+C)\n2. Run: npm run dev\n3. Wait for new tunnel URL\n4. Try again');
//     }

//     setResponseMsg('🔄 Processing orders...');
//     setDebugInfo(`Connected to: ${workingEndpoint} (${connectionTest})`);

//     // Step 3: Process orders using working endpoint
//     let response;

//     if (workingEndpoint === '/api/health') {
//       // If only health endpoint works, show instructions
//       throw new Error('❌ App is running but order endpoints are not available. Please check your app configuration.');
//     }

//     try {
//       response = await fetch(workingEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ orderIds }),
//       });
//     } catch (fetchError) {
//       throw new Error(`❌ Request failed: ${fetchError.message}\n\nPlease restart your development server and try again.`);
//     }

//     console.log('📨 Response status:', response.status);
//     console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ API error:', response.status, errorText);
//       throw new Error(`API request failed: ${response.status} ${errorText}`);
//     }

//     const result = await response.json();
//     console.log('📋 API response received:', result);

//     // Handle new API format (process-orders endpoint)
//     if (result.results) {
//       const { successful, failed, summary } = result.results;

//       if (summary.successful > 0) {
//         setResponseMsg(
//           `✅ Success! ${summary.successful} order(s) processed successfully!${
//             summary.failed > 0 ? ` ${summary.failed} failed.` : ''
//           }`
//         );
//       } else {
//         setResponseMsg('❌ All orders failed to process. Please check the logs.');
//       }

//       // Log detailed results
//       if (successful.length > 0) {
//         console.log('✅ Successfully processed orders:', successful.map(r => r.orderId));
//       }
//       if (failed.length > 0) {
//         console.log('❌ Failed orders:', failed);
//       }
//       return; // Exit early for new API format
//     }

//     // Handle legacy API format (bulk-order-details endpoint)
//     if (!result.orders || result.orders.length === 0) {
//       throw new Error('No orders found or unable to fetch order details');
//     }

//     if (!result.token) {
//       throw new Error('API token not found. Please configure your Rushrr API token first.');
//     }

//     // Send each order to external API (legacy flow)
//     let successCount = 0;
//     let errorCount = 0;

//     for (const order of result.orders) {
//       try {
//         order.orderReferenceNumber = String(order.order_number);

//         const individualPayload = {
//           shopifyStoreUrl: `https://${result.shopifyStoreUrl}`,
//           orders: [order],
//         };

//         console.log('📤 Sending order to external API:', order.id);
//         const externalRes = await fetch('https://backend.rushr-admin.com/api/orders/create-order', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${result.token}`,
//           },
//           body: JSON.stringify(individualPayload),
//         });

//         const externalResult = await externalRes.json();

//         if (externalRes.ok) {
//           console.log('✅ Successfully sent order:', order.id, 'Response:', externalResult);
//           successCount++;
//         } else {
//           console.error('❌ Failed to send order:', order.id, 'Error:', externalResult);
//           errorCount++;
//         }
//       } catch (orderError) {
//         console.error('❌ Error processing individual order:', order.id, orderError);
//         errorCount++;
//       }
//     }

//     if (successCount > 0) {
//       setResponseMsg(`✅ Success! ${successCount} order(s) sent successfully!${errorCount > 0 ? ` ${errorCount} failed.` : ''}`);
//     } else {
//       setResponseMsg('❌ All orders failed to send. Please check your configuration.');
//     }

//   } catch (err) {
//     console.error('❌ Error in sending orders:', err);

//     // Provide specific error messages based on the error type
//     let errorMessage = '';
//     if (err.message.includes('Failed to fetch') || err.message.includes('ERR_NAME_NOT_RESOLVED')) {
//       errorMessage = '❌ Connection failed. Please restart your development server (npm run dev) and try again.';
//     } else if (err.message.includes('All endpoints failed')) {
//       errorMessage = '❌ App not responding. Please check if your development server is running.';
//     } else {
//       errorMessage = `❌ Error: ${err.message}`;
//     }

//     setResponseMsg(errorMessage);
//   } finally {
//     setIsLoading(false);
//   }
// };




//   return (
//     <AdminAction
//       primaryAction={
//         <Button disabled={!orderIds.length} loading={isLoading} onPress={handleSendToApp}>
//           {isLoading ? 'Processing...' : 'Send to App'}
//         </Button>
//       }
//       secondaryAction={<Button onPress={close}>Cancel</Button>}
//     >
//       <BlockStack spacing="tight">
//         <Text fontWeight="bold">Rushrr Order Processing</Text>
//         {orderIds.length === 0 ? (
//           <Text>No orders selected. Please select orders first.</Text>
//         ) : (
//           <Text>Selected Orders: {orderIds.join(', ')}</Text>
//         )}
//         {responseMsg && (
//           <Text fontWeight={responseMsg.includes('✅') ? 'bold' : 'normal'}>
//             {responseMsg}
//           </Text>
//         )}
//         {debugInfo && (
//           <Text appearance="subdued" size="small">
//             Debug: {debugInfo}
//           </Text>
//         )}
//         {!isLoading && orderIds.length > 0 && !responseMsg && (
//           <Text appearance="subdued">
//             Click "Send to App" to process these orders with Rushrr logistics.
//           </Text>
//         )}
//       </BlockStack>
//     </AdminAction>
//   );
// }


import { useEffect, useState } from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
} from '@shopify/ui-extensions-react/admin';

const TARGET = 'admin.order-index.selection-action.render';

export default reactExtension(TARGET, () => <BulkOrderAction />);

function BulkOrderAction() {
  const { close, data } = useApi(TARGET);
  const [orderIds, setOrderIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Extract all order IDs from selected orders
  useEffect(() => {
    console.log('🔍 Full data object from useApi:', data);
    if (data?.selected?.length > 0) {
      const ids = data.selected.map((item) => item.id.split('/').pop());
      setOrderIds(ids);
    }
  }, [data]);

  const handleSendToApp = async () => {
    setIsLoading(true);
    setResponseMsg('🔄 Starting...');
    setDebugInfo('');

    try {
      if (!orderIds.length) {
        throw new Error('No orders selected. Please select orders first.');
      }

      setResponseMsg('🔄 Connecting to app...');
      setDebugInfo(`Processing ${orderIds.length} order(s): ${orderIds.join(', ')}`);

      // Directly hit our process-orders endpoint
      const response = await fetch('/api/process-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ orderIds }),
      });

      console.log('📨 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('📋 API response received:', result);

      // Match new backend format
      if (result.results) {
        const { successful, failed } = result.results;
        if (successful.length > 0) {
          setResponseMsg(
            `✅ Success! ${successful.length} order(s) processed successfully!` +
              (failed.length > 0 ? ` ${failed.length} failed.` : '')
          );
        } else {
          setResponseMsg('❌ All orders failed to process.');
        }
        return;
      }

      throw new Error('Unexpected API response format.');
    } catch (err) {
      console.error('❌ Error in sending orders:', err);
      setResponseMsg(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAction
      primaryAction={
        <Button disabled={!orderIds.length} loading={isLoading} onPress={handleSendToApp}>
          {isLoading ? 'Processing...' : 'Send to App'}
        </Button>
      }
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <BlockStack spacing="tight">
        <Text fontWeight="bold">Rushrr Order Processing</Text>
        {orderIds.length === 0 ? (
          <Text>No orders selected. Please select orders first.</Text>
        ) : (
          <Text>Selected Orders: {orderIds.join(', ')}</Text>
        )}
        {responseMsg && (
          <Text fontWeight={responseMsg.includes('✅') ? 'bold' : 'normal'}>
            {responseMsg}
          </Text>
        )}
        {debugInfo && (
          <Text appearance="subdued" size="small">
            Debug: {debugInfo}
          </Text>
        )}
        {!isLoading && orderIds.length > 0 && !responseMsg && (
          <Text appearance="subdued">
            Click "Send to App" to process these orders with Rushrr logistics.
          </Text>
        )}
      </BlockStack>
    </AdminAction>
  );
}
