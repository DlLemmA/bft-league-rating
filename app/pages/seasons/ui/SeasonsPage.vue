<template>
  <!-- Loading State -->
  <div
    v-if="pending"
    class="text-center py-12"
  >
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
    <p class="mt-4 text-gray-600">
      Загрузка данных...
    </p>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8"
  >
    <h2 class="font-bold">
      Ошибка загрузки данных:
    </h2>
    <pre class="mt-2 text-sm">{{ error }}</pre>
  </div>

  <!-- Seasons -->
  <div
    v-else
    class="space-y-12"
  >
    <SeasonSection
      v-for="(season, year) in seasons"
      :key="year"
      :season="season"
      :year="year"
    />
  </div>
</template>

<script setup lang="ts">
// Load seasons data from API
const { data: seasons, pending, error } = await useFetch('/api/seasons')
</script>
