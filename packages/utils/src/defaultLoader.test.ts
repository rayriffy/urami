import { describe, it, expect } from 'vitest'

import { defaultLoader } from '.'

describe('defaultLoader()', () => {
  describe('action', () => {
    it('should return a url with the correct query params', () => {
      const src = 'https://example.com/image.jpg'
      const width = 100
      const quality = 80

      expect(defaultLoader(src, width, quality)).toBe('/api/_image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=100&q=80')
    })
  })
})
