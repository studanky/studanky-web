import { DetailMock } from "@/components/mock/detail-mock";
import { MapMock } from "@/components/mock/map-mock";
import { PhoneFrame } from "@/components/mock/phone-frame";
import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

/** App showcase — two crafted screens side by side (map + detail sheet). */
export function ShowcaseSection({ dict }: { dict: Dictionary }) {
  const showcase = dict.showcase;

  return (
    <section
      id="aplikace"
      className="flex flex-col justify-center border-y border-border/60 bg-secondary/25 px-4 py-20 sm:px-6 sm:py-24 min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro
            title={showcase.title}
            description={showcase.description}
          />
        </Reveal>

        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 items-start gap-12 sm:grid-cols-2 sm:gap-10">
          <Reveal className="flex flex-col items-center gap-5">
            <PhoneFrame label={dict.mock.mapAria}>
              <MapMock copy={dict.mock} />
            </PhoneFrame>
            <figcaption className="flex flex-col items-center gap-1 text-center">
              <span className="font-semibold text-foreground">{showcase.screens.map.title}</span>
              <span className="text-sm text-muted-foreground">{showcase.screens.map.caption}</span>
            </figcaption>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col items-center gap-5 sm:translate-y-10">
            <PhoneFrame label={dict.mock.detailAria}>
              <DetailMock copy={dict.mock} />
            </PhoneFrame>
            <figcaption className="flex flex-col items-center gap-1 text-center">
              <span className="font-semibold text-foreground">{showcase.screens.detail.title}</span>
              <span className="text-sm text-muted-foreground">
                {showcase.screens.detail.caption}
              </span>
            </figcaption>
          </Reveal>
        </div>

        <p className="text-center text-xs text-muted-foreground sm:mt-10">{showcase.note}</p>
      </div>
    </section>
  );
}
