import type { ComponentType, SVGProps } from "react";
import {
  ClockIcon,
  DropletIcon,
  DropletOffIcon,
  HelpCircleIcon,
  LocateFixedIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";

import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { MapTerrain } from "./map-terrain";

// Hand-crafted mock of the app's map screen, mirroring the mobile UI spec:
// search bar on top, three-state markers, left button stack, right zoom rail,
// potability disclaimer pill at the bottom. Replaced by a real screenshot later.

type Tone = "flowing" | "notFlowing" | "stale";

const toneStyles: Record<Tone, { bg: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  flowing: { bg: "bg-flowing", Icon: DropletIcon },
  notFlowing: { bg: "bg-not-flowing", Icon: DropletOffIcon },
  stale: { bg: "bg-stale", Icon: ClockIcon },
};

function Pin({
  tone,
  className,
  selected = false,
}: {
  tone: Tone;
  className?: string;
  selected?: boolean;
}) {
  const { bg, Icon } = toneStyles[tone];

  return (
    <div className={cn("absolute -translate-x-1/2 -translate-y-full", className)}>
      <div className="relative flex flex-col items-center">
        {selected && (
          <span
            aria-hidden="true"
            className="absolute top-0.5 size-6 rounded-full bg-flowing/40 motion-safe:animate-ping-soft"
          />
        )}
        <span
          className={cn(
            "relative z-10 flex size-6.5 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white/85",
            bg,
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </span>
        <span aria-hidden="true" className={cn("-mt-1 size-2 rotate-45 rounded-[2px]", bg)} />
      </div>
    </div>
  );
}

export function MapMock({ copy }: { copy: Dictionary["mock"] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 select-none">
      <MapTerrain />

      {/* Search bar */}
      <div className="glass absolute inset-x-3 top-10 flex items-center gap-2 rounded-full px-3 py-2">
        <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-[11px] text-muted-foreground">
          {copy.searchPlaceholder}
        </span>
      </div>

      {/* Markers */}
      <Pin tone="flowing" className="top-[44%] left-[34%]" selected />
      <Pin tone="flowing" className="top-[31%] left-[68%]" />
      <Pin tone="flowing" className="top-[70%] left-[56%]" />
      <Pin tone="notFlowing" className="top-[58%] left-[76%]" />
      <Pin tone="stale" className="top-[62%] left-[20%]" />

      {/* Callout for the selected marker */}
      <div className="glass-strong absolute top-[44%] left-[34%] w-36 -translate-x-1/2 translate-y-2 rounded-xl px-2.5 py-2">
        <p className="text-[11px] leading-tight font-semibold text-foreground">
          {copy.callout.name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-flowing" />
          <span className="font-medium text-foreground">{copy.callout.status}</span>
          <span>· {copy.callout.updated}</span>
        </p>
      </div>

      {/* Left button stack (locate / favourites / help) */}
      <div className="absolute bottom-24 left-2.5 flex flex-col gap-2">
        {[LocateFixedIcon, StarIcon, HelpCircleIcon].map((Icon, index) => (
          <span
            key={index}
            className="glass flex size-8 items-center justify-center rounded-full text-foreground/80"
          >
            <Icon className="size-3.5" />
          </span>
        ))}
      </div>

      {/* Right zoom rail */}
      <div className="glass absolute top-1/2 right-2.5 flex h-28 w-3.5 -translate-y-1/2 items-start justify-center rounded-full py-1.5">
        <span className="mt-6 h-5 w-1.5 rounded-full bg-water" />
      </div>

      {/* Potability disclaimer pill */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <span className="glass rounded-full px-3 py-1 text-[10px] font-medium text-foreground/80">
          {copy.disclaimerPill}
        </span>
      </div>
    </div>
  );
}
