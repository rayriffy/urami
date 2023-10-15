import { defaultLoader, buildSource } from '@urami/utils'

import type { Component, JSX } from 'solid-js'
import type { Loader } from '@urami/types'

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width: number
  quality?: number
  loader?: Loader
}

const Image: Component<ImageProps> = ({
  src,
  width,
  quality = 75,
  loader = defaultLoader,
  ...rest
}) => {
  const builtProps = buildSource(loader, src, width, quality)

  return (
    <img
      src={builtProps.src}
      srcset={builtProps.srcSet}
      decoding="async"
      loading="lazy"
      {...rest}
    />
  )
}

export default Image
