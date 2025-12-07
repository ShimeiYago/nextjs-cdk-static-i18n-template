import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { defaultLocale, locales, routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_IMAGE_PATH = "/og/square.png";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";

const alternateLanguageLinks = Object.fromEntries(
  locales.map((availableLocale) => [availableLocale, `/${availableLocale}`])
) as Record<Locale, string>;

type AppLocale = (typeof locales)[number];
const bcp47LocaleMap = {
  en: "en-US",
  ja: "ja-JP"
} satisfies Record<AppLocale, string>;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(locales, locale)) {
    return {};
  }

  setRequestLocale(locale as Locale);
  const t = await getTranslations({locale: locale as Locale, namespace: "Metadata"});

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...alternateLanguageLinks,
        "x-default": `/${defaultLocale}`,
      }
    },
  openGraph: {
    type: "website",
    url: `/${locale}`,
    title: t("title"),
    siteName: t("title"),
    description: t("description"),
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 768,
        height: 768,
        alt: t("title")
      }
    ]
  },
  twitter: {
    card: "summary",
    title: t("title"),
    description: t("description"),
    images: [OG_IMAGE_PATH]
  }
  } satisfies Metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  const t = await getTranslations({locale: locale as Locale, namespace: "Metadata"});

  const localizedUrl = new URL(`/${locale}`, SITE_URL).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: localizedUrl,
    name: t("title"),
    description: t("description"),
    inLanguage: bcp47LocaleMap[locale as AppLocale]
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
