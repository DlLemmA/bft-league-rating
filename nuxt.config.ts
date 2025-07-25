// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      csv: {
        json: true,
        delimiter: ',',
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
