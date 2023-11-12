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

    search: {
      provider: 'local',
    },

    lastUpdated: {},

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: 'https://github.com/rayriffy/urami/edit/main/apps/docs/src/:path',
    },

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
          { text: 'Astro', link: '/guide/astro' },
          { text: 'SvelteKit', link: '/guide/sveltekit' },
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
          { text: 'Solid', link: '/components/solid' },
          { text: 'Svelte', link: '/components/svelte' },
          { text: 'Vue', link: '/components/vue' },
        ],
      },
      {
        text: 'Utilities',
        items: [
          { text: 'Loader', link: '/utilities/loader' },
          // { text: 'buildSource', link: '/utilities/buildSource' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rayriffy/urami' },
    ],
  },
})
