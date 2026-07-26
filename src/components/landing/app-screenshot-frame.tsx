import Image from "next/image";

import { appScreenshotSize } from "@/config/assets";
import { cn } from "@/lib/utils";

export function AppScreenshotFrame({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 640px) 76vw, 300px",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={cn("relative m-0 w-full max-w-[300px]", className)}>
      <div className="rounded-[3rem] bg-gradient-to-b from-[oklch(0.38_0.03_252)] via-[oklch(0.26_0.04_256)] to-[oklch(0.2_0.04_258)] p-2.5 shadow-2xl shadow-deep/40 ring-1 ring-white/25">
        <div
          className="relative overflow-hidden rounded-[2.35rem] bg-background"
          style={{ aspectRatio: `${appScreenshotSize.width} / ${appScreenshotSize.height}` }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>
    </figure>
  );
}
