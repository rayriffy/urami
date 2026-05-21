import { defaultLoader, buildSource } from "@urami/utils";

import { forwardRef, type ImgHTMLAttributes } from "react";
import type { Loader } from "@urami/types";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width: number;
  quality?: number;
  loader?: Loader;
  formats?: string[];
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, width, quality = 75, loader = defaultLoader, formats = ["webp", "jpg"], ...rest }, ref) => {
    // Generate sources for all formats except the last one (which is used as fallback)
    const sources = formats.slice(0, -1).map((format) => {
      const builtProps = buildSource(loader, src, width, quality, format);
      return (
        <source
          key={format}
          srcSet={builtProps.srcSet}
          type={`image/${format}`}
        />
      );
    });

    // Fallback is the last format
    const fallbackFormat = formats[formats.length - 1];
    const fallbackProps = buildSource(loader, src, width, quality, fallbackFormat);

    return (
      <picture>
        {sources}
        <img
          ref={ref}
          src={fallbackProps.src}
          srcSet={fallbackProps.srcSet}
          decoding="async"
          loading="lazy"
          {...rest}
          width={width}
          height={rest.height}
        />
      </picture>
    );
  },
);

export default Image;
