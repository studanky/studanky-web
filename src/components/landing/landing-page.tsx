import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { CommunitySection } from "./community-section";
import { DataSection } from "./data-section";
import { DownloadSection } from "./download-section";
import { FaqSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { GlassNav } from "./glass-nav";
import { Hero } from "./hero";
import { RoadmapSection } from "./roadmap-section";
import { ShowcaseSection } from "./showcase-section";
import { SiteFooter } from "./site-footer";
import { StepsSection } from "./steps-section";
import { StickyDownload } from "./sticky-download";
import { StorySection } from "./story-section";

export function LandingPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <>
      <GlassNav dict={dict} locale={locale} />
      <main className="flex flex-1 flex-col">
        <Hero dict={dict} />
        <StorySection dict={dict} />
        <FeaturesSection dict={dict} />
        <ShowcaseSection dict={dict} />
        <StepsSection dict={dict} />
        <DataSection dict={dict} />
        <RoadmapSection dict={dict} locale={locale} />
        <CommunitySection dict={dict} />
        <FaqSection dict={dict} />
        <DownloadSection dict={dict} />
      </main>
      <SiteFooter dict={dict} locale={locale} />
      <StickyDownload label={dict.nav.download} href={siteConfig.getPath} />
    </>
  );
}
