import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  ClockIcon,
  DropletIcon,
  DropletOffIcon,
  HistoryIcon,
  MapIcon,
  NavigationIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";

import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

// Map-app names in the navigate cell are product names — structural, not copy.
const mapApps = "Mapy.com · Google Maps · Apple Maps";

// Sample history bars (relative widths) for the history cell visual.
const historyBars = ["w-5/6", "w-3/5", "w-2/5"];

/**
 * Feature overview as a hairline grid — airy and linear on purpose: no nested
 * cards or pills, cells are separated by 1px rules only. Two cells carry a
 * small data visual (freshness value, history bars); the rest stay type-first.
 */
export function FeaturesSection({ dict }: { dict: Dictionary }) {
  const bento = dict.bento;

  const states = [
    { label: bento.states.flowing, Icon: DropletIcon, tone: "bg-flowing" },
    { label: bento.states.notFlowing, Icon: DropletOffIcon, tone: "bg-not-flowing" },
    { label: bento.states.stale, Icon: ClockIcon, tone: "bg-stale" },
  ];

  const cells: {
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    text: string;
    visual?: ReactNode;
  }[] = [
    {
      Icon: MapIcon,
      title: bento.map.title,
      text: bento.map.text,
      visual: (
        <div aria-hidden="true" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {states.map(({ label, Icon, tone }) => (
            <span key={label} className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-white ring-2 ring-white/80 ${tone}`}
              >
                <Icon className="size-3" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      Icon: ClockIcon,
      title: bento.freshness.title,
      text: bento.freshness.text,
      visual: (
        <p aria-hidden="true" className="text-3xl font-semibold tracking-tight text-primary">
          {bento.freshness.value}
        </p>
      ),
    },
    {
      Icon: HistoryIcon,
      title: bento.history.title,
      text: bento.history.text,
      visual: (
        <div aria-hidden="true" className="flex w-40 flex-col gap-1.5">
          {historyBars.map((width, index) => (
            <span key={index} className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <span className={`block h-full rounded-full bg-water/80 ${width}`} />
            </span>
          ))}
        </div>
      ),
    },
    {
      Icon: NavigationIcon,
      title: bento.navigate.title,
      text: bento.navigate.text,
      visual: (
        <p aria-hidden="true" className="text-xs font-medium text-muted-foreground">
          {mapApps}
        </p>
      ),
    },
    { Icon: StarIcon, title: bento.favorites.title, text: bento.favorites.text },
    { Icon: Share2Icon, title: bento.share.title, text: bento.share.text },
  ];

  return (
    <section
      id="features"
      className="flex flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <Reveal>
          <SectionIntro
            align="left"
            title={bento.title}
            description={bento.description}
          />
        </Reveal>

        <Reveal delay={0.1}>
          {/* Hairline grid: 1px gaps over a border-coloured backdrop. */}
          <div className="grid gap-px overflow-hidden border-y border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {cells.map((cell) => (
              <article
                key={cell.title}
                className="flex flex-col items-start gap-3 bg-background px-1 py-8 sm:px-8"
              >
                <cell.Icon aria-hidden="true" strokeWidth={1.75} className="size-6 text-primary" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {cell.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{cell.text}</p>
                {cell.visual && <div className="mt-auto pt-3">{cell.visual}</div>}
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
