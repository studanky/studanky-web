import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Dictionary } from "@/i18n/dictionary";
import { SectionHeading } from "../section-heading";

export function FaqSection({ dict }: { dict: Dictionary }) {
  const faq = dict.faq;

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          align="left"
          eyebrow={faq.eyebrow}
          title={faq.title}
          description={faq.description}
        />
        <Accordion defaultValue={["item-0"]}>
          {faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={"item-" + index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
