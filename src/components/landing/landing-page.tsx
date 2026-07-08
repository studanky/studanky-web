import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { FaqSection } from "./sections/faq-section";
import { FeaturesSection } from "./sections/features-section";
import { FinalCtaSection } from "./sections/final-cta-section";
import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { ProblemSection } from "./sections/problem-section";
import { ScreenshotsSection } from "./sections/screenshots-section";
import { StatsSection } from "./sections/stats-section";
import { TestimonialsSection } from "./sections/testimonials-section";

export function LandingPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main className="flex flex-1 flex-col">
        <HeroSection dict={dict} />
        <StatsSection dict={dict} />
        <ProblemSection dict={dict} />
        <FeaturesSection dict={dict} />
        <HowItWorksSection dict={dict} />
        <ScreenshotsSection dict={dict} />
        <TestimonialsSection dict={dict} />
        <FaqSection dict={dict} />
        <FinalCtaSection dict={dict} />
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
