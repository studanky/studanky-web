import { LandingPageShell } from "@/components/landing";
import { heroContent } from "@/data/landing";

export default function Home() {
  return (
    <LandingPageShell>
      <section className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {heroContent.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {heroContent.description}
          </p>
        </div>
      </section>
    </LandingPageShell>
  );
}
