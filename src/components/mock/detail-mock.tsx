import {
  DropletIcon,
  NavigationIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";

import type { Dictionary } from "@/i18n/dictionary";
import { MapTerrain } from "./map-terrain";

// History bar widths for the three mock measurements (relative flow strength).
const historyBars = ["w-4/5", "w-3/5", "w-2/5"];

/**
 * Hand-crafted mock of the spring-detail bottom sheet from the mobile UI spec:
 * dimmed map behind a glass sheet with status, actions, and measurement
 * history. Replaced by a real screenshot later.
 */
export function DetailMock({ copy }: { copy: Dictionary["mock"] }) {
  const detail = copy.detail;

  return (
    <div aria-hidden="true" className="absolute inset-0 select-none">
      <MapTerrain />
      {/* Dim + blur the map while the sheet is open (per the app spec). */}
      <div className="absolute inset-0 bg-deep/25 backdrop-blur-[2px]" />

      {/* Bottom sheet */}
      <div className="glass-strong absolute inset-x-1.5 bottom-1.5 rounded-[1.9rem] p-4 pt-2.5">
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-foreground/15" />

        <p className="text-sm leading-tight font-semibold text-foreground">{detail.name}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-flowing/15 px-2 py-0.5 font-semibold text-primary">
            <DropletIcon className="size-2.5" />
            {detail.status}
          </span>
          {detail.updated}
        </p>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-water px-3 py-1.5 text-[10px] font-semibold text-water-foreground shadow-sm">
            <NavigationIcon className="size-3" />
            {detail.navigate}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-medium text-foreground/85">
            <Share2Icon className="size-3" />
            {detail.share}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-medium text-foreground/85">
            <StarIcon className="size-3" />
            {detail.save}
          </span>
        </div>

        {/* Measurement history */}
        <p className="mt-4 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {detail.historyTitle}
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {detail.history.map((row, index) => (
            <li key={row.date} className="flex items-center gap-2 text-[10px]">
              <span className="w-9 shrink-0 text-muted-foreground tabular-nums">{row.date}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className={`block h-full rounded-full bg-water ${historyBars[index] ?? "w-1/3"}`}
                />
              </span>
              <span className="w-11 shrink-0 text-right font-medium text-foreground tabular-nums">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
