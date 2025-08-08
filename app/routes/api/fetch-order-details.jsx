// app/routes/api/fetch-order-details.jsx
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const headers = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

export const loader = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const { session } = await authenticate.admin(request);
  const { orderIds } = await request.json();

  if (!orderIds?.length) {
    return json({ error: "No order IDs provided." }, { status: 400 });
  }

  const GET_ORDER_QUERY = `
    query getOrders($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Order {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            firstName
            lastName
            email
          }
        }
      }
    }
  `;

  const response = await session.admin.graphql(GET_ORDER_QUERY, {
    variables: { ids: orderIds },
  });

  const jsonResponse = await response.json();
  console.log("📦 Order Data from Remix Route:", jsonResponse?.data?.nodes);

  return json({ orders: jsonResponse?.data?.nodes });
};
