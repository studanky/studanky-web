import type { Dictionary } from "@/i18n/dictionary";
import type { Screenshot } from "@/types/landing";
import { ScreenshotCarousel } from "../screenshot-carousel";
import { SectionHeading } from "../section-heading";

// Image sources are structural (locale-independent) and paired with the
// translated screenshot copy by index.
const screenshotImages = [
  "/app/screenshot-map.svg",
  "/app/screenshot-detail.svg",
  "/app/screenshot-report.svg",
];

export function ScreenshotsSection({ dict }: { dict: Dictionary }) {
  const section = dict.screenshots;
  const screenshots: Screenshot[] = section.items.map((item, index) => ({
    ...item,
    imageSrc: screenshotImages[index] ?? screenshotImages[0],
  }));

  return (
    <section id="aplikace" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />
        <ScreenshotCarousel
          screenshots={screenshots}
          prevLabel={section.prev}
          nextLabel={section.next}
        />
      </div>
    </section>
  );
}
