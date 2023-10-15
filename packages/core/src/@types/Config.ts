export interface Config {
  // lists of allowed remote domain to optimize, not specifying anything will allow to optimize ANY image on the internet
  remoteDomains?: string[]

  // lists of allowed domain to use this API (will check via header `Referer`), not specifying anything will allow all domains to use this API
  allowedDomains?: string[]

  // directory to temporary store optimized images (default to .svelte-kit/images), paths will be relative to process.cwd()
  storePath: string

  // cache age before it expires (in miliseconds) (defult to 7 days)
  ttl: number

  // enable optimization for AVIF (disabled by default due to high CPU and memory usage)
  avif: boolean
}
