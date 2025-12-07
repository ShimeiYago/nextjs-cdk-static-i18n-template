import createMiddleware from "next-intl/middleware";

import { routing } from "./src/i18n/routing";

const middleware = createMiddleware(routing);

export default middleware;

export const config = {
  matcher: ["/", "/(en|ja)/:path*"],
};
