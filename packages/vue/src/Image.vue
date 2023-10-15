<script setup lang="ts">
import { defaultLoader, buildSource } from '@urami/utils'

import type { Loader } from '@urami/types'

interface Props {
  src: string
  width: number
  quality?: number
  loader?: Loader
}

const { src, width, quality = 75, loader = defaultLoader } = defineProps<Props>()

const builtProps = buildSource(loader, src, width, quality)
</script>

<template>
  <img :src="builtProps.src" :srcset="builtProps.srcSet" decoding="async" loading="lazy" v-bind="$attrs" />
</template>
