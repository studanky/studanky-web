import Image from "next/image";

import { appBrandIcon } from "@/config/assets";
import { cn } from "@/lib/utils";

export function AppIcon({
  className,
  priority = false,
  sizes = "40px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span className={cn("relative inline-flex size-10 shrink-0 overflow-hidden", className)}>
      <Image
        src={appBrandIcon.src}
        alt=""
        width={appBrandIcon.width}
        height={appBrandIcon.height}
        priority={priority}
        sizes={sizes}
        className="size-full object-contain"
      />
    </span>
  );
}
