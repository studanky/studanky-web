import { appScreenshots } from "@/config/assets";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { AppScreenshotFrame } from "./app-screenshot-frame";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

/** App showcase — real app screenshots with stable iPhone 17 Pro Max ratio. */
export function ShowcaseSection({ dict }: { dict: Dictionary }) {
  const showcase = dict.showcase;
  const screens = [
    { id: "map", image: appScreenshots.map, copy: showcase.screens.map },
    { id: "detail", image: appScreenshots.detail, copy: showcase.screens.detail },
    { id: "history", image: appScreenshots.history, copy: showcase.screens.history },
  ] as const;

  return (
    <section
      id="app"
      className="flex flex-col justify-center border-y border-border/60 bg-secondary/25 px-4 py-20 sm:px-6 sm:py-24 min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro
            title={showcase.title}
            description={showcase.description}
          />
        </Reveal>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-start gap-12 sm:grid-cols-3 sm:gap-8">
          {screens.map((screen, index) => (
            <Reveal
              key={screen.id}
              delay={index * 0.1}
              className={cn(
                "flex flex-col items-center gap-5",
                index === 1 && "sm:translate-y-10",
              )}
            >
              <AppScreenshotFrame
                src={screen.image.src}
                alt={screen.copy.title}
                sizes="(max-width: 640px) 76vw, (max-width: 1024px) 28vw, 260px"
              />
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-semibold text-foreground">{screen.copy.title}</span>
                <span className="text-sm text-muted-foreground">{screen.copy.caption}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground sm:mt-10">{showcase.note}</p>
      </div>
    </section>
  );
}
