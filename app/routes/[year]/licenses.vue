<template>
  <LicensesPage :year="year" />
</template>

<script setup lang="ts">
const route = useRoute()
const year = route.params.year as string

// Page metadata - mobile optimized title
useHead({
  title: `Лицензии ${year}`,
  meta: [
    { name: 'description', content: `База данных лицензированных участников Любительской Лиги триатлона Беларуси за ${year} год. Полный список спортсменов с лицензиями, возрастными группами и клубами.` },
    { name: 'keywords', content: `лицензии, триатлон, Беларусь, ${year}, спортсмены, участники, клубы` },
    { property: 'og:title', content: `Лицензии ${year} - Любительская Лига Триатлона` },
    { property: 'og:description', content: `База данных лицензированных участников Любительской Лиги триатлона Беларуси за ${year} год` },
    { property: 'og:type', content: 'website' },
  ],
})
</script>
