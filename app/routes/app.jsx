
// import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
// import { json } from "@remix-run/node";
// import { boundary } from "@shopify/shopify-app-remix/server";
// import { AppProvider } from "@shopify/shopify-app-remix/react";
// import { NavMenu } from "@shopify/app-bridge-react";
// import { authenticate } from "../shopify.server";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css";

// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
// };
// console.log(`${ process.env.SHOPIFY_API_KEY + "This is the API KEY FROM CONSOLE LOG" || ""}`)
// export default function App() {
//   const { apiKey } = useLoaderData();

//   return (
//     <AppProvider isEmbeddedApp apiKey={apiKey}>
//       {/* Add navigation using Shopify's NavMenu */}
//       <NavMenu>
//         <Link to="/app" rel="home">
//           Dashboard
//         </Link>
//         <Link to="/app/orders">
//           Orders
//         </Link>
//         <Link to="/app/status">
//           Logistics Status
//         </Link>
//       </NavMenu>
//       <Outlet />
//     </AppProvider>
//   );
// }

// // Error Boundary
// export function ErrorBoundary() {
//   return boundary.error(useRouteError());
// }

import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {/* <Link to="/app/additional">Additional page</Link> */}
                <Link to="/app/orders">Orders</Link>
        <Link to="/app/analytics">Analytics</Link>
        <Link to="/app/tracking">Tracking</Link>
        <Link to="/app/settings">Settings</Link>
        <Link to="/app/riders">Riders</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};