// // import "@shopify/shopify-app-remix/adapters/node";
// // import {
// //   ApiVersion,
// //   AppDistribution,
// //   shopifyApp,
// // } from "@shopify/shopify-app-remix/server";
// // import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// // import prisma from "./db.server";

// // const shopify = shopifyApp({
// //   apiKey: process.env.SHOPIFY_API_KEY,
// //   apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
// //   apiVersion: ApiVersion.January25,
// //   // scopes: process.env.SCOPES?.split(","),
// //   scopes: ['read_orders', 'write_orders', 'read_products', 'write_products'],
// //   appUrl: process.env.SHOPIFY_APP_URL || "",
// //   authPathPrefix: "/auth",
// //   sessionStorage: new PrismaSessionStorage(prisma),
// //   distribution: AppDistribution.AppStore,
// //   future: {
// //     unstable_newEmbeddedAuthStrategy: true,
// //     removeRest: true,
// //   },
// //   ...(process.env.SHOP_CUSTOM_DOMAIN
// //     ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
// //     : {}),
// // });

// // export default shopify;
// // export const apiVersion = ApiVersion.January25;
// // export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
// // export const authenticate = shopify.authenticate;
// // export const unauthenticated = shopify.unauthenticated;
// // export const login = shopify.login;
// // export const registerWebhooks = shopify.registerWebhooks;
// // export const sessionStorage = shopify.sessionStorage;


// import "@shopify/shopify-app-remix/adapters/node";
// import {
//   ApiVersion,
//   AppDistribution,
//   shopifyApp,
// } from "@shopify/shopify-app-remix/server";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import prisma from "./db.server";

// const shopify = shopifyApp({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
//   apiVersion: ApiVersion.January25,
//   scopes: process.env.SCOPES?.split(","),
//   appUrl: process.env.SHOPIFY_APP_URL || "",
//   authPathPrefix: "/auth",
//   sessionStorage: new PrismaSessionStorage(prisma),
//   distribution: AppDistribution.AppStore,
//   future: {
//     unstable_newEmbeddedAuthStrategy: true,
//     removeRest: true,
//   },
//   ...(process.env.SHOP_CUSTOM_DOMAIN
//     ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
//     : {}),
// });
// console.log("scopes from custom code",process.env.SCOPES?.split(","));
// export default shopify;
// export const apiVersion = ApiVersion.January25;
// export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
// export const authenticate = shopify.authenticate;
// export const unauthenticated = shopify.unauthenticated;
// export const login = shopify.login;
// export const registerWebhooks = shopify.registerWebhooks;
// export const sessionStorage = shopify.sessionStorage;














// import "@shopify/shopify-app-remix/adapters/node";
// import {
//   ApiVersion,
//   AppDistribution,
//   shopifyApp,
// } from "@shopify/shopify-app-remix/server";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import prisma from "./db.server";

// const shopify = shopifyApp({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
//   apiVersion: ApiVersion.July25,
//   // scopes: process.env.SCOPES?.split(","),
//   scopes: process.env.SCOPES?.split(",") || [
//     "read_customers","read_orders","customer_read_orders","write_orders","write_products"
//   ],
//   appUrl: process.env.SHOPIFY_APP_URL || "",
//   authPathPrefix: "/auth",
//   sessionStorage: new PrismaSessionStorage(prisma),
//   distribution: AppDistribution.AppStore,
//   future: {
//     unstable_newEmbeddedAuthStrategy: true,
//     removeRest: true,
//   },
//   ...(process.env.SHOP_CUSTOM_DOMAIN
//     ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
//     : {}),
// });

// export default shopify;
// export const apiVersion = ApiVersion.July25;
// export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
// export const authenticate = shopify.authenticate;
// export const unauthenticated = shopify.unauthenticated;
// export const login = shopify.login;
// export const registerWebhooks = shopify.registerWebhooks;
// export const sessionStorage = shopify.sessionStorage;

// export async function getTokenFromSession(request) {
//   const { session } = await shopify.authenticate.admin(request);
//   return session?.accessToken; // Adjust key if you're saving token differently
// }


import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// Debug: log env scopes
console.log("🔍 SCOPES from .env:", process.env.SCOPES);

const scopesArray = process.env.SCOPES?.split(",") || [
  "read_customers",
  "read_orders",
  "customer_read_orders",
  "write_orders",
  "write_products",
];

// Debug: log final scopes array
console.log("🔍 Final Shopify scopes:", scopesArray);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.July25,
  scopes: scopesArray,
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.July25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

export async function getTokenFromSession(request) {
  const { session } = await shopify.authenticate.admin(request);

  // Debug: log session object
  console.log("🔍 Session retrieved from Shopify:", JSON.stringify(session, null, 2));

  return session?.accessToken;
}
