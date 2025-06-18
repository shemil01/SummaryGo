import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";


export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/uploadthing`,
    // uploadthingId: process.env.UPLOADTHING_APP_ID,
    // uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
export const runtime = "nodejs";
