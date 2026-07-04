import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqSection } from "./sections/faq-section";
import { FeaturesSection } from "./sections/features-section";
import { FinalCtaSection } from "./sections/final-cta-section";
import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { ProblemSection } from "./sections/problem-section";
import { ScreenshotsSection } from "./sections/screenshots-section";
import { StatsSection } from "./sections/stats-section";
import { TestimonialsSection } from "./sections/testimonials-section";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ScreenshotsSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
