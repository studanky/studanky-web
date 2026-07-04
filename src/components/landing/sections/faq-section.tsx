import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/landing";
import { SectionHeading } from "../section-heading";

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Otázky pro první verzi landing page"
          description="FAQ je připravené jako shadcn Accordion nad Base UI, tedy s polem hodnot v defaultValue."
        />
        <Accordion defaultValue={["item-0"]}>
          {faqs.map((item, index) => (
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
