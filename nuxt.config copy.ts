// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
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
  compatibilityDate: '2025-05-15',

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
