import * as crypto from "crypto";

export function verifyShopifyHmac(body, hmacHeader) {
  const generated = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(body, "utf8")
    .digest("base64");

  return generated === hmacHeader;
}