import { defaultLoader, buildSource } from "@urami/utils";

import type { Component, JSX } from "solid-js";
import type { Loader } from "@urami/types";

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width: number;
  quality?: number;
  loader?: Loader;
  formats?: string[];
}

const Image: Component<ImageProps> = ({
  src,
  width,
  quality = 75,
  loader = defaultLoader,
  formats = ["webp", "jpg"],
  ...rest
}) => {
  const sources = formats.slice(0, -1).map((format) => {
    const builtProps = buildSource(loader, src, width, quality, format);
    return (
      <source
        srcset={builtProps.srcSet}
        type={`image/${format}`}
      />
    );
  });

  const fallbackFormat = formats[formats.length - 1];
  const fallbackProps = buildSource(loader, src, width, quality, fallbackFormat);

  return (
    <picture>
      {sources}
      <img
        src={fallbackProps.src}
        srcset={fallbackProps.srcSet}
        decoding="async"
        loading="lazy"
        {...rest}
      />
    </picture>
  );
};

export default Image;
