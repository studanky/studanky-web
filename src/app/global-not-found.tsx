import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { DropletsIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { isLocale, localeMeta, localizedPathname, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestLocale } from "@/i18n/request-locale";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

// Global 404 for URLs that match no route. Enabled via `experimental.globalNotFound`
// in next.config. Because the root layout sits under the dynamic `[locale]`
// segment, a normal `not-found.tsx` can't be composed with a localized <html lang>;
// this file renders the whole document itself and is fully server-rendered (works
// without JS). Next injects a 404 status and `noindex` automatically.

// The locale comes from the `x-locale` header the proxy sets from the URL prefix
// (so `/cs/…` renders Czech), falling back to the visitor's preferred locale.
async function resolveLocale(): Promise<Locale> {
  const fromUrl = (await headers()).get("x-locale");
  if (isLocale(fromUrl)) return fromUrl;
  return getRequestLocale();
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2f6f4f",
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale());
  // Next injects `noindex` automatically for the 404 status, so we only set the
  // localized title/description here.
  return {
    title: dict.notFound.title,
    description: dict.notFound.description,
  };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const copy = (await getDictionary(locale)).notFound;

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
              <DropletsIcon aria-hidden="true" className="size-8" />
            </span>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary">404</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {copy.title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                {copy.description}
              </p>
            </div>
            <Link
              href={localizedPathname(locale)}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              {copy.backHome}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
