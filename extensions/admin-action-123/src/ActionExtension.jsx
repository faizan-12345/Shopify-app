

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
//   useEffect(() => {
//     console.log('🔍 Full data object from useApi:', data);
//     if (data?.selected?.length > 0) {
//       const ids = data.selected.map((item) => item.id.split('/').pop());
//       setOrderIds(ids);
//     }
//   }, [data]);

//   const handleSendToApp = async () => {
//     setIsLoading(true);
//     setResponseMsg('🔄 Starting...');
//     setDebugInfo('');

//     try {
//       if (!orderIds.length) {
//         throw new Error('No orders selected. Please select orders first.');
//       }

//       setResponseMsg('🔄 Connecting to app...');
//       setDebugInfo(`Processing ${orderIds.length} order(s): ${orderIds.join(', ')}`);

//       // Directly hit our process-orders endpoint
//       const response = await fetch('/api/process-orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({ orderIds }),
//       });

//       console.log('📨 Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`API request failed: ${response.status} ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('📋 API response received:', result);

//       // Match new backend format
//       if (result.results) {
//         const { successful, failed } = result.results;
//         if (successful.length > 0) {
//           setResponseMsg(
//             `✅ Success! ${successful.length} order(s) processed successfully!` +
//               (failed.length > 0 ? ` ${failed.length} failed.` : '')
//           );
//         } else {
//           setResponseMsg('❌ All orders failed to process.');
//         }
//         return;
//       }

//       throw new Error('Unexpected API response format.');
//     } catch (err) {
//       console.error('❌ Error in sending orders:', err);
//       setResponseMsg(`❌ Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

  // Extract all order IDs from selected orders
 useEffect(() => {
  console.log('🔍 Full data object from useApi:', data); // Add this line

  if (data?.selected?.length > 0) {
    const ids = data.selected.map((item) => item.id.split('/').pop());
    setOrderIds(ids);
  }
}, [data]);


  // Send to app/backend
const handleSendToApp = async () => {
  setIsLoading(true);
  try {
    // Step 1: Call Remix backend to get order details
    const remixRes = await fetch('/resources/bulk-order-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderIds }),
    });

    const orderDetails = await remixRes.json();
    console.log('✅ Order details received from Remix:', orderDetails);

    // Step 2 & 3: Send each order individually with modified payload
    for (const order of orderDetails.orders) {
      // Add `orderReferenceNumber` (keep `order_number`)
      order.orderReferenceNumber = String(order.order_number);;

      const individualPayload = {
        shopifyStoreUrl: `https://${orderDetails.shopifyStoreUrl}`,
        orders: [order],
      };

      const externalRes = await fetch('https://backend.rushr-admin.com/api/orders/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${orderDetails.token}`,
        },
        body: JSON.stringify(individualPayload),
      });

      const result = await externalRes.json();
      console.log('✅ Sent order:', order.id, 'Response:', result);
    }

    setResponseMsg('✅ Orders sent to external app successfully!');
  } catch (err) {
    console.error('❌ Error in sending orders:', err);
    setResponseMsg('❌ Failed to send orders.');
  } finally {
    setIsLoading(false);
  }
};




  return (
    <AdminAction
      primaryAction={
        <Button disabled={!orderIds.length} loading={isLoading} onPress={handleSendToApp}>
          Send to App
        </Button>
      }
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <BlockStack spacing="tight">
        <Text fontWeight="bold">Selected Orders</Text>
        {orderIds.length === 0 ? (
          <Text>No orders selected.</Text>
        ) : (
          <Text>Orders: {orderIds.join(', ')}</Text>
        )}
        {responseMsg && <Text>{responseMsg}</Text>}
      </BlockStack>
    </AdminAction>
  );
}