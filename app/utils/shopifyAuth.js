// import { sessionStorage } from "../shopify.server";
// import prisma from "../db.server";

// export async function getValidAccessToken(shop) {
//   try {
//     // First, try to get the most recent session from the database
//     const session = await prisma.session.findFirst({
//       where: {
//         shop: shop,
//       },
//       orderBy: {
//         id: 'desc'
//       }
//     });

//     if (!session) {
//       console.error(`❌ No session found for shop: ${shop}`);
//       return null;
//     }

//     // Check if we have the actual session data
//     const sessionData = session.data ? JSON.parse(session.data) : null;
    
//     if (sessionData?.accessToken) {
//       console.log(`✅ Found access token in session data for ${shop}`);
//       return sessionData.accessToken;
//     }

//     // If no access token in data, check the accessToken field directly
//     if (session.accessToken) {
//       console.log(`✅ Found access token in session field for ${shop}`);
//       return session.accessToken;
//     }

//     console.error(`❌ No access token found in session for ${shop}`);
//     return null;

//   } catch (error) {
//     console.error(`❌ Error getting access token for ${shop}:`, error);
//     return null;
//   }
// }

import { sessionStorage } from "../shopify.server";
import prisma from "../db.server";

export async function getValidAccessToken(shop) {
    try {
      const session = await prisma.session.findUnique({
        where: {
          shop
        },
        select: {
          accessToken: true,
        }
      });
      console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ Found access token in session field for", session?.accessToken);
      return session?.accessToken || null;
    } catch (err) {
      console.error("❌ Error fetching Shopify access token:", err);
      return null;
    }
  }