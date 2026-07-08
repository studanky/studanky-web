import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables `app/global-not-found.tsx` — the documented way to render a
    // consistent 404 when the root layout lives under a dynamic segment
    // (`app/[locale]/layout.tsx`). Lets the 404 be fully server-rendered with
    // its own <html lang> while the homepage stays statically prerendered.
    globalNotFound: true,
  },
};

export default nextConfig;
