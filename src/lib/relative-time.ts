import type { Locale } from "@/i18n/config";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1_000],
];

/**
 * Localized, coarse "time ago" for a timestamp (e.g. "3 days ago"), formatted in
 * the given locale. Returns `null` for a missing/unparseable input so callers can
 * hide the label.
 */
export function relativeTimeFromNow(iso: string | null, locale: Locale): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;

  const diffMs = then - Date.now();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, ms] of UNITS) {
    if (abs >= ms) return rtf.format(Math.round(diffMs / ms), unit);
  }
  return rtf.format(0, "second");
}
