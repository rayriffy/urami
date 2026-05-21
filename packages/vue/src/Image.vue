<script setup lang="ts">
import { defaultLoader, buildSource } from '@urami/utils'

import type { Loader } from '@urami/types'
import { computed } from 'vue'

interface Props {
  src: string
  width: number
  quality?: number
  loader?: Loader
  formats?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  quality: 75,
  loader: () => defaultLoader,
  formats: () => ['webp', 'jpg']
})

const sources = computed(() => {
  return props.formats.slice(0, -1).map(format => ({
    format,
    ...buildSource(props.loader, props.src, props.width, props.quality, format)
  }))
})

const fallbackProps = computed(() => {
  const fallbackFormat = props.formats[props.formats.length - 1]
  return buildSource(props.loader, props.src, props.width, props.quality, fallbackFormat)
})
</script>

<template>
  <picture>
    <source v-for="source in sources" :key="source.format" :srcset="source.srcSet" :type="`image/${source.format}`" />
    <img :src="fallbackProps.src" :srcset="fallbackProps.srcSet" decoding="async" loading="lazy" v-bind="$attrs" />
  </picture>
</template>
