import type { Loader } from "@urami/types";

export const defaultLoader: Loader = (src, width, quality, format) => {
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  });
  if (format) params.set("format", format);

  return `/api/_image?${params.toString()}`;
};
