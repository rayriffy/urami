<script lang="ts">
  import { defaultLoader, buildSource } from '@urami/utils'
  import type { Loader } from '@urami/types'

  export let src: string
  export let width: number
  export let height: number | undefined = undefined
  export let alt: string | undefined = undefined

  let klass: string | undefined = undefined
  export { klass as class }

  export let quality: number = 75

  export let loader: Loader = defaultLoader

  $: buildProps = buildSource(loader, src, width, quality)
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<img
  src={buildProps.src}
  srcset={buildProps.srcSet}
  decoding="async"
  loading="lazy"
  {...$$restProps}
  {...{
    alt,
    height,
    width,
    class: klass,
  }}
/>
