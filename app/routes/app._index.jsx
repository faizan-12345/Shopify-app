// import { useEffect } from "react";
// import { useFetcher } from "@remix-run/react";
// import {
//   Page,
//   Layout,
//   Text,
//   Card,
//   Button,
//   BlockStack,
//   Box,
//   List,
//   Link,
//   InlineStack,
// } from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return null;
// };

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const color = ["Red", "Orange", "Yellow", "Green"][
//     Math.floor(Math.random() * 4)
//   ];
//   const response = await admin.graphql(
//     `#graphql
//       mutation populateProduct($product: ProductCreateInput!) {
//         productCreate(product: $product) {
//           product {
//             id
//             title
//             handle
//             status
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   price
//                   barcode
//                   createdAt
//                 }
//               }
//             }
//           }
//         }
//       }`,
//     {
//       variables: {
//         product: {
//           title: `${color} Snowboard`,
//         },
//       },
//     },
//   );
//   const responseJson = await response.json();
//   const product = responseJson.data.productCreate.product;
//   const variantId = product.variants.edges[0].node.id;
//   const variantResponse = await admin.graphql(
//     `#graphql
//     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
//         productVariants {
//           id
//           price
//           barcode
//           createdAt
//         }
//       }
//     }`,
//     {
//       variables: {
//         productId: product.id,
//         variants: [{ id: variantId, price: "100.00" }],
//       },
//     },
//   );
//   const variantResponseJson = await variantResponse.json();

//   return {
//     product: responseJson.data.productCreate.product,
//     variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
//   };
// };

// export default function Index() {
//   const fetcher = useFetcher();
//   const shopify = useAppBridge();
//   const isLoading =
//     ["loading", "submitting"].includes(fetcher.state) &&
//     fetcher.formMethod === "POST";
//   const productId = fetcher.data?.product?.id.replace(
//     "gid://shopify/Product/",
//     "",
//   );

//   useEffect(() => {
//     if (productId) {
//       shopify.toast.show("Product created");
//     }
//   }, [productId, shopify]);
//   const generateProduct = () => fetcher.submit({}, { method: "POST" });

//   return (
//     <Page>
//       <TitleBar title="Remix app template">
//         <button variant="primary" onClick={generateProduct}>
//           Generate a product
//         </button>
//       </TitleBar>
//       <BlockStack gap="500">
//         <Layout>
//           <Layout.Section>
//             <Card>
//               <BlockStack gap="500">
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     Congrats on creating a new Shopify app 🎉
//                   </Text>
//                   <Text variant="bodyMd" as="p">
//                     This embedded app template uses{" "}
//                     <Link
//                       url="https://shopify.dev/docs/apps/tools/app-bridge"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       App Bridge
//                     </Link>{" "}
//                     interface examples like an{" "}
//                     <Link url="/app/additional" removeUnderline>
//                       additional page in the app nav
//                     </Link>
//                     , as well as an{" "}
//                     <Link
//                       url="https://shopify.dev/docs/api/admin-graphql"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       Admin GraphQL
//                     </Link>{" "}
//                     mutation demo, to provide a starting point for app
//                     development.
//                   </Text>
//                 </BlockStack>
//                 <BlockStack gap="200">
//                   <Text as="h3" variant="headingMd">
//                     Get started with products
//                   </Text>
//                   <Text as="p" variant="bodyMd">
//                     Generate a product with GraphQL and get the JSON output for
//                     that product. Learn more about the{" "}
//                     <Link
//                       url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       productCreate
//                     </Link>{" "}
//                     mutation in our API references.
//                   </Text>
//                 </BlockStack>
//                 <InlineStack gap="300">
//                   <Button loading={isLoading} onClick={generateProduct}>
//                     Generate a product
//                   </Button>
//                   {fetcher.data?.product && (
//                     <Button
//                       url={`shopify:admin/products/${productId}`}
//                       target="_blank"
//                       variant="plain"
//                     >
//                       View product
//                     </Button>
//                   )}
//                 </InlineStack>
//                 {fetcher.data?.product && (
//                   <>
//                     <Text as="h3" variant="headingMd">
//                       {" "}
//                       productCreate mutation
//                     </Text>
//                     <Box
//                       padding="400"
//                       background="bg-surface-active"
//                       borderWidth="025"
//                       borderRadius="200"
//                       borderColor="border"
//                       overflowX="scroll"
//                     >
//                       <pre style={{ margin: 0 }}>
//                         <code>
//                           {JSON.stringify(fetcher.data.product, null, 2)}
//                         </code>
//                       </pre>
//                     </Box>
//                     <Text as="h3" variant="headingMd">
//                       {" "}
//                       productVariantsBulkUpdate mutation
//                     </Text>
//                     <Box
//                       padding="400"
//                       background="bg-surface-active"
//                       borderWidth="025"
//                       borderRadius="200"
//                       borderColor="border"
//                       overflowX="scroll"
//                     >
//                       <pre style={{ margin: 0 }}>
//                         <code>
//                           {JSON.stringify(fetcher.data.variant, null, 2)}
//                         </code>
//                       </pre>
//                     </Box>
//                   </>
//                 )}
//               </BlockStack>
//             </Card>
//           </Layout.Section>
//           <Layout.Section variant="oneThird">
//             <BlockStack gap="500">
//               <Card>
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     App template specs
//                   </Text>
//                   <BlockStack gap="200">
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Framework
//                       </Text>
//                       <Link
//                         url="https://remix.run"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         Remix
//                       </Link>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Database
//                       </Text>
//                       <Link
//                         url="https://www.prisma.io/"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         Prisma
//                       </Link>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Interface
//                       </Text>
//                       <span>
//                         <Link
//                           url="https://polaris.shopify.com"
//                           target="_blank"
//                           removeUnderline
//                         >
//                           Polaris
//                         </Link>
//                         {", "}
//                         <Link
//                           url="https://shopify.dev/docs/apps/tools/app-bridge"
//                           target="_blank"
//                           removeUnderline
//                         >
//                           App Bridge
//                         </Link>
//                       </span>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         API
//                       </Text>
//                       <Link
//                         url="https://shopify.dev/docs/api/admin-graphql"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         GraphQL API
//                       </Link>
//                     </InlineStack>
//                   </BlockStack>
//                 </BlockStack>
//               </Card>
//               <Card>
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     Next steps
//                   </Text>
//                   <List>
//                     <List.Item>
//                       Build an{" "}
//                       <Link
//                         url="https://shopify.dev/docs/apps/getting-started/build-app-example"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         {" "}
//                         example app
//                       </Link>{" "}
//                       to get started
//                     </List.Item>
//                     <List.Item>
//                       Explore Shopify’s API with{" "}
//                       <Link
//                         url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         GraphiQL
//                       </Link>
//                     </List.Item>
//                   </List>
//                 </BlockStack>
//               </Card>
//             </BlockStack>
//           </Layout.Section>
//         </Layout>
//       </BlockStack>
//     </Page>
//   );
// // }
// import { useLoaderData } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import { json } from "@remix-run/node";
// import { Card, Page, Layout, Text, Button, BlockStack } from "@shopify/polaris";

// export const loader = async ({ request }) => {
//   try {
//     const { admin, session } = await authenticate.admin(request);
    
//     // Method 1: Try using GraphQL query (more reliable)
//     const ordersQuery = `
//       query getOrders {
//         orders(first: 10) {
//           edges {
//             node {
//               id
//               name
//               totalPriceSet {
//                 shopMoney {
//                   amount
//                   currencyCode
//                 }
//               }
//               fulfillmentStatus
//               customer {
//                 firstName
//                 lastName
//               }
//               createdAt
//             }
//           }
//         }
//       }
//     `;

//     let orders = [];
    
//     try {
//       const response = await admin.graphql(ordersQuery);
//       const data = await response.json();
      
//       if (data.data && data.data.orders) {
//         orders = data.data.orders.edges.map(edge => ({
//           id: edge.node.id,
//           name: edge.node.name,
//           totalPrice: edge.node.totalPriceSet.shopMoney.amount,
//           currency: edge.node.totalPriceSet.shopMoney.currencyCode,
//           fulfillmentStatus: edge.node.fulfillmentStatus,
//           customerName: edge.node.customer 
//             ? `${edge.node.customer.firstName || ''} ${edge.node.customer.lastName || ''}`.trim()
//             : 'N/A',
//           createdAt: edge.node.createdAt
//         }));
//       }
//     } catch (graphqlError) {
//       console.log("GraphQL failed, trying REST API...", graphqlError);
      
//       // Method 2: Fallback to REST API with different syntax
//       try {
//         // Try the newer REST API syntax
//         const restResponse = await fetch(`https://${session.shop}/admin/api/2023-10/orders.json?limit=10&status=any`, {
//           headers: {
//             'X-Shopify-Access-Token': session.accessToken,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (restResponse.ok) {
//           const restData = await restResponse.json();
//           orders = restData.orders.map(order => ({
//             id: order.id,
//             name: `#${order.order_number}`,
//             totalPrice: order.total_price,
//             currency: order.currency || 'USD',
//             fulfillmentStatus: order.fulfillment_status,
//             customerName: order.customer 
//               ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
//               : 'N/A',
//             createdAt: order.created_at
//           }));
//         }
//       } catch (restError) {
//         console.log("REST API also failed:", restError);
//       }
//     }

//     return json({
//       orders,
//       shop: session.shop,
//     });
    
//   } catch (error) {
//     console.error("Loader error:", error);
//     return json({
//       orders: [],
//       shop: "Unknown",
//       error: error.message
//     });
//   }
// };
// export const loader = async ({ request }) => {
//   const { session } = await authenticate.admin(request);
//   console.log('ACCESS TOKEN:', session.accessToken);  
//   console.log('SHOP:', session.shop);  
//   // Mock data for testing
//   const mockOrders = [
//     {
//       id: "1",
//       name: "#1001",
//       totalPrice: "25.00",
//       currency: "USD",
//       fulfillmentStatus: "unfulfilled",
//       customerName: "John Doe"
//     },
//     {
//       id: "2", 
//       name: "#1002",
//       totalPrice: "45.00",
//       currency: "USD", 
//       fulfillmentStatus: "fulfilled",
//       customerName: "Jane Smith"
//     }
//   ];

//   return json({
//     orders: mockOrders,
//     shop: session.shop,
//   });
// };
// const sendToLogistics = async (order) => {
//   try {
//     const response = await fetch('http://localhost:5000/api/orders', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         shopifyOrderId: order.id,
//         customerName: order.customerName,
//         orderName: order.name,
//         total: order.totalPrice,
//         currency: order.currency,
//         status: order.fulfillmentStatus || 'unfulfilled'
//       }),
//     });
    
//     if (response.ok) {
//       alert('Order sent to logistics successfully!');
//     } else {
//       alert('Failed to send order to logistics');
//     }
//   } catch (error) {
//     console.error('Error sending order:', error);
//     alert('Error sending order to logistics');
//   }
// // };
// const sendToLogistics = async (order) => {
//   try {
//     const response = await fetch('http://localhost:5000/api/orders', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         shopifyOrderId: order.id,
//         customerName: order.customerName,
//         orderName: order.name,
//         total: order.totalPrice,
//         currency: order.currency,
//         status: order.fulfillmentStatus || 'unfulfilled',
//         address: "N/A" // ✅ Add this to prevent backend issues
//       }),
//     });

//     if (response.ok) {
//       alert('Order sent to logistics successfully!'); // ✅ Success alert
//     } else {
//       alert('Failed to send order to logistics');
//     }
//   } catch (error) {
//     console.error('Error sending order:', error);
//     alert('Error sending order to logistics');
//   }
// };

// export default function Index() {
//   const { orders, shop, error } = useLoaderData();

//   if (error) {
//     return (
//       <Page title="Logistics Dashboard">
//         <Layout>
//           <Layout.Section>
//             <Card>
//               <BlockStack gap="200">
//                 <Text variant="headingMd" tone="critical">Error Loading Data</Text>
//                 <Text>{error}</Text>
//               </BlockStack>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     );
//   }

//   return (
//     <Page title="Logistics Dashboard">
//       <Layout>
//         <Layout.Section>
//           <Card>
//             <BlockStack gap="200">
//               <Text variant="headingMd">Store: {shop}</Text>
//               <Text>Connected to logistics system</Text>
//               <Text variant="bodySm" tone="subdued">
//                 Total Orders Loaded: {orders.length}
//               </Text>
//             </BlockStack>
//           </Card>
//         </Layout.Section>
        
//         <Layout.Section>
//           <Card title="Recent Orders">
//             <BlockStack gap="300">
//               {orders.length === 0 ? (
//                 <Text>No orders found. Try creating some test orders in your store.</Text>
//               ) : (
//                 orders.map((order) => (
//                   <div key={order.id} style={{ 
//                     padding: "15px", 
//                     borderBottom: "1px solid #eee",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center"
//                   }}>
//                     <div>
//                       <Text variant="headingSm">Order {order.name}</Text>
//                       <Text>Customer: {order.customerName}</Text>
//                       <Text>Status: {order.fulfillmentStatus || "Unfulfilled"}</Text>
//                       <Text>Total: {order.currency} {order.totalPrice}</Text>
//                     </div>
//                     <Button 
//                       size="small" 
//                       onClick={() => sendToLogistics(order)}
//                     >
//                       Send to Logistics
//                     </Button>
//                   </div>
//                 ))
//               )}
//             </BlockStack>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// }

import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  TextField,
  Button,
  BlockStack,
  Select,
  Box,
  Banner,
  IndexTable,
  useIndexResourceState,
  Spinner,
  Modal,
  Divider,
  Badge,
  InlineStack,
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
  "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur", "Abbottabad", "Mardan", "Swat", "Dera Ghazi Khan", "Sheikhupura", "Jhelum"
];

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return {
    shopifyStoreName: session.shop.split(".")[0],
    shopifyStoreUrl: `https://${session.shop}`,
  };
};

function RushrrDashboard({ token }) {
  const [orders, setOrders] = useState([]);
  const [bookedOrders, setBookedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [originalOrder, setOriginalOrder] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  console.log(editedOrder)
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("api/orders", { method: "GET" });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

 const handleEditClick = (order) => {
  setActiveOrder(order);

  const mapped = mapOrderForEditing(order);
  setEditedOrder(mapped);
  setOriginalOrder(mapped); // Save baseline
};

function getAllowedOrderUpdates(original, edited) {
  const updates = {};

  if (original.customerEmail !== edited.customerEmail) {
    updates.email = edited.customerEmail;
  }

  if (original.currency !== edited.currency) {
    updates.currency = edited.currency;
  }

  if (original.totalPrice !== edited.totalPrice) {
    updates.total_price = edited.totalPrice;
  }

  // SHIPPING ADDRESS CHANGES
  const shippingChangedFields = {};
  if (original.shippingAddress?.city !== edited.shippingAddress?.city) {
    shippingChangedFields.city = edited.shippingAddress.city;
  }
  if (original.shippingAddress?.phone !== edited.shippingAddress?.phone) {
    shippingChangedFields.phone = edited.shippingAddress.phone;
  }
  if (original.shippingAddress?.address1 !== edited.shippingAddress?.address1) {
    shippingChangedFields.address1 = edited.shippingAddress.address1;
  }
  if (Object.keys(shippingChangedFields).length > 0) {
    updates.shipping_address = shippingChangedFields;
  }

  // BILLING ADDRESS CHANGES
  const billingChangedFields = {};
  if (original.billingAddress?.city !== edited.billingAddress?.city) {
    billingChangedFields.city = edited.billingAddress.city;
  }
  if (original.billingAddress?.address1 !== edited.billingAddress?.address1) {
    billingChangedFields.address1 = edited.billingAddress.address1;
  }
  if (Object.keys(billingChangedFields).length > 0) {
    updates.billing_address = billingChangedFields;
  }

  return updates;
}





  const handleSaveEdit = async () => {
  if (!activeOrder?.id || !originalOrder) return;

  const updates = getAllowedOrderUpdates(originalOrder, editedOrder);

  if (Object.keys(updates).length === 0) {
    alert("No changes to save.");
    return;
  }

  try {
    const res = await fetch(`https://backend.rushr-admin.com/api/orders/update?id=${activeOrder.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Order updated successfully!");
      setActiveOrder(null);
    } else {
      alert(data?.message || "Update failed.");
    }
  } catch (err) {
    console.error("Update error:", err);
    alert("An error occurred while updating the order.");
  }
};






  const handleUploadBookings = async () => {
  if (selectedResources.length === 0) {
    alert("Please select at least one order.");
    return;
  }

  setBookingLoading(true);

  try {
    // Filter selected orders
    const selectedOrders = orders.filter(order => selectedResources.includes(order.id));

    // Extract their Shopify Order IDs
    const shopifyOrderIds = selectedOrders.map(order => order.shopifyOrderId);

    const res = await fetch("https://backend.rushr-admin.com/api/orders/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId: shopifyOrderIds }), // <-- note: plural
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Generate airway bills
      for (const order of selectedOrders) {
        await generateAirwayBill(order);
      }

      setBookedOrders((prev) => [...prev, ...selectedOrders]);
      const remaining = orders.filter(order => !selectedResources.includes(order.id));
      setOrders(remaining);

      alert(`${selectedOrders.length} order(s) booked successfully! Airway bills have been downloaded.`);
    } else {
      alert(data.message || "Booking failed");
    }
  } catch (err) {
    console.error("Booking failed:", err);
    alert("An error occurred while booking orders.");
  } finally {
    setBookingLoading(false);
  }
};


  const selectedOrders = orders.filter((order) => order.status === "unbooked");

  const rows = selectedOrders.map((order, index) => {
    const shopifyData = order.shopifyOrderData || {};
    const customer = shopifyData.customer || {};
    const billingAddress = shopifyData.billing_address || {};
    const shippingAddress = shopifyData.shipping_address || {};

    return (
      <IndexTable.Row
        id={order.id}
        key={order.id}
        selected={selectedResources.includes(order.id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="medium">
            {index + 1}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="info">{shopifyData.order_number || "-"}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="medium">
            {`${customer.first_name || ""} ${customer.last_name || ""}`}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="attention">{billingAddress.city || "-"}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd">{order.codCollected ?? "N/A"}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="warning">{order.status || "Unbooked"}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" color="subdued">
            {shippingAddress.address1 || "N/A"}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" color="success">
            {`${shopifyData.total_price || "0.00"} ${
              shopifyData.currency || "PKR"
            }`}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button size="slim" onClick={() => handleEditClick(order)}>
            Edit
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  if (loading) {
    return (
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="800" textAlign="center">
                <Spinner size="large" />
                <Box paddingBlockStart="400">
                  <Text variant="headingMd">Loading orders...</Text>
                </Box>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page fullWidth>
      <Layout>
        {/* Modern Header */}
        <Layout.Section>
          <Card>
            <Box padding="600">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="400" blockAlign="center">
                  <img
                    src="https://res.cloudinary.com/dgiqiysh5/image/upload/v1750681695/WhatsApp_Image_2025-06-23_at_16.02.36_vyjear.jpg"
                    alt="Rushrr Logo"
                    style={{ 
                      height: "50px", 
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                  <BlockStack gap="100">
                    <Text variant="headingLg" as="h1">
                      📦 Rushrr Courier Dashboard
                    </Text>
                    <Text variant="bodyMd" color="subdued">
                      Manage and book orders from your Shopify store with automated airway bill generation
                    </Text>
                  </BlockStack>
                </InlineStack>
                <Box>
                  <Badge tone="success" size="large">
                    {selectedOrders.length} Unbooked Orders
                  </Badge>
                </Box>
              </InlineStack>
            </Box>
          </Card>
        </Layout.Section>

        {/* Statistics Cards */}
        <Layout.Section>
          <InlineStack gap="400">
            <div style={{ flex: 1 }}>
              <Card>
                <Box padding="400" textAlign="center">
                  <Text variant="headingXl" color="success">
                    {selectedOrders.length}
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    Unbooked Orders
                  </Text>
                </Box>
              </Card>
            </div>
            <div style={{ flex: 1 }}>
              <Card>
                <Box padding="400" textAlign="center">
                  <Text variant="headingXl" color="info">
                    {bookedOrders.length}
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    Booked Orders
                  </Text>
                </Box>
              </Card>
            </div>
           
          </InlineStack>
        </Layout.Section>

        {/* Unbooked Orders Table */}
        <Layout.Section>
          <Card>
            <Box padding="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd">Unbooked Orders</Text>
                <Button 
                  variant="primary" 
                  onClick={handleUploadBookings}
                  loading={bookingLoading}
                  disabled={selectedResources.length === 0}
                  size="large"
                >
                  {bookingLoading ? 'Booking & Generating Bills...' : `Book ${selectedResources.length} Orders`}
                </Button>
              </InlineStack>
            </Box>
            
            <IndexTable
              resourceName={{ singular: "order", plural: "orders" }}
              itemCount={selectedOrders.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "#" },
                { title: "Order #" },
                { title: "Customer" },
                { title: "City" },
                { title: "COD" },
                { title: "Status" },
                { title: "Shipping Address" },
                { title: "Amount" },
                { title: "Actions" }
              ]}
              selectable
            >
              {rows}
            </IndexTable>
          </Card>
        </Layout.Section>

        {/* Booked Orders Table */}
        {bookedOrders.length > 0 && (
          <Layout.Section>
            <Card>
              <Box padding="400">
                <Text variant="headingMd">Recently Booked Orders</Text>
              </Box>
              
              <IndexTable
                resourceName={{
                  singular: "booked order",
                  plural: "booked orders"
                }}
                itemCount={bookedOrders.length}
                headings={[
                  { title: "#" },
                  { title: "Order #" },
                  { title: "Customer" },
                  { title: "City" },
                  { title: "COD" },
                  { title: "Status" },
                  { title: "Shipping Address" },
                  { title: "Amount" },
                  { title: "Airway Bill" }
                ]}
                selectable={false}
              >
                {bookedOrders.map((order, index) => {
                  const shopifyData = order.shopifyOrderData || {};
                  const customer = shopifyData.customer || {};
                  const billingAddress = shopifyData.billing_address || {};
                  const shippingAddress = shopifyData.shipping_address || {};

                  return (
                    <IndexTable.Row
                      id={`booked-${order.id}`}
                      key={order.id}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="medium">
                          {index + 1}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone="info">{shopifyData.order_number || "-"}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="medium">
                          {`${customer.first_name || ""} ${customer.last_name || ""}`}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone="attention">{billingAddress.city || "-"}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text variant="bodyMd">{order.codCollected ?? "N/A"}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone="success">Booked</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text variant="bodyMd" color="subdued">
                          {shippingAddress.address1 || "N/A"}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="semibold" color="success">
                          {`${shopifyData.total_price || "0.00"} ${
                            shopifyData.currency || "PKR"
                          }`}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Button 
                          size="slim" 
                          onClick={() => generateAirwayBill(order)}
                          tone="success"
                        >
                          Download Bill
                        </Button>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  );
                })}
              </IndexTable>
            </Card>
          </Layout.Section>
        )}
      </Layout>

      {/* Edit Order Modal */}
      {activeOrder && (
        <Modal
          open
          onClose={() => setActiveOrder(null)}
          title={`Edit Order #${activeOrder.orderNumber}`}
          primaryAction={{
            content: "Save Changes",
            onAction: handleSaveEdit,
          }}
          secondaryActions={[
            { content: "Cancel", onAction: () => setActiveOrder(null) }
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <TextField
                label="Customer Name"
                value={editedOrder.customerName || ""}
                onChange={(val) => setEditedOrder({ ...editedOrder, customerName: val })}
              />
              <TextField
                label="Customer Email"
                value={editedOrder.customerEmail || ""}
                onChange={(val) => setEditedOrder({ ...editedOrder, customerEmail: val })}
              />
              <Select
                label="City"
                options={cities.map((city) => ({ label: city, value: city }))}
                value={editedOrder.shippingAddress?.city || ""}
                onChange={(val) =>
                  setEditedOrder({
                    ...editedOrder,
                    shippingAddress: {
                      ...editedOrder.shippingAddress,
                      city: val,
                    },
                  })
                }
              />
              <TextField
                label="Billing Address"
                value={editedOrder.billingAddress?.address1 || ""}
                onChange={(val) =>
                  setEditedOrder({
                    ...editedOrder,
                    billingAddress: {
                      ...editedOrder.billingAddress,
                      address1: val,
                    },
                  })
                }
              />
              <TextField
                label="Shipping Address"
                value={editedOrder.shippingAddress?.address1 || ""}
                onChange={(val) =>
                  setEditedOrder({
                    ...editedOrder,
                    shippingAddress: {
                      ...editedOrder.shippingAddress,
                      address1: val,
                    },
                  })
                }
              />
              <TextField
                label="Phone (Shipping)"
                value={editedOrder.shippingAddress?.phone || ""}
                onChange={(val) =>
                  setEditedOrder({
                    ...editedOrder,
                    shippingAddress: {
                      ...editedOrder.shippingAddress,
                      phone: val,
                    },
                  })
                }
              />
              <TextField
                label="Total Price"
                type="number"
                value={editedOrder.totalPrice || ""}
                onChange={(val) => setEditedOrder({ ...editedOrder, totalPrice: val })}
              />
              <TextField
                label="Currency"
                value={editedOrder.currency || ""}
                onChange={(val) => setEditedOrder({ ...editedOrder, currency: val })}
              />
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}


function mapOrderForEditing(order) {
  const shopify = order.shopifyOrderData || {};
  const customer = shopify.customer || {};
  const billing = shopify.billing_address || {};
  const shipping = shopify.shipping_address || {};

  return {
    ...order,
    customerName: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
    customerEmail: shopify.email || shopify.contact_email || "",
    billingAddress: {
      address1: billing.address1 || "",
      city: billing.city || "",
      country: billing.country || "",
      zip: billing.zip || "",
    },
    shippingAddress: {
      address1: shipping.address1 || "",
      city: shipping.city || "",
      country: shipping.country || "",
      zip: shipping.zip || "",
      phone: shipping.phone || shopify.phone || "",
    },
    totalPrice: shopify.total_price || "",
    currency: shopify.currency || "",
  };
}

const generateAirwayBill = async (order) => {
  const pdf = new jsPDF();
  const shopifyData = order.shopifyOrderData || {};
  const customer = shopifyData.customer || {};
  const billingAddress = shopifyData.billing_address || {};
  const shippingAddress = shopifyData.shipping_address || {};
  const qrData = JSON.stringify({
    orderNumber: shopifyData.order_number,
    customer: `${customer.first_name} ${customer.last_name}`,
    city: billingAddress.city,
    amount: shopifyData.total_price,
    currency: shopifyData.currency,
    phone: shippingAddress.phone,
    address: shippingAddress.address1
  });

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 100, margin: 1 });
    pdf.setFontSize(24).text("RUSHRR COURIER", 105, 25, { align: "center" });
    pdf.setFontSize(20).text("AIRWAY BILL", 105, 55, { align: "center" });
    pdf.setFontSize(14).text(`Order #: ${shopifyData.order_number || 'N/A'}`, 20, 75);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 85);
    pdf.setFontSize(12);
    pdf.text(`Name: ${customer.first_name || ''} ${customer.last_name || ''}`, 20, 120);
    pdf.text(`Email: ${customer.email || 'N/A'}`, 20, 128);
    pdf.text(`Phone: ${shippingAddress.phone || 'N/A'}`, 20, 136);
    pdf.text(`City: ${billingAddress.city || 'N/A'}`, 20, 144);
    pdf.text(shippingAddress.address1 || 'N/A', 20, 175);
    pdf.text(`${shippingAddress.city || ''}, ${shippingAddress.country || ''}`, 20, 185);
    pdf.text(`Postal Code: ${shippingAddress.zip || 'N/A'}`, 20, 195);
    pdf.text(`Total Amount: ${shopifyData.total_price || '0.00'} ${shopifyData.currency || 'PKR'}`, 20, 235);
    pdf.text(`COD: ${order.codCollected || 'N/A'}`, 20, 242);
    pdf.addImage(qrCodeDataURL, 'PNG', 150, 120, 40, 40);
    pdf.save(`Airway-Bill-${shopifyData.order_number || order.id}.pdf`);
  } catch (error) {
    console.error('Error generating QR code:', error);
    alert('Error generating airway bill. Please try again.');
  }
};

function getAllowedOrderUpdates(original, edited) {
  const updates = {};
  if (original.customerEmail !== edited.customerEmail) updates.email = edited.customerEmail;
  if (original.currency !== edited.currency) updates.currency = edited.currency;
  if (original.totalPrice !== edited.totalPrice) updates.total_price = edited.totalPrice;

  const shipping = {};
  if (original.shippingAddress?.city !== edited.shippingAddress?.city) shipping.city = edited.shippingAddress.city;
  if (original.shippingAddress?.phone !== edited.shippingAddress?.phone) shipping.phone = edited.shippingAddress.phone;
  if (original.shippingAddress?.address1 !== edited.shippingAddress?.address1) shipping.address1 = edited.shippingAddress.address1;
  if (Object.keys(shipping).length) updates.shipping_address = shipping;

  const billing = {};
  if (original.billingAddress?.city !== edited.billingAddress?.city) billing.city = edited.billingAddress.city;
  if (original.billingAddress?.address1 !== edited.billingAddress?.address1) billing.address1 = edited.billingAddress.address1;
  if (Object.keys(billing).length) updates.billing_address = billing;

  return updates;
}

// ✅ Main SetupPage Export (Remix Route)
export default function SetupPage() {
  const { shopifyStoreName, shopifyStoreUrl } = useLoaderData();
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const checkStoreConnection = async () => {
      try {
        const res = await fetch("https://backend.rushr-admin.com/api/auth/verify-shopify-store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopifyStoreUrl }),
        });
        const data = await res.json();
        if (res.ok && data?.success && data.token) {
          await fetch("/api/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: data.token }),
          });
          setToken(data.token);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Error verifying store:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkStoreConnection();
  }, [shopifyStoreUrl]);

  const handleSave = async () => {
    console.log("shopifyStoreUrl",shopifyStoreUrl);
    console.log("shopifyStoreName",shopifyStoreName);
    
    try {
      const res = await fetch("https://backend.rushr-admin.com/api/auth/verify-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: token, shopifyStoreUrl, shopifyStoreName }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsConnected(true);
        setResponseMessage({ type: "success", content: "Connection successful!" });
      } else {
        setResponseMessage({ type: "error", content: data?.error || "Verification failed." });
      }
    } catch (err) {
      setResponseMessage({ type: "error", content: "Server error." });
    }
  };

  if (isLoading) {
    return <Page><Spinner accessibilityLabel="Loading" size="large" /></Page>;
  }

  if (isConnected) {
    return <RushrrDashboard token={token} />;
  }

  return (
    <Page title="Setup Rushrr">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd">Connect to Rushrr</Text>
            <TextField
              label="API Token"
              value={token}
              onChange={(val) => setToken(val)}
              placeholder="Enter your token"
            />
            <Button onClick={handleSave}>Save Token</Button>
            {responseMessage && (
              <Banner status={responseMessage.type} title={responseMessage.content} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}