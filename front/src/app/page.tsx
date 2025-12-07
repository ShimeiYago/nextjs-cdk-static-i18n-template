import { redirect } from "next/navigation";

import { defaultLocale } from "@/i18n/routing";

const shouldRedirectLocally = process.env.NODE_ENV === "development";

// CloudFront serves `/{locale}` via a Function-level redirect in prod.
// During local dev we mimic that behavior so hitting `/` in `next dev`
// immediately jumps to the default locale.
export default function RootLandingPage() {
  if (shouldRedirectLocally) {
    redirect(`/${defaultLocale}`);
  }

  return null;
}
