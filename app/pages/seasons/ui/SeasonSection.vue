<template>
  <section class="space-y-8">
    <!-- Season Header with Priority Actions -->
    <div class="flex flex-col space-y-3 sm:space-y-0">
      <!-- Mobile layout: stacked -->
      <div class="flex items-center justify-between sm:hidden">
        <h2 class="text-2xl font-bold">
          Сезон {{ year }}
        </h2>
        <!-- Compact stats on mobile -->
        <div class="flex items-center space-x-3 text-sm text-gray-600">
          <span class="flex items-center">
            <UIcon name="i-heroicons-users" class="mr-1" size="14" />
            {{ season.statistics.all }}
          </span>
          <span class="flex items-center">
            <UIcon name="i-heroicons-trophy" class="mr-1" size="14" />
            {{ season.statistics.competitionsWithResults }}/{{ season.statistics.competitionsCount }}
          </span>
        </div>
      </div>
      
      <!-- Desktop layout: same line -->
      <div class="hidden sm:flex sm:items-center sm:justify-between">
        <h2 class="text-3xl font-bold">
          Сезон {{ year }}
        </h2>
        <div class="flex gap-3">
          <NuxtLink :to="`/${year}/rating`"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center font-medium">
            <UIcon name="i-heroicons-chart-bar" class="mr-2" size="18" />
            Рейтинг
          </NuxtLink>
          <NuxtLink :to="`/${year}/licenses`"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition flex items-center">
            <UIcon name="i-heroicons-identification" class="mr-2" size="18" />
            Лицензии
          </NuxtLink>
        </div>
      </div>
      
      <!-- Mobile buttons (below title) -->
      <div class="flex gap-3 sm:hidden">
        <NuxtLink :to="`/${year}/rating`"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center font-medium">
          <UIcon name="i-heroicons-chart-bar" class="mr-2" size="18" />
          Рейтинг
        </NuxtLink>
        <NuxtLink :to="`/${year}/licenses`"
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition flex items-center">
          <UIcon name="i-heroicons-identification" class="mr-2" size="18" />
          Лицензии
        </NuxtLink>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="hidden sm:block">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard 
          :value="season.statistics.all"
          label="Участников"
          icon="i-heroicons-users"
          icon-color="text-blue-600"
          value-color="text-blue-600"
        />
        <StatisticCard 
          :value="season.statistics.men"
          label="Мужчин"
          icon="i-heroicons-user"
          icon-color="text-green-600"
          value-color="text-green-600"
        />
        <StatisticCard 
          :value="season.statistics.women"
          label="Женщин"
          icon="i-heroicons-user"
          icon-color="text-pink-600"
          value-color="text-pink-600"
        />
        <StatisticCard 
          :value="`${season.statistics.competitionsWithResults}/${season.statistics.competitionsCount}`"
          label="Соревнований"
          icon="i-heroicons-trophy"
          icon-color="text-purple-600"
          value-color="text-purple-600"
        />
      </div>
    </div>

    <!-- Next Competition -->
    <div v-if="nextCompetition" class="mb-8">
      <h3 class="text-xl font-semibold mb-4 flex items-center">
        <UIcon name="i-heroicons-calendar" class="mr-2" />
        Ближайшее соревнование
      </h3>

      <NuxtLink :to="`/${year}/competitions/${nextCompetition.slug}`"
        class="block bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div>
          <h4 class="text-xl font-bold text-blue-800">
            {{ nextCompetition.title }}
          </h4>
          <div class="flex items-center space-x-3 mt-2">
            <span v-if="!hasMultipleEvents(nextCompetition)" :class="getCategoryBadgeClass(nextCompetition.category)">
              {{ nextCompetition.category }}
            </span>
            <span class="text-sm text-blue-700 flex items-center">
              <UIcon name="i-heroicons-calendar-days" class="mr-1" />
              {{ formatDate(nextCompetition.startDate) }}
            </span>
          </div>
          <div v-if="!hasMultipleEvents(nextCompetition)" class="mt-2 text-sm text-gray-600 flex items-center">
            <UIcon name="i-heroicons-star" class="mr-1 text-yellow-500" />
            {{ nextCompetition.points }} очков
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Competitions -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4 flex items-center">
        <UIcon name="i-heroicons-flag" class="mr-2" />
        Соревнования {{ year }}
      </h3>

      <!-- Mobile-first responsive grid with consistent heights -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        <CompetitionCard v-for="competition in sortedCompetitions(season.competitions)" :key="competition.slug"
          :competition="competition" :year="year" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { hasMultipleEvents, getCategoryBadgeClass, formatDate, sortedCompetitions } from '../lib/competition-utils'

interface Props {
  season: any
  year: string | number
}

const props = defineProps<Props>()

// Helper function to get next competition
const getNextCompetition = (competitions: any[]) => {
  if (!competitions || competitions.length === 0) return null

  const now = new Date()
  const future = competitions.filter((comp) => {
    if (!comp.startDate) return false
    return new Date(comp.startDate) > now
  })

  if (future.length === 0) return null

  return future.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })[0]
}

const nextCompetition = computed(() => getNextCompetition(props.season.competitions))
</script>
