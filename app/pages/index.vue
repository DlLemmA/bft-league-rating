<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-2">
        Любительская Лига Триатлона Беларуси
      </h1>
      <p class="text-gray-600">
        Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.
      </p>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">
        Загрузка данных...
      </p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
      <h2 class="font-bold">
        Ошибка загрузки данных:
      </h2>
      <pre class="mt-2 text-sm">{{ error }}</pre>
    </div>

    <div v-else class="space-y-12">
      <!-- For each season -->
      <div v-for="(season, year) in seasons" :key="year" class="space-y-8">
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

        <!-- Next Competition (if available) -->
        <div v-if="getNextCompetition(season.competitions)" class="mb-8">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <UIcon name="i-heroicons-calendar" class="mr-2" />
            Ближайшее соревнование
          </h3>

          <NuxtLink :to="`/${year}/competitions/${getNextCompetition(season.competitions).slug}`"
            class="block bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div>
              <h4 class="text-xl font-bold text-blue-800">
                {{ getNextCompetition(season.competitions).title }}
              </h4>
              <div class="flex items-center space-x-3 mt-2">
                <span v-if="!hasMultipleEvents(getNextCompetition(season.competitions))"
                  :class="getCategoryBadgeClass(getNextCompetition(season.competitions).category)">
                  {{ translateCategory(getNextCompetition(season.competitions).category) }}
                </span>
                <span class="text-sm text-blue-700 flex items-center">
                  <UIcon name="i-heroicons-calendar-days" class="mr-1" />
                  {{ formatDate(getNextCompetition(season.competitions).startDate) }}
                </span>
              </div>
              <div v-if="!hasMultipleEvents(getNextCompetition(season.competitions))"
                class="mt-2 text-sm text-gray-600 flex items-center">
                <UIcon name="i-heroicons-star" class="mr-1 text-yellow-500" />
                {{ getNextCompetition(season.competitions).points }} очков
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
            <NuxtLink v-for="competition in sortedCompetitions(season.competitions)" :key="competition.slug"
              :to="`/${year}/competitions/${competition.slug}`"
              class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100 hover:border-blue-200">

              <!-- Card Header with Status Indicator -->
              <div class="relative p-6 flex-grow">
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                  <span v-if="competition.hasResults"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                    Завершено
                  </span>
                  <span v-else-if="isUpcoming(competition.startDate)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1" />
                    Скоро
                  </span>
                  <span v-else
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1" />
                    Ожидается
                  </span>
                </div>

                <!-- Competition Title -->
                <h4
                  class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 pr-20 mb-3">
                  {{ competition.title }}
                </h4>

                <!-- Competition Info -->
                <div class="space-y-2 mb-4">
                  <div class="flex items-center text-sm text-gray-600">
                    <UIcon name="i-heroicons-calendar-days" class="mr-2 text-gray-400" />
                    {{ formatDateRange(competition.startDate, competition.endDate) }}
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-600">
                      <UIcon name="i-heroicons-users" class="mr-2 text-gray-400" />
                      {{ competition.statistics.all }} участников
                    </div>

                    <div v-if="!hasMultipleEvents(competition)" class="flex items-center text-sm text-amber-600">
                      <UIcon name="i-heroicons-star" class="mr-1 text-amber-500" />
                      {{ competition.points }} очков
                    </div>
                  </div>
                </div>

                <!-- Category Badge for Single Events -->
                <div v-if="!hasMultipleEvents(competition)" class="mb-4">
                  <span :class="getCategoryBadgeClass(competition.category)">
                    {{ translateCategory(competition.category) }}
                  </span>
                </div>
              </div>

              <!-- Multi-event competitions -->
              <div v-if="hasMultipleEvents(competition)" class="px-6 pb-4 border-t border-gray-50 bg-gray-50/50">
                <div class="text-sm font-semibold text-gray-700 mb-3 mt-4 flex items-center">
                  <UIcon name="i-heroicons-list-bullet" class="mr-2 text-gray-500" />
                  Дисциплины ({{ competition.events.length }})
                </div>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div v-for="event in competition.events" :key="event.slug"
                    class="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-gray-100">
                    <div class="flex items-center space-x-2">
                      <span v-if="event.hasResults" class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span v-else class="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
                      <span class="font-medium text-gray-800">{{ event.title }}</span>
                      <span v-if="event.category" :class="getCategoryBadgeClass(event.category)">
                        {{ translateCategory(event.category) }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-3 text-xs text-gray-500">
                      <span v-if="event.points" class="flex items-center">
                        <UIcon name="i-heroicons-star" class="mr-1 text-amber-400" />
                        {{ event.points }}
                      </span>
                      <span class="flex items-center">
                        <UIcon name="i-heroicons-user" class="mr-1" />
                        {{ event.participantCount || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer with Action -->
              <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500">
                    {{ competition.hasResults ? 'Результаты доступны' : 'Нажмите для просмотра' }}
                  </div>
                  <div class="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span class="text-sm font-medium mr-2">
                      {{ competition.hasResults ? 'Смотреть результаты' : 'Подробнее' }}
                    </span>
                    <UIcon name="i-heroicons-arrow-right"
                      class="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata - mobile optimized title
useHead({
  title: 'ЛЛТ Беларуси',
  meta: [
    { name: 'description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
    { name: 'keywords', content: 'триатлон, Беларусь, рейтинг, соревнования, результаты, любительская лига, спорт' },
    
    // Open Graph tags for social sharing
    { property: 'og:title', content: 'Главная - Любительская Лига Триатлона Беларуси' },
    { property: 'og:description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://triathlon.by' },
    { property: 'og:site_name', content: 'Любительская Лига Триатлона Беларуси' },
    { property: 'og:locale', content: 'ru_BY' },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Главная - Любительская Лига Триатлона Беларуси' },
    { name: 'twitter:description', content: 'Неофициальный сайт Любительской Лиги Триатлона Беларуси. Рейтинги спортсменов, результаты соревнований, календарь событий и калькуляторы очков по всем сезонам.' },
  ],
})

// Load seasons data from API
const { data: seasons, pending, error } = await useFetch('/api/seasons')

// Helper functions
const hasMultipleEvents = (competition: any) => {
  return competition && competition.events && competition.events.length > 0
}

const getCategoryBadgeClass = (category: string) => {
  const classes = {
    Sprint: 'bg-blue-100 text-blue-800',
    Olympic: 'bg-green-100 text-green-800',
    Duathlon: 'bg-orange-100 text-orange-800',
    Kross: 'bg-purple-100 text-purple-800',
    HalfIronman: 'bg-red-100 text-red-800',
    Ironman: 'bg-gray-100 text-gray-800',
  }
  return `${classes[category] || 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded`
}

const translateCategory = (category: string) => {
  const translations = {
    Sprint: 'Спринт',
    Olympic: 'Олимпийка',
    Duathlon: 'Дуатлон',
    Kross: 'Кросс',
    HalfIronman: 'Ironman 70.3',
    Ironman: 'Ironman',
  }
  return translations[category] || category
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }
  catch (e) {
    return dateString
  }
}

const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate) return ''

  try {
    const start = new Date(startDate)

    if (!endDate || startDate === endDate) {
      return formatDate(startDate)
    }

    const end = new Date(endDate)

    // If same month and year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end)} ${end.getFullYear()}`
    }

    // If same year but different months
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(start)} - ${end.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end)} ${end.getFullYear()}`
    }

    // Different years
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }
  catch (e) {
    return startDate
  }
}

const sortedCompetitions = (competitions: any[]) => {
  if (!competitions) return []

  return [...competitions].sort((a, b) => {
    // Sort by date if available
    if (a.startDate && b.startDate) {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    }

    // Fall back to title sort
    return a.title.localeCompare(b.title)
  })
}

const getNextCompetition = (competitions: any[]) => {
  if (!competitions || competitions.length === 0) return null

  const now = new Date()
  const future = competitions.filter((comp) => {
    if (!comp.startDate) return false
    return new Date(comp.startDate) > now
  })

  if (future.length === 0) return null

  // Sort by date and return the closest one
  return future.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })[0]
}

const isUpcoming = (dateString: string) => {
  if (!dateString) return false

  const now = new Date()
  const competitionDate = new Date(dateString)
  const timeDiff = competitionDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  // Consider upcoming if within next 30 days
  return daysDiff > 0 && daysDiff <= 30
}
</script>
