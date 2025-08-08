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
import prisma from "../db.server";

export const saveToken = async (shop, token) => {
  try {
    await prisma.shop.upsert({
      where: { shop },
      update: { rushrrToken: token },
      create: { shop, rushrrToken: token },
    });
    console.log(`✅✅✅✅✅ Token saved for ${shop}`);
    return true;
  } catch (error) {
    console.error('❌ Error saving token:', error);
    return false;
  }
};

export const getToken = async (shop) => {
  try {
    const shopData = await prisma.shop.findUnique({
      where: { shop },
      select: { rushrrToken: true },
    });
    return shopData?.rushrrToken || null;
  } catch (error) {
    console.error('❌ Error retrieving token:', error);
    return null;
  }
};