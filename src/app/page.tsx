export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium text-foreground/70">Studánky web</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Landing page pro mobilní aplikaci Studánky
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-foreground/70">
          Projekt je připravený na další krok: inicializaci shadcn/ui,
          design tokenů a komponentové architektury.
        </p>
      </div>
    </main>
  );
}
