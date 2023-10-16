import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Image from './Image.vue'

describe('<Image />', () => {
  describe('display', () => {
    const wrapper = mount(Image, {
      props: {
        src: 'https://example.com/image.jpg',
        width: 640,
        quality: 80,
      },
    })

    it('should mount img element', async () => {
      const imageElement = wrapper.get('img')

      expect(imageElement).toBeDefined()
    })

    it('should have src, and srcSet attribute', async () => {
      const imageElement = wrapper.get('img')

      expect(imageElement.attributes('src')).toBeDefined()
      expect(imageElement.attributes('srcset')).toBeDefined()
    })
  })

  describe('extra props', () => {
    const wrapper = mount(Image, {
      props: {
        src: 'https://example.com/image.jpg',
        width: 640,
        quality: 80,
        class: 'demo-class'
      },
    })

    it('should append extra attributes', () => {
      const imageElement = wrapper.get('img')

      expect(imageElement.attributes('src')).toBeDefined()
      expect(imageElement.attributes('srcset')).toBeDefined()
      expect(imageElement.attributes('class')).toBeDefined()
    })
  })
})
