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

  let imageElement: HTMLImageElement | undefined
  let loaded = false

  const handleLoad = () => {
    if (loaded) return
    loaded = true
    dispatch('load')
  }

  $: builtProps = buildSource(loader, src, width, quality)
  $: if (imageElement?.complete) handleLoad()
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<img
  bind:this={imageElement}
  src={builtProps.src}
  srcset={builtProps.srcSet}
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
