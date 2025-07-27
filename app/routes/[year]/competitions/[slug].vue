<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <UBreadcrumb :items="breadcrumbLinks" class="mb-4" />
      <h1 class="text-4xl font-bold mb-2 flex items-center">
        <UIcon name="i-heroicons-trophy" class="mr-3 text-blue-600" size="lg" />
        {{ competitionData?.title || 'Соревнование' }}
      </h1>
      <p class="text-gray-600">
        {{ competitionData?.description || '' }}
      </p>
      <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
        <span class="flex items-center">
          <UIcon name="i-heroicons-calendar" class="mr-1" />
          <span>{{ formatEventDate(competitionData?.startDate, competitionData?.endDate) }}</span>
        </span>
        <span v-if="!hasMultipleEvents" :class="getCategoryBadgeClass(competitionData?.category)">
          {{ translateCategory(competitionData?.category) }}
        </span>
        <span v-if="!hasMultipleEvents" class="flex items-center">
          <UIcon name="i-heroicons-star" class="mr-1 text-yellow-500" />
          <span>{{ competitionData?.points }} очков</span>
        </span>
        <span v-if="competitionData?.hasResults" class="flex items-center text-green-600">
          <UIcon name="i-heroicons-check-circle" class="mr-1" />
          Результаты доступны
        </span>
      </div>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">
        Загрузка результатов...
      </p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-8">
      <h2 class="font-bold flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="mr-2" />
        Ошибка загрузки данных:
      </h2>
      <pre class="mt-2 text-sm">{{ error }}</pre>
    </div>

    <div v-else class="space-y-8">
      <!-- Multi-event competition display -->
      <div v-if="hasMultipleEvents" class="space-y-8">
        <!-- Overall Statistics -->
        <CompetitionStatisticsCards :statistics="competitionData.statistics" />

        <div class="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
          <h2 class="text-2xl font-bold mb-4 flex items-center">
            <UIcon name="i-heroicons-list-bullet" class="mr-2" />
            События соревнования
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="event in competitionData.events" :key="event.slug"
              class="bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
              @click="selectEvent(event)">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg">
                  {{ event.title }}
                </h3>
                <span class="text-blue-600 font-medium text-sm flex items-center">
                  <UIcon name="i-heroicons-star" class="mr-1 text-yellow-500" />
                  {{ event.points }} очков
                </span>
              </div>

              <div class="flex items-center space-x-2 mb-3">
                <span v-if="event.category" :class="getCategoryBadgeClass(event.category)">
                  {{ translateCategory(event.category) }}
                </span>
                <span v-if="event.hasResults" class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  Результаты доступны
                </span>
                <span v-else class="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                  Ожидается
                </span>
              </div>

              <div v-if="event.statistics" class="text-sm text-gray-600 mb-3">
                <div class="flex items-center justify-between">
                  <span class="flex items-center">
                    <UIcon name="i-heroicons-users" class="mr-1" />
                    Участников:
                  </span>
                  <span class="font-medium">{{ event.statistics.total }}</span>
                </div>
                <div class="flex items-center justify-between mt-1">
                  <span class="flex items-center">
                    <UIcon name="i-heroicons-identification" class="mr-1" />
                    С лицензией:
                  </span>
                  <span class="font-medium">{{ event.statistics.licensed }}</span>
                </div>
              </div>

              <UButton v-if="event.hasResults" color="blue" variant="solid" class="w-full"
                icon-right="i-heroicons-arrow-right">
                Посмотреть результаты
              </UButton>
              <UButton v-else color="gray" variant="outline" class="w-full" disabled>
                Результаты недоступны
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Single event or selected event results -->
      <div v-if="!hasMultipleEvents || selectedEvent">
        <!-- Statistics Cards -->
        <CompetitionStatisticsCards :statistics="currentStatistics" />

        <!-- Back to events button for multi-event competitions -->
        <div v-if="hasMultipleEvents && selectedEvent" class="mb-4">
          <UButton color="gray" variant="outline" icon="i-heroicons-arrow-left" class="shadow-sm"
            @click="selectedEvent = null">
            Назад к событиям
          </UButton>
        </div>

        <!-- Results Display -->
        <div v-if="currentStatistics.total > 0">
          <!-- Search and Filters -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
            <h2 class="text-lg font-semibold mb-4 flex items-center">
              <UIcon name="i-heroicons-funnel" class="mr-2 text-blue-600" />
              Фильтры и поиск
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UIcon name="i-heroicons-magnifying-glass" class="mr-1" />
                  Поиск по имени или клубу
                </label>
                <UInput v-model="searchQuery" placeholder="Введите имя или название клуба..."
                  icon="i-heroicons-magnifying-glass" size="md" class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UIcon name="i-heroicons-building-office" class="mr-1" />
                  Клуб
                </label>
                <USelect v-model="selectedClub" :options="clubOptions" :disabled="availableClubs.length === 0"
                  placeholder="Все клубы" size="md" class="w-full" />
                <div v-if="availableClubs.length === 0" class="text-xs text-gray-500 mt-1">
                  Нет данных о клубах
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UIcon name="i-heroicons-tag" class="mr-1" />
                  Возрастная группа
                </label>
                <USelect v-model="selectedAgeGroup" :options="ageGroupOptions"
                  :disabled="availableAgeGroups.length === 0" placeholder="Все группы" size="md" class="w-full" />
                <div v-if="availableAgeGroups.length === 0" class="text-xs text-gray-500 mt-1">
                  Нет данных о возрастных группах
                </div>
              </div>
            </div>
          </div>

          <UTabs :items="resultTabs" :default-index="activeTabIndex"
            class="bg-white rounded-xl shadow-md border border-gray-100" @change="handleTabChange">
            <template #content="{ item }">
              <div v-if="item.key === 'all'" class="space-y-4">
                <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-users" class="mr-2 text-blue-600" />
                    Все участники
                  </div>
                  <span class="text-sm text-gray-500">
                    Найдено: {{ filteredAllResults.length }} из {{ currentAllResults.length }}
                  </span>
                </h3>

                <CompetitionResultsTable :results="currentAllResults" :search-query="searchQuery"
                  :selected-club="selectedClub" :selected-age-group="selectedAgeGroup"
                  @show-details="showResultDetails" />
              </div>

              <div v-else-if="item.key === 'men'" class="space-y-4">
                <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-user" class="mr-2 text-green-600" />
                    Мужчины
                  </div>
                  <span class="text-sm text-gray-500">
                    Найдено: {{ filteredMenResults.length }} из {{ currentMenResults.length }}
                  </span>
                </h3>

                <CompetitionResultsTable :results="currentMenResults" :search-query="searchQuery"
                  :selected-club="selectedClub" :selected-age-group="selectedAgeGroup"
                  @show-details="showResultDetails" />
              </div>

              <div v-else-if="item.key === 'women'" class="space-y-4">
                <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-user" class="mr-2 text-pink-600" />
                    Женщины
                  </div>
                  <span class="text-sm text-gray-500">
                    Найдено: {{ filteredWomenResults.length }} из {{ currentWomenResults.length }}
                  </span>
                </h3>

                <CompetitionResultsTable :results="currentWomenResults" :search-query="searchQuery"
                  :selected-club="selectedClub" :selected-age-group="selectedAgeGroup"
                  @show-details="showResultDetails" />
              </div>

              <div v-else-if="item.key === 'statistics'" class="space-y-4">
                <CompetitionStatistics :statistics="currentStatistics" :results="currentAllResults" />
              </div>
            </template>
          </UTabs>
        </div>

        <!-- No results message -->
        <div v-else class="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md border border-gray-100">
          <UIcon name="i-heroicons-clock" class="mx-auto mb-4" size="xl" />
          <p class="text-lg">
            Результаты соревнования пока не доступны
          </p>
          <p class="text-sm mt-2">
            Они появятся здесь после завершения соревнования
          </p>
        </div>
      </div>
    </div>

    <!-- Result Details Drawer -->
    <CompetitionResultDetailsDrawer v-if="selectedResult" v-model:open="showDetailsDrawer" :result="selectedResult" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const year = route.params.year as string
const slug = route.params.slug as string

// Load competition data from API
const { data: competitionData, pending, error } = await useFetch(`/api/${year}/competitions/${slug}`)

if (!competitionData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Соревнование не найдено: ${year}/${slug}`,
  })
}

// Page metadata
useHead({
  title: `${competitionData.value.title} ${year} - Результаты | ЛЛТ`,
  meta: [
    { 
      name: 'description', 
      content: `Результаты соревнований ${competitionData.value.title} ${year} года. Рейтинг участников, статистика, детальные результаты по дистанциям. Любительская Лига Триатлона Беларуси.` 
    },
    { 
      property: 'og:title', 
      content: `${competitionData.value.title} ${year} - Результаты | ЛЛТ` 
    },
    { 
      property: 'og:description', 
      content: `Результаты соревнований ${competitionData.value.title} ${year} года. Рейтинг участников, статистика, детальные результаты по дистанциям.` 
    },
    { 
      property: 'og:type', 
      content: 'website' 
    },
  ],
})

// State for multi-event competitions
const selectedEvent = ref(null)

// State for result details drawer
const selectedResult = ref(null)
const showDetailsDrawer = ref(false)

// Breadcrumb navigation
const breadcrumbLinks = computed(() => [
  {
    label: 'Главная',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: competitionData.value?.title || 'Соревнование',
    icon: 'i-heroicons-flag'
  }
])

// Computed properties
const hasMultipleEvents = computed(() => {
  return competitionData.value?.events && competitionData.value.events.length > 0
})

const currentStatistics = computed(() => {
  return selectedEvent.value ? selectedEvent.value.statistics : competitionData.value?.statistics
})

const currentAllResults = computed(() => {
  if (selectedEvent.value) {
    return selectedEvent.value.results || []
  }
  return competitionData.value?.results || []
})

const currentMenResults = computed(() => {
  return currentAllResults.value.filter(result => result.gender === 'male')
})

const currentWomenResults = computed(() => {
  return currentAllResults.value.filter(result => result.gender === 'female')
})

// Search and filter state
const searchQuery = ref('')
const selectedClub = ref('')
const selectedAgeGroup = ref('')

// Available clubs for filtering
const availableClubs = computed(() => {
  if (!currentAllResults.value || currentAllResults.value.length === 0) return []
  const clubSet = new Set(currentAllResults.value.map(r => r.club).filter(Boolean))
  return Array.from(clubSet).sort()
})

// Available age groups for filtering
const availableAgeGroups = computed(() => {
  if (!currentAllResults.value || currentAllResults.value.length === 0) return []
  const ageGroupSet = new Set(currentAllResults.value.map(r => r.ageGroup).filter(Boolean))
  return Array.from(ageGroupSet).sort()
})

// Options for USelect components
const clubOptions = computed(() => [
  { label: 'Все клубы', value: '' },
  ...availableClubs.value.map(club => ({ label: club, value: club })),
])

const ageGroupOptions = computed(() => [
  { label: 'Все группы', value: '' },
  ...availableAgeGroups.value.map(group => ({ label: group, value: group })),
])

// Filtered results
const filteredAllResults = computed(() => {
  if (!currentAllResults.value) return []

  let filtered = currentAllResults.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(result =>
      result.nickname.toLowerCase().includes(query)
      || (result.club && result.club.toLowerCase().includes(query)),
    )
  }

  if (selectedClub.value) {
    filtered = filtered.filter(result => result.club === selectedClub.value)
  }

  if (selectedAgeGroup.value) {
    filtered = filtered.filter(result => result.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

const filteredMenResults = computed(() => {
  if (!currentMenResults.value) return []

  let filtered = currentMenResults.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(result =>
      result.nickname.toLowerCase().includes(query)
      || (result.club && result.club.toLowerCase().includes(query)),
    )
  }

  if (selectedClub.value) {
    filtered = filtered.filter(result => result.club === selectedClub.value)
  }

  if (selectedAgeGroup.value) {
    filtered = filtered.filter(result => result.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

const filteredWomenResults = computed(() => {
  if (!currentWomenResults.value) return []

  let filtered = currentWomenResults.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(result =>
      result.nickname.toLowerCase().includes(query)
      || (result.club && result.club.toLowerCase().includes(query)),
    )
  }

  if (selectedClub.value) {
    filtered = filtered.filter(result => result.club === selectedClub.value)
  }

  if (selectedAgeGroup.value) {
    filtered = filtered.filter(result => result.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

// Tab configuration
const activeTab = ref<'all' | 'men' | 'women' | 'statistics'>('all')
const resultTabs = [
  {
    key: 'all',
    label: 'Все участники',
    icon: 'i-heroicons-users',
  },
  {
    key: 'men',
    label: 'Мужчины',
    icon: 'i-heroicons-user',
  },
  {
    key: 'women',
    label: 'Женщины',
    icon: 'i-heroicons-user',
  },
  {
    key: 'statistics',
    label: 'Статистика',
    icon: 'i-heroicons-chart-bar',
  },
]

const activeTabIndex = computed(() => {
  const index = resultTabs.findIndex(tab => tab.key === activeTab.value)
  return index >= 0 ? index : 0
})

const handleTabChange = (index: number) => {
  activeTab.value = resultTabs[index].key as 'all' | 'men' | 'women' | 'statistics'
}

// Methods
const selectEvent = (event: any) => {
  if (event.hasResults) {
    selectedEvent.value = event
  }
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

const formatEventDate = (startDate: string, endDate: string) => {
  if (!startDate) return '2025'

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  }

  if (!end || startDate === endDate) {
    return start.toLocaleDateString('ru-RU', formatOptions)
  }
  else {
    const startFormatted = start.toLocaleDateString('ru-RU', { day: 'numeric' })
    const endFormatted = end.toLocaleDateString('ru-RU', formatOptions)
    return `${startFormatted}-${endFormatted}`
  }
}

// Show result details in drawer
const showResultDetails = (result: any) => {
  selectedResult.value = result
  showDetailsDrawer.value = true
}
</script>
