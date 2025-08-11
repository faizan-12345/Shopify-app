import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { shop },
      orderBy: { id: 'desc' },
      take: 5
    });

    const sessionInfo = sessions.map(s => ({
      id: s.id,
      shop: s.shop,
      hasAccessToken: !!s.accessToken,
      hasData: !!s.data,
      dataPreview: s.data ? JSON.parse(s.data) : null
    }));

    return json({ 
      shop,
      sessionsFound: sessions.length,
      sessions: sessionInfo 
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};