export type NavItem = {
  label: string;
  href: string;
};

export type CtaLink = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "store";
  platform?: "ios" | "android";
  external?: boolean;
};

export type Statistic = {
  value: string;
  label: string;
};

export type Feature = {
  title: string;
  description: string;
  icon: "map" | "droplet" | "filter" | "report";
};

export type ProblemPoint = {
  title: string;
  description: string;
};

export type HowItWorksStep = {
  step: string;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  context: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Screenshot = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};
