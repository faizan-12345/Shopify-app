// app/utils/rushrrToken.js
import prisma from "../db.server";

/**
 * Save Rushrr token for a given shop
 * @param {string} shop  - shop domain (e.g. "example.myshopify.com")
 * @param {string} token - Rushrr API token
 */
export async function saveRushrrToken(shop, token) {
  if (!shop || !token) {
    throw new Error("Both shop and token are required to save Rushrr token.");
  }

  try {
    const saved = await prisma.token.upsert({
      where: { shop },            // shop is unique in your schema
      update: { token },
      create: { shop, token },
    });
    console.log(`✅ Rushrr token saved for ${shop}`);
    return saved;
  } catch (error) {
    console.error("❌ Error saving Rushrr token:", error);
    throw error;
  }
}

/**
 * Get Rushrr token for a given shop
 * @param {string} shop
 * @returns {string|null}
 */
export async function getRushrrToken(shop) {
  if (!shop) {
    throw new Error("Shop is required to fetch Rushrr token.");
  }

  try {
    const record = await prisma.token.findUnique({
      where: { shop },
      select: { token: true },
    });
    const exists = record?.token ? "Found" : "Not found";
    console.log(`🔍 Rushrr token retrieved for ${shop}: ${exists}`);
    return record?.token || null;
  } catch (error) {
    console.error("❌ Error fetching Rushrr token:", error);
    throw error;
  }
}
