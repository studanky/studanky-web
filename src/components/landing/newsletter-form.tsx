"use client";

import { useActionState } from "react";
import { CheckCircle2Icon } from "lucide-react";

import { subscribeToNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm({
  copy,
  locale,
  source = "prelaunch-page",
}: {
  copy: Dictionary["roadmap"]["newsletter"];
  locale: Locale;
  source?: "prelaunch-page" | "website-hero" | "website-footer";
}) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state.status === "success") {
    return (
      <p
        aria-live="polite"
        className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground"
      >
        <CheckCircle2Icon aria-hidden="true" className="size-4 shrink-0" />
        {copy.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="consent" value="true" />
      {/* Honeypot — off-screen for humans, irresistible to bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Label htmlFor="newsletter-email" className="sr-only">
          {copy.emailLabel}
        </Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder={copy.emailPlaceholder}
          autoComplete="email"
          className="h-10 flex-1 bg-card"
        />
        <Button type="submit" disabled={pending} className="h-10 px-4">
          {pending ? copy.submitting : copy.submit}
        </Button>
      </div>

      <p aria-live="polite" role="status" className="min-h-5 text-sm text-destructive">
        {state.status === "invalid"
          ? copy.errorInvalid
          : state.status === "error"
            ? copy.errorServer
            : null}
      </p>

      <p className="text-xs leading-5 text-muted-foreground">{copy.privacyNote}</p>
    </form>
  );
}
