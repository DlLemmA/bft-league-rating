// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
  ],

  components: [
    {
      path: '~/pages',
      pathPrefix: false,
    },
    {
      path: '~/shared',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      csv: {
        json: true,
        delimiter: ',',
      },
    },
  },

  dir: {
    pages: 'routes',
  },
  compatibilityDate: '2025-07-15',

  eslint: {
    config: {
      stylistic: true,
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    }
  }
})
