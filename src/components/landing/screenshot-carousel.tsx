"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Screenshot } from "@/types/landing";

export function ScreenshotCarousel({ screenshots }: { screenshots: Screenshot[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.title}
              className="min-w-0 flex-[0_0_82%] sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
            >
              <Card className="h-full">
                <CardContent className="flex flex-col gap-4">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={screenshot.imageSrc}
                      alt={screenshot.imageAlt}
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-foreground">{screenshot.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {screenshot.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ArrowLeftIcon aria-hidden="true" />
          <span className="sr-only">Předchozí screenshot</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ArrowRightIcon aria-hidden="true" />
          <span className="sr-only">Další screenshot</span>
        </Button>
      </div>
    </div>
  );
}
