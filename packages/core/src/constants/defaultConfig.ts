import type { Config } from '../@types/Config.js'

export const defaultConfig: Config = {
  avif: false,
  ttl: 1000 * 60 * 60 * 24 * 7,
  storePath: '.urami/images',
}
