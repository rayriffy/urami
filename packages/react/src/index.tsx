import { defaultLoader, buildSource } from '@urami/utils'

import { forwardRef, type ImgHTMLAttributes } from 'react'
import type { Loader } from '@urami/types'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width: number
  quality?: number
  loader?: Loader
}

const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  width,
  quality = 75,
  loader = defaultLoader,
  ...rest
},ref) => {
  const builtProps = buildSource(loader, src, width, quality)

  return (
    <img
      ref={ref}
      src={builtProps.src}
      srcSet={builtProps.srcSet}
      decoding="async"
      loading="lazy"
      {...rest}
    />
  )
})

export default Image
