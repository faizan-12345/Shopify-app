// import { extend, Button } from '@shopify/ui-extensions/admin';

// extend('Admin::Order::Action', (root, { data, done, close }) => {
//   const sendToLogistics = () => {
//     // Call your app's API to send this order to logistics
//     fetch('/admin/api/send-to-logistics', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         orderId: data.selected[0].id,
//         orderNumber: data.selected[0].name,
//       }),
//     })
//     .then(response => response.json())
//     .then(result => {
//       if (result.success) {
//         // Show success message
//         done();
//       } else {
//         // Handle error
//         console.error('Failed to send order:', result.error);
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   };

//   const orderActionButton = root.createComponent(Button, {
//     title: 'Send to Logistics',
//     onPress: sendToLogistics,
//   });

//   root.appendChild(orderActionButton);
// });
// extensions/order-action/src/ActionExtension.jsx





// import { extend, Button } from '@shopify/ui-extensions-admin';

// extend('Admin::Order::Action', (root, { data, done }) => {
//   const order = data.selected[0];

//   const sendToLogistics = () => {
//     // Get the order details
//     const orderId = order.id;
//     const orderNumber = order.name;
    
//     // Create the URL to your app
//     const appUrl = new URL('https://occupational-phrase-austria-oriented.trycloudflare.com/orders');
//     appUrl.searchParams.append('orderId', orderId);
//     appUrl.searchParams.append('orderNumber', orderNumber);
    
//     // Open in a new tab
//     window.open(appUrl.toString(), '_blank');
    
//     // Close the action modal
//     done();
//   };

//   const orderActionButton = root.createComponent(Button, {
//     onPress: sendToLogistics,
//   }, 'Book to Testing Logistic App');

//   root.appendChild(orderActionButton);
// });

import { Text, BlockStack } from "@shopify/polaris";

export default function ActionExtension() {
  return (
    <BlockStack padding="400">
      <Text variant="headingMd">✅ Modal opened successfully!</Text>
    </BlockStack>
  );
}