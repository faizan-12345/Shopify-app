// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return null;
// };


// import { authenticate } from '~/shopify.server';

// export const loader = async ({ request }) => {
//   const { session, shop, accessToken } = await authenticate.admin(request);

//   // ✅ Log session and access token
//   console.log('✅ Authenticated Session:', session);
//   console.log('🛡️ Access Token:', session.accessToken); // or accessToken

//   return new Response(null, {
//     status: 302,
//     headers: {
//       Location: `/app?shop=${shop}`,
//     },
//   });
// };


import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};