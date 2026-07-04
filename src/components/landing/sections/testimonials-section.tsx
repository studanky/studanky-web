import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonials } from "@/data/landing";
import { SectionHeading } from "../section-heading";

export function TestimonialsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Ohlasy"
          title="Placeholder pro důvěryhodnost před vydáním"
          description="Před spuštěním sem patří konkrétní citace testerů, správců studánek nebo partnerů projektu."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <CardHeader>
                <CardTitle>{testimonial.author}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <blockquote className="text-lg leading-8 text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <p className="text-sm text-muted-foreground">{testimonial.context}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
