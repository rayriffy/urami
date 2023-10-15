import { defaultLoader, buildSource } from '@urami/utils'

import type { FunctionComponent, ImgHTMLAttributes } from 'react'
import type { Loader } from '@urami/types'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width: number
  quality?: number
  loader?: Loader
}

const Image: FunctionComponent<ImageProps> = ({
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
      srcSet={builtProps.srcSet}
      decoding="async"
      loading="lazy"
      {...rest}
    />
  )
}

export default Image
