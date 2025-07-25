<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block flex items-center">
        <UIcon name="i-heroicons-arrow-left" class="mr-1" />
        Главная
      </NuxtLink>
      <h1 class="text-4xl font-bold mb-2 flex items-center">
        <UIcon name="i-heroicons-trophy" class="mr-3 text-blue-600" size="lg" />
        Рейтинг спортсменов {{ year }}
      </h1>
      <p class="text-gray-600">
        Рейтинг лицензированных участников Любительской Лиги триатлона Беларуси
      </p>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">
        Загрузка рейтинга...
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
      <!-- Rating Statistics Cards -->
      <RatingStatisticsCards :statistics="ratingStatistics" />

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
            <input v-model="searchQuery" type="text" placeholder="Введите имя или название клуба..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-building-office" class="mr-1" />
              Клуб
            </label>
            <select v-model="selectedClub" :disabled="availableClubs.length === 0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed">
              <option value="">
                Все клубы
              </option>
              <option v-for="club in availableClubs" :key="club" :value="club">
                {{ club }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-tag" class="mr-1" />
              Возрастная группа
            </label>
            <select v-model="selectedAgeGroup" :disabled="availableAgeGroups.length === 0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed">
              <option value="">
                Все группы
              </option>
              <option v-for="group in availableAgeGroups" :key="group" :value="group">
                {{ group }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Rating Table with Tabs -->
      <UTabs :items="ratingTabs" :default-index="activeTabIndex"
        class="bg-white rounded-xl shadow-md border border-gray-100" @change="handleTabChange">
        <template #content="{ item }">
          <div v-if="item.key === 'all'" class="space-y-4">
            <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div class="flex items-center">
                <UIcon name="i-heroicons-users" class="mr-2 text-blue-600" />
                Все спортсмены
              </div>
              <span class="text-sm text-gray-500">
                Найдено: {{ filteredRatingData.length }} из {{ ratingData?.length || 0 }}
              </span>
            </h3>

            <RatingTable :athletes="filteredRatingData" @show-details="showAthleteDetails" />
          </div>

          <div v-else-if="item.key === 'men'" class="space-y-4">
            <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div class="flex items-center">
                <UIcon name="i-heroicons-user" class="mr-2 text-green-600" />
                Мужчины
              </div>
              <span class="text-sm text-gray-500">
                Найдено: {{ filteredMenData.length }} из {{ menCount }}
              </span>
            </h3>

            <RatingTable :athletes="filteredMenData" @show-details="showAthleteDetails" />
          </div>

          <div v-else-if="item.key === 'women'" class="space-y-4">
            <h3 class="text-xl font-bold flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div class="flex items-center">
                <UIcon name="i-heroicons-user" class="mr-2 text-pink-600" />
                Женщины
              </div>
              <span class="text-sm text-gray-500">
                Найдено: {{ filteredWomenData.length }} из {{ womenCount }}
              </span>
            </h3>

            <RatingTable :athletes="filteredWomenData" @show-details="showAthleteDetails" />
          </div>
        </template>
      </UTabs>

      <!-- Competition Details Drawer -->
      <CompetitionDetailsDrawer v-model:open="showDetailsDrawer" :athlete="selectedAthlete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RatingTable from '~/components/RatingTable.vue'
import RatingStatisticsCards from '~/components/RatingStatisticsCards.vue'
import CompetitionDetailsDrawer from '~/components/CompetitionDetailsDrawer.vue'

const route = useRoute()
const year = route.params.year as string

useHead({
  title: `Рейтинг спортсменов ${route.params.year} - Рейтинг Любительской Лиги триатлона`,
  meta: [
    { name: 'description', content: 'База данных лицензированных участников Любительской Лиги триатлона Беларуси' },
  ],
})

// Fetch rating data
const { data: ratingData, pending, error } = await useFetch(`/api/${year}/rating`)

// State for search and filters
const searchQuery = ref('')
const selectedClub = ref('')
const selectedAgeGroup = ref('')

// State for competition details drawer
const showDetailsDrawer = ref(false)
const selectedAthlete = ref<any>(null)

// Tab configuration
const activeTab = ref<'all' | 'men' | 'women'>('all')
const ratingTabs = [
  {
    key: 'all',
    label: 'Все спортсмены',
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
]

const activeTabIndex = computed(() => {
  const index = ratingTabs.findIndex(tab => tab.key === activeTab.value)
  return index >= 0 ? index : 0
})

const handleTabChange = (index: number) => {
  activeTab.value = ratingTabs[index].key as 'all' | 'men' | 'women'
}

// Computed properties
const availableClubs = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return []
  const clubSet = new Set(ratingData.value.map((athlete: any) => athlete.club).filter(Boolean))
  return Array.from(clubSet).sort()
})

const availableAgeGroups = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return []
  const ageGroupSet = new Set(ratingData.value.map((athlete: any) => athlete.ageGroup).filter(Boolean))
  return Array.from(ageGroupSet).sort()
})

const menCount = computed(() => {
  if (!ratingData.value) return 0
  return ratingData.value.filter((athlete: any) => athlete.gender === 'Мужской').length
})

const womenCount = computed(() => {
  if (!ratingData.value) return 0
  return ratingData.value.filter((athlete: any) => athlete.gender === 'Женский').length
})

const competitionsCount = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return 0

  // Get unique competition names
  const competitionSet = new Set()
  ratingData.value.forEach((athlete: any) => {
    if (athlete.competitions) {
      athlete.competitions.forEach((comp: any) => {
        competitionSet.add(comp.competition)
      })
    }
  })

  return competitionSet.size
})

const ratingStatistics = computed(() => {
  return {
    total: ratingData.value?.length || 0,
    men: menCount.value,
    women: womenCount.value,
    competitions: competitionsCount.value,
  }
})

// Places are now calculated in the API

// Filtered data for all athletes
const filteredRatingData = computed(() => {
  if (!ratingData.value) return []

  let filtered = ratingData.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((athlete: any) =>
      athlete.fioRussian.toLowerCase().includes(query)
      || athlete.fioEnglish.toLowerCase().includes(query)
      || (athlete.club && athlete.club.toLowerCase().includes(query)),
    )
  }

  // Filter by club
  if (selectedClub.value) {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value) {
    filtered = filtered.filter((athlete: any) => athlete.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

// Filtered data for men
const filteredMenData = computed(() => {
  if (!ratingData.value) return []

  let filtered = ratingData.value.filter((athlete: any) => athlete.gender === 'Мужской')

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((athlete: any) =>
      athlete.fioRussian.toLowerCase().includes(query)
      || athlete.fioEnglish.toLowerCase().includes(query)
      || (athlete.club && athlete.club.toLowerCase().includes(query)),
    )
  }

  // Filter by club
  if (selectedClub.value) {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value) {
    filtered = filtered.filter((athlete: any) => athlete.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

// Filtered data for women
const filteredWomenData = computed(() => {
  if (!ratingData.value) return []

  let filtered = ratingData.value.filter((athlete: any) => athlete.gender === 'Женский')

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((athlete: any) =>
      athlete.fioRussian.toLowerCase().includes(query)
      || athlete.fioEnglish.toLowerCase().includes(query)
      || (athlete.club && athlete.club.toLowerCase().includes(query)),
    )
  }

  // Filter by club
  if (selectedClub.value) {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value) {
    filtered = filtered.filter((athlete: any) => athlete.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

// Method to show athlete details
const showAthleteDetails = (athlete: any) => {
  selectedAthlete.value = athlete
  showDetailsDrawer.value = true
}
</script>
