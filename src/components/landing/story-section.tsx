import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";

/**
 * The problem, told as a typographic sequence — three deadpan statements and
 * the punchline in water-gradient display type. No cards, no icons: the words
 * carry it.
 */
export function StorySection({ dict }: { dict: Dictionary }) {
  const story = dict.story;

  return (
    <section className="flex flex-col justify-center px-4 py-24 sm:px-6 sm:py-28 min-h-svh lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 text-center">
        <div className="flex flex-col gap-7">
          {story.lines.map((line, index) => (
            <Reveal key={line} delay={index * 0.12}>
              <p className="text-2xl font-medium tracking-tight text-balance text-muted-foreground sm:text-3xl">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="text-water-gradient text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {story.punch}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
