<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { defaultLoader, buildSource } from '@urami/utils'
  import type { Loader } from '@urami/types'

  const dispatch = createEventDispatcher()

  export let src: string
  export let width: number
  export let height: number | undefined = undefined
  export let alt: string | undefined = undefined

  let klass: string | undefined = undefined
  export { klass as class }

  export let quality: number = 75

  export let loader: Loader = defaultLoader
  export let formats: string[] = ['webp', 'jpg']

  let imageElement: HTMLImageElement | undefined
  let loaded = false

  const handleLoad = () => {
    if (loaded) return
    loaded = true
    dispatch('load')
  }

  $: sources = formats.slice(0, -1).map(format => ({
    format,
    ...buildSource(loader, src, width, quality, format)
  }))
  $: fallbackFormat = formats[formats.length - 1]
  $: fallbackProps = buildSource(loader, src, width, quality, fallbackFormat)

  $: if (imageElement?.complete) handleLoad()
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<picture>
  {#each sources as source}
    <source srcset={source.srcSet} type={`image/${source.format}`} />
  {/each}
  <img
    bind:this={imageElement}
    src={fallbackProps.src}
    srcset={fallbackProps.srcSet}
    decoding="async"
    loading="lazy"
    on:load={handleLoad}
    {...$$restProps}
    {...{
      alt,
      height,
      width,
      class: klass,
    }}
  />
</picture>
