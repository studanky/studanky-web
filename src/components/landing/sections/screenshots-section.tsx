import { screenshots } from "@/data/landing";
import { ScreenshotCarousel } from "../screenshot-carousel";
import { SectionHeading } from "../section-heading";

export function ScreenshotsSection() {
  return (
    <section id="aplikace" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Aplikace"
          title="Místo pro screenshoty a budoucí animovaný mockup"
          description="Carousel už používá Embla a umí swipování. V této fázi obsahuje SVG placeholdery, které později nahradí reálné screenshoty aplikace."
        />
        <ScreenshotCarousel screenshots={screenshots} />
      </div>
    </section>
  );
}
