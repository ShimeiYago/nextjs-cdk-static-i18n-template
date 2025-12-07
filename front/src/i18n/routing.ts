import {createNavigation} from "next-intl/navigation";
import {defineRouting} from "next-intl/routing";

export const locales = ["en", "ja"] as const;

export const defaultLocale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale: defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
  },
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
