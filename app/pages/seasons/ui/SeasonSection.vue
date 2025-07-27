<template>
  <section class="space-y-8">
    <!-- Season Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 class="text-3xl font-bold">
        Сезон {{ year }}
      </h2>
      <div class="flex flex-wrap gap-2 mt-2 md:mt-0">
        <NuxtLink :to="`/${year}/rating`"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center">
          <UIcon name="i-heroicons-chart-bar" class="mr-1" />
          Рейтинг {{ year }}
        </NuxtLink>
        <NuxtLink :to="`/${year}/licenses`"
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition flex items-center">
          <UIcon name="i-heroicons-identification" class="mr-1" />
          Лицензии
        </NuxtLink>
        <NuxtLink :to="`/${year}/distance-points-calculator`"
          class="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition flex items-center">
          <UIcon name="i-heroicons-calculator" class="mr-1" />
          Калькулятор очков
        </NuxtLink>
        <NuxtLink :to="`/${year}/rating-points-calculator`"
          class="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition flex items-center">
          <UIcon name="i-heroicons-academic-cap" class="mr-1" />
          Калькулятор рейтинга
        </NuxtLink>
      </div>
    </div>

    <!-- Season Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-blue-50 rounded-lg p-6">
        <div class="flex items-center mb-2">
          <UIcon name="i-heroicons-users" class="text-blue-600 mr-2" size="lg" />
          <div class="text-gray-600">
            Всего участников
          </div>
        </div>
        <div class="text-3xl font-bold text-blue-600">
          {{ season.statistics.all }}
        </div>
      </div>

      <div class="bg-green-50 rounded-lg p-6">
        <div class="flex items-center mb-2">
          <UIcon name="i-heroicons-user" class="text-green-600 mr-2" size="lg" />
          <div class="text-gray-600">
            Мужчин
          </div>
        </div>
        <div class="text-3xl font-bold text-green-600">
          {{ season.statistics.men }}
        </div>
      </div>

      <div class="bg-pink-50 rounded-lg p-6">
        <div class="flex items-center mb-2">
          <UIcon name="i-heroicons-user" class="text-pink-600 mr-2" size="lg" />
          <div class="text-gray-600">
            Женщин
          </div>
        </div>
        <div class="text-3xl font-bold text-pink-600">
          {{ season.statistics.women }}
        </div>
      </div>

      <div class="bg-purple-50 rounded-lg p-6">
        <div class="flex items-center mb-2">
          <UIcon name="i-heroicons-trophy" class="text-purple-600 mr-2" size="lg" />
          <div class="text-gray-600">
            Соревнований проведено
          </div>
        </div>
        <div class="text-3xl font-bold text-purple-600">
          {{ season.statistics.competitionsWithResults }}/{{ season.statistics.competitionsCount }}
        </div>
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
