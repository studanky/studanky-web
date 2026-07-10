"use server";

import { z } from "zod";

// Newsletter signup — currently a MOCK: validates, logs, and reports success
// without persisting anywhere. The real Strapi wiring (collection + token) is
// specified in docs/newsletter.md and replaces the body of this action later;
// the form UI and states are final.

export type NewsletterState = {
  status: "idle" | "success" | "invalid" | "error";
};

const emailSchema = z.email();

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: humans never see the "website" field, bots fill everything.
  // Pretend success so scripts don't retry with the field left empty.
  if (formData.get("website")) return { status: "success" };

  const parsed = emailSchema.safeParse(
    String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
  );
  if (!parsed.success) return { status: "invalid" };

  console.info(
    `[newsletter:mock] signup ${parsed.data} (locale: ${String(formData.get("locale") ?? "?")})`,
  );
  // Small delay so the pending state is visible while iterating on the UI.
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { status: "success" };
}
