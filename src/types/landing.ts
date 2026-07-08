/**
 * A screenshot ready to render: localized copy from the dictionary combined with
 * the (locale-independent) image source. Built in `ScreenshotsSection`.
 */
export type Screenshot = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

/** Store platforms used for badges and CTAs. */
export type StorePlatform = "ios" | "android";
