import type { Loader } from '@urami/types'

// all possible sizes from devices width to regular placeholders
const allSizes = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
]

export const buildSource = (
  loader: Loader,
  src: string,
  width: number,
  quality: number
) => {
  // generate all widths to be used for optimizations
  const widths = [
    ...new Set(
      // > This means that most OLED screens that say they are 3x resolution,
      // > are actually 3x in the green color, but only 1.5x in the red and
      // > blue colors. Showing a 3x resolution image in the app vs a 2x
      // > resolution image will be visually the same, though the 3x image
      // > takes significantly more data. Even true 3x resolution screens are
      // > wasteful as the human eye cannot see that level of detail without
      // > something like a magnifying glass.
      // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
      [width, width * 2 /*, width * 3*/].map(
        w => allSizes.find(p => p >= w) || allSizes[allSizes.length - 1]
      )
    ),
  ]

  return {
    src: loader(src, widths[widths.length - 1], quality),
    srcSet: widths
      .map((o, i) => `${loader(src, o, quality)} ${i + 1}x`)
      .join(', '),
  }
}
