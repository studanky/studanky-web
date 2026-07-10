import { GithubIcon } from "@/components/icons/github-icon";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

/**
 * The community story: reports from people flow back to people — sharing the
 * app is the biggest help, everything else (data tips, code) is a footnote.
 * Linear columns over a hairline, no cards.
 */
export function CommunitySection({ dict }: { dict: Dictionary }) {
  const community = dict.community;

  return (
    <section className="flex flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 lg:min-h-svh lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro
            eyebrow={community.eyebrow}
            title={community.title}
            description={community.description}
          />
        </Reveal>

        <div className="grid gap-10 border-t border-border/60 pt-10 sm:grid-cols-3 sm:gap-8">
          {community.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.08}>
              <article className="flex flex-col gap-2">
                <h3 className="font-semibold tracking-tight text-foreground">{point.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{point.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <GithubIcon aria-hidden="true" className="size-4.5" />
            {community.githubCta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
