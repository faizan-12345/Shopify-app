// // Simple in-memory token store
// // const tokenStore = new Map();
// // console.log("tokenStore",tokenStore);

// import fs from 'fs';
// import path from 'path';

// const TOKEN_FILE_PATH = path.resolve('tokenStore.json');


// // 📥 Read tokens from file
// const readTokens = () => {
//   try {
//     if (!fs.existsSync(TOKEN_FILE_PATH)) {
//       fs.writeFileSync(TOKEN_FILE_PATH, '{}');
//     }
//     const data = fs.readFileSync(TOKEN_FILE_PATH, 'utf8');
//     return JSON.parse(data || '{}');
//   } catch (err) {
//     console.error('❌ Error reading token file:', err.message);
//     return {};
//   }
// };

// // 💾 Write updated token data to file
// const writeTokens = (tokens) => {
//   try {
//     fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokens, null, 2));
//     return true;
//   } catch (err) {
//     console.error('❌ Error writing token file:', err.message);
//     return false;
//   }
// };


// // export const saveToken = (shopUrl, token) => {
// //   try {
// //     tokenStore.set(shopUrl, token);
// //     console.log(`✅ Token saved for ${shopUrl}:`, token);
// //     console.log(`📊 Current store size:`, tokenStore.size);
// //     return true;
// //   } catch (error) {
// //     console.error('❌ Error saving token:', error);
// //     return false;
// //   }
// // };
// // ✅ Save or update a token for a shop
// export const saveToken = (shopUrl, token) => {
//   const tokens = readTokens();
//   tokens[shopUrl] = token;
//   const success = writeTokens(tokens);
//   if (success) console.log(`✅ Token saved for ${shopUrl}`);
//   return true;
// };

// // export const getToken = (shopUrl) => {
// //   try {
// //     const token = tokenStore.get(shopUrl);

// //     console.log(`🔍 Token retrieved for ${shopUrl}:`, token);
// //     return token || null;
// //   } catch (error) {
// //     console.error('❌ Error retrieving token:', error);
// //     return null;
// //   }
// // };

// export const getToken = (shopUrl) => {
//   const tokens = readTokens();
//   const token = tokens[shopUrl] || null;
//   console.log(`🔍 Token retrieved for ${shopUrl}:`, token);
//   return token;
// };


// // export const getAllTokens = () => {
// //   console.log('📋 All stored tokens:');
// //   tokenStore.forEach((token, shop) => {
// //     console.log(`  ${shop}: ${token}`);
// //   });
// //   return Object.fromEntries(tokenStore);
// // };

// // export const deleteToken = (shopUrl) => {
// //   try {
// //     const result = tokenStore.delete(shopUrl);
// //     console.log(`🗑️ Token deleted for ${shopUrl}:`, result);
// //     return result;
// //   } catch (error) {
// //     console.error('❌ Error deleting token:', error);
// //     return false;
// //   }
// // };

// // ❌ Delete a token for a shop
// export const deleteToken = (shopUrl) => {
//   const tokens = readTokens();
//   delete tokens[shopUrl];
//   return writeTokens(tokens);
// };

// // 📋 Get all saved tokens (useful for debug)
// export const getAllTokens = () => {
//   const tokens = readTokens();
//   console.log('📋 All stored tokens:', tokens);
//   return tokens;
// };















// Simple in-memory token store
// const tokenStore = new Map();

// export const saveToken = (shopUrl, token) => {
//   try {
//     tokenStore.set(shopUrl, token);
//     console.log(`✅ Token saved for ${shopUrl}:`, token);
//     console.log(`📊 Current store size:`, tokenStore.size);
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving token:', error);
//     return false;
//   }
// };

// export const getToken = (shopUrl) => {
//   try {
//     const token = tokenStore.get(shopUrl);
//     console.log(`🔍 Token retrieved for ${shopUrl}:`, token);
//     return token || null;
//   } catch (error) {
//     console.error('❌ Error retrieving token:', error);
//     return null;
//   }
// };

// export const getAllTokens = () => {
//   console.log('📋 All stored tokens:');
//   tokenStore.forEach((token, shop) => {
//     console.log(`  ${shop}: ${token}`);
//   });
//   return Object.fromEntries(tokenStore);
// };

// export const deleteToken = (shopUrl) => {
//   try {
//     const result = tokenStore.delete(shopUrl);
//     console.log(`🗑️ Token deleted for ${shopUrl}:`, result);
//     return result;
//   } catch (error) {
//     console.error('❌ Error deleting token:', error);
//     return false;
//   }
// };


// import { prisma } from "~/db.server";
// import prisma from "../db.server";

// export const saveToken = async (shop, token) => {
//   try {
//     await prisma.shop.upsert({
//       where: { shop },
//       update: { rushrrToken: token },
//       create: { shop, rushrrToken: token },
//     });
//     console.log(`✅✅✅✅✅ Token saved for ${shop}`);
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving token:', error);
//     return false;
//   }
// };

// export const getToken = async (shop) => {
//   try {
//     const shopData = await prisma.shop.findUnique({
//       where: { shop },
//       select: { rushrrToken: true },
//     });
//     return shopData?.rushrrToken || null;
//   } catch (error) {
//     console.error('❌ Error retrieving token:', error);
//     return null;
//   }
// };


// import prisma from "../db.server";

// // ✅ Save a token (upsert)
// export async function saveToken(shop, token) {
//   try {
//     const saved = await prisma.token.upsert({
//       where: { shop },
//       update: { token },
//       create: { shop, token },
//     });
//     console.log(`✅ Token saved for ${shop}`);
//     return saved;
//   } catch (error) {
//     console.error('❌ Error saving token:', error);
//     return null;
//   }
// }

// // ✅ Get a single token
// export async function getToken(shop) {
//   try {
//     const result = await prisma.token.findUnique({
//       where: { shop },
//     });

//     const exists = result?.token ? 'Found' : 'Not found';
//     console.log(`🔍 Token retrieved for ${shop}: ${exists}`);
//     return result?.token || null;
//   } catch (error) {
//     console.error('❌ Error retrieving token:', error);
//     return null;
//   }
// }

// // ✅ Get all tokens from all shops
// export async function getAllTokens() {
//   try {
//     const tokens = await prisma.token.findMany({
//       select: {
//         shop: true,
//         token: true,
//       },
//     });
//     console.log(`📋 All stored tokens: ${tokens.length}`);
//     return tokens;
//   } catch (error) {
//     console.error('❌ Error getting all tokens:', error);
//     return [];
//   }
// }

// // ✅ Delete a token for a specific shop
// export async function deleteToken(shop) {
//   try {
//     const deleted = await prisma.token.delete({
//       where: { shop },
//     });
//     console.log(`🗑️ Token deleted for ${shop}`);
//     return true;
//   } catch (error) {
//     // Possibly trying to delete non-existent shop
//     if (error.code === 'P2025') {
//       console.warn(`⚠️ Tried to delete non-existent token for ${shop}`);
//       return false;
//     }

//     console.error('❌ Error deleting token:', error);
//     return false;
//   }
// }



















// import prisma from "../db.server";

// // ✅ Save a token (upsert) in accessToken field
// export async function saveToken(shop, token) {
//   try {
//     const saved = await prisma.Session.upsert({
//       where: { shop },
//       update: { accessToken: token },
//       create: { shop, accessToken: token },
//     });
//     console.log(`✅ Token saved for ${shop}`);
//     return saved;
//   } catch (error) {
//     console.error('❌ Error saving token:', error);
//     return null;
//   }
// }

// // ✅ Get a single token from accessToken field
// export async function getToken(shop) {
//   try {
//     const result = await prisma.Session.findUnique({
//       where: { shop },
//       select: { accessToken: true },
//     });

//     const exists = result?.accessToken ? 'Found' : 'Not found';
//     console.log(`🔍 Token retrieved for ${shop}: ${exists}`);
//     return result?.accessToken || null;
//   } catch (error) {
//     console.error('❌ Error retrieving token:', error);
//     return null;
//   }
// }

// // ✅ Get all tokens from all shops
// export async function getAllTokens() {
//   try {
//     const tokens = await prisma.Session.findMany({
//       select: {
//         shop: true,
//         accessToken: true,
//       },
//     });
//     console.log(`📋 All stored tokens: ${tokens.length}`);
//     return tokens;
//   } catch (error) {
//     console.error('❌ Error getting all tokens:', error);
//     return [];
//   }
// }

// // ✅ Delete a token for a specific shop
// export async function deleteToken(shop) {
//   try {
//     const deleted = await prisma.token.delete({
//       where: { shop },
//     });
//     console.log(`🗑️ Token deleted for ${shop}`);
//     return true;
//   } catch (error) {
//     // Possibly trying to delete non-existent shop
//     if (error.code === 'P2025') {
//       console.warn(`⚠️ Tried to delete non-existent token for ${shop}`);
//       return false;
//     }

//     console.error('❌ Error deleting token:', error);
//     return false;
//   }
// }



// import prisma from "../db.server";

// // ✅ Save a token (upsert) in accessToken field
// export async function saveToken(shop, token) {
//   try {
//     const saved = await prisma.session.upsert({
//       where: { shop },
//       update: { accessToken: token },
//       create: { 
//         id: generateId(), // You need to generate an ID
//         shop, 
//         accessToken: token,
//         isOnline: false, // Required field with default
//         state: '', // Required field
//       },
//     });
//     console.log(`✅ Token saved for ${shop}`);
//     return saved;
//   } catch (error) {
//     console.error('❌ Error saving token:', error);
//     return null;
//   }
// }

// // Helper function to generate ID (you might want to use cuid or uuid)
// function generateId() {
//   return Math.random().toString(36).substring(2, 15) + 
//          Math.random().toString(36).substring(2, 15);
// }

// // ✅ Get a single token from accessToken field
// export async function getToken(shop) {
//   try {
//     const result = await prisma.session.findUnique({
//       where: { shop },
//       select: { accessToken: true },
//     });

//     const exists = result?.accessToken ? 'Found' : 'Not found';
//     console.log(`🔍 Token retrieved for ${shop}: ${exists}`);
//     return result?.accessToken || null;
//   } catch (error) {
//     console.error('❌ Error retrieving token:', error);
//     return null;
//   }
// }

// // ✅ Get all tokens from all shops
// export async function getAllTokens() {
//   try {
//     const tokens = await prisma.session.findMany({
//       select: {
//         shop: true,
//         accessToken: true,
//       },
//     });
//     console.log(`📋 All stored tokens: ${tokens.length}`);
//     return tokens;
//   } catch (error) {
//     console.error('❌ Error getting all tokens:', error);
//     return [];
//   }
// }

// // ✅ Delete a token for a specific shop
// export async function deleteToken(shop) {
//   try {
//     const deleted = await prisma.session.delete({
//       where: { shop },
//     });
//     console.log(`🗑️ Token deleted for ${shop}`);
//     return true;
//   } catch (error) {
//     // Possibly trying to delete non-existent shop
//     if (error.code === 'P2025') {
//       console.warn(`⚠️ Tried to delete non-existent token for ${shop}`);
//       return false;
//     }

//     console.error('❌ Error deleting token:', error);
//     return false;
//   }
// }








// Simple in-memory token store
const tokenStore = new Map();

export const saveToken = (shopUrl, token) => {
  try {
    tokenStore.set(shopUrl, token);
    console.log(`✅ Token saved for ${shopUrl}:`, token);
    console.log(`📊 Current store size:`, tokenStore.size);
    return true;
  } catch (error) {
    console.error('❌ Error saving token:', error);
    return false;
  }
};

export const getToken = (shopUrl) => {
  try {
    const token = tokenStore.get(shopUrl);
    console.log(`🔍 Token retrieved for ${shopUrl}:`, token);
    return token || null;
  } catch (error) {
    console.error('❌ Error retrieving token:', error);
    return null;
  }
};

export const getAllTokens = () => {
  console.log('📋 All stored tokens:');
  tokenStore.forEach((token, shop) => {
    console.log(`  ${shop}: ${token}`);
  });
  return Object.fromEntries(tokenStore);
};

export const deleteToken = (shopUrl) => {
  try {
    const result = tokenStore.delete(shopUrl);
    console.log(`🗑️ Token deleted for ${shopUrl}:`, result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting token:', error);
    return false;
  }
};