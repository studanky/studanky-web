import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "./reveal";
import { SectionIntro } from "./section-intro";

export function FaqSection({ dict }: { dict: Dictionary }) {
  const faq = dict.faq;

  return (
    <section
      id="faq"
      className="flex scroll-mt-20 flex-col justify-center border-y border-border/60 bg-secondary/25 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-svh lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <Reveal>
          <SectionIntro eyebrow={faq.eyebrow} title={faq.title} description={faq.description} />
        </Reveal>

        <Reveal delay={0.1}>
          {/* Plain divided list — the accordion rows draw their own hairlines. */}
          <Accordion defaultValue={["item-0"]}>
            {faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={"item-" + index}>
                <AccordionTrigger className="text-left text-[15px] font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
