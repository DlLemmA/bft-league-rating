<template>
  <SeasonsPage />
</template>

<script setup lang="ts">
useHead({
  title: 'ЛЛТ Беларуси',
  meta: [
    { name: 'description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
    { name: 'keywords', content: 'триатлон, Беларусь, рейтинг, соревнования, результаты, любительская лига, спорт' },

    { property: 'og:title', content: 'Главная - Любительская Лига Триатлона Беларуси' },
    { property: 'og:description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Любительская Лига Триатлона Беларуси' },
    { property: 'og:locale', content: 'ru_BY' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Главная - Любительская Лига Триатлона Беларуси' },
    { name: 'twitter:description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
  ],
})
</script>
