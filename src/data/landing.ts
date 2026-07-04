import type {
  FaqItem,
  Feature,
  HowItWorksStep,
  ProblemPoint,
  Screenshot,
  Statistic,
  Testimonial,
} from "@/types/landing";

export const heroContent = {
  eyebrow: "Mobilní aplikace pro výlety a péči o krajinu",
  title: "Najděte studánky, které právě tečou",
  description:
    "Studánky ukazují prameny ve vašem okolí, aktuální hlášení vody a jednoduchý způsob, jak přidat vlastní pozorování z terénu.",
};

export const statistics: Statistic[] = [
  { value: "1 000+", label: "míst pro objevování" },
  { value: "CZ", label: "navrženo pro českou krajinu" },
  { value: "Offline", label: "připraveno pro terénní použití" },
];

export const problemPoints: ProblemPoint[] = [
  {
    title: "Mapy ukazují místo, ale ne aktuální stav",
    description:
      "Studánka může být krásně značená a přesto netéct. Landing page musí rychle vysvětlit, proč je aktuální hlášení důležité.",
  },
  {
    title: "Informace z terénu se ztrácejí",
    description:
      "Návštěvníci často vědí, co se u pramene děje, ale nemají jednoduché místo, kam poznatek bezpečně přidat.",
  },
  {
    title: "Správci i turisté potřebují stejný přehled",
    description:
      "Jedna přehledná aplikace může propojit výletníky, dobrovolníky i lidi, kteří se o konkrétní místo starají.",
  },
];

export const features: Feature[] = [
  {
    title: "Mapa studánek",
    description:
      "Rychle najdete prameny v okolí a zjistíte, zda stojí za zastávku na trase.",
    icon: "map",
  },
  {
    title: "Aktuální stav vody",
    description:
      "Hlášení z terénu pomáhají poznat, jestli studánka teče a kdy ji někdo naposledy kontroloval.",
    icon: "droplet",
  },
  {
    title: "Filtry pro výlet",
    description:
      "Vyberete si místo podle dostupnosti, okolí a informací, které jsou pro cestu důležité.",
    icon: "filter",
  },
  {
    title: "Sdílení pozorování",
    description:
      "Jednoduše doplníte nový report a pomůžete dalším lidem i správcům studánek.",
    icon: "report",
  },
];

export const howItWorks: HowItWorksStep[] = [
  {
    step: "01",
    title: "Otevřete mapu",
    description: "Najděte studánky poblíž vás nebo v místě plánovaného výletu.",
  },
  {
    step: "02",
    title: "Zkontrolujte stav",
    description: "Podívejte se na poslední hlášení a informace o průtoku vody.",
  },
  {
    step: "03",
    title: "Přidejte report",
    description:
      "Po návštěvě doplňte, zda voda teče, a pomozte dalším návštěvníkům.",
  },
];

export const screenshots: Screenshot[] = [
  {
    title: "Mapa okolních studánek",
    description: "Přehledné hledání míst ve vašem okolí.",
    imageSrc: "/app/screenshot-map.svg",
    imageAlt: "Mapa studánek v mobilní aplikaci Studánky",
  },
  {
    title: "Detail studánky",
    description: "Stav vody, poloha, popis a poslední reporty na jednom místě.",
    imageSrc: "/app/screenshot-detail.svg",
    imageAlt: "Detail studánky v mobilní aplikaci Studánky",
  },
  {
    title: "Přidání hlášení",
    description: "Rychlé sdílení informace z terénu.",
    imageSrc: "/app/screenshot-report.svg",
    imageAlt: "Formulář pro přidání hlášení ve Studánkách",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Na výletech často hledám vodu mimo hlavní trasu. Aktuální hlášení mi šetří zbytečné odbočky.",
    author: "Turista",
    context: "pěší výlety a běh v přírodě",
  },
  {
    quote:
      "U studánek je důležité vědět, co se děje teď. Sdílené reporty dávají mapě praktický smysl.",
    author: "Dobrovolník",
    context: "péče o prameny a okolí",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Je aplikace zdarma?",
    answer:
      "Základní používání landing page i plánované aplikace počítá s volným přístupem. Přesný model bude upřesněn před vydáním.",
  },
  {
    question: "Můžu přidat vlastní hlášení o stavu vody?",
    answer:
      "Ano. Architektura počítá s reporty z terénu, které pomohou ostatním poznat aktuální stav studánky.",
  },
  {
    question: "Budou Studánky fungovat i bez signálu?",
    answer:
      "Landing page zatím jen představí aplikaci. Samotná aplikace má být navržená s ohledem na použití v terénu a horší připojení.",
  },
  {
    question: "Odkud pochází data o studánkách?",
    answer:
      "Projekt počítá s kombinací existujících dat, vlastního backendu a uživatelských hlášení. Detailní zdroje budou popsány před veřejným spuštěním.",
  },
];
