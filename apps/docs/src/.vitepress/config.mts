import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Urami',
  description: 'Automatic image optimization for all!',

  lang: 'en-US',
  cleanUrls: true,

  sitemap: {
    hostname: 'https://urami.dev',
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Examples',
        link: 'https://github.com/rayriffy/urami/tree/main/apps/examples',
      },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Qwik', link: '/guide/qwik' },
          { text: 'SvelteKit', link: '/guide/svelte-kit' },
          { text: 'Solid Start', link: '/guide/solid-start' },
        ],
      },
      {
        text: 'Core',
        items: [
          { text: 'Overview', link: '/core/overview' },
          { text: 'Configuration', link: '/core/configuration' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Overview', link: '/components/overview' },
          { text: 'React', link: '/components/react' },
          { text: 'Vue', link: '/components/vue' },
          { text: 'Svelte', link: '/components/svelte' },
          { text: 'Solid', link: '/components/solid' },
          { text: 'Preact', link: '/components/preact' },
        ],
      },
      {
        text: 'Utilities',
        items: [{ text: 'Loader', link: '/utils/loader' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rayriffy/urami' },
    ],
  },
})
