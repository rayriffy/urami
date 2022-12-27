import type { Config } from '$lib/@types/Config'

export const defaultConfig: Config = {
  avif: false,
  remoteDomains: [],
  allowedDomains: [],
  ttl: 1000 * 60 * 60 * 24 * 7,
  storePath: '.svelte-kit/images',
}
