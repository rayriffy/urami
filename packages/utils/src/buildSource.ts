import type { Loader } from "@urami/types";

// all possible sizes from devices width to regular placeholders
const allSizes = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

export const buildSource = (
  loader: Loader,
  src: string,
  width: number,
  quality: number,
  format?: string,
) => {
  // snap width to the nearest allowed size in allSizes
  const snappedWidth = allSizes.find((p) => p >= width) || allSizes[allSizes.length - 1];

  const generatedSrc = loader(src, snappedWidth, quality, format);

  return {
    src: generatedSrc,
    srcSet: generatedSrc,
  };
};
