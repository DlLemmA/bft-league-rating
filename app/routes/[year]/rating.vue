<template>
  <!-- Page Header -->
  <div class="mb-6">
    <UBreadcrumb
      :items="[
        { label: 'Главная', to: '/', icon: 'i-heroicons-home' },
        { label: `Рейтинг ${year}` },
      ]"
      class="mb-4"
    />
  </div>

  <div
    v-if="pending"
    class="text-center py-12"
  >
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
    <p class="mt-4 text-gray-600">
      Загрузка рейтинга...
    </p>
  </div>

  <div
    v-else-if="error"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-8"
  >
    <h2 class="font-bold flex items-center">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="mr-2"
      />
      Ошибка загрузки данных:
    </h2>
    <pre class="mt-2 text-sm">{{ error }}</pre>
  </div>

  <div
    v-else
    class="space-y-8"
  >
    <!-- Statistics Cards (desktop only) -->
    <div class="hidden sm:block mb-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          :value="ratingStatistics.total"
          label="Участников"
          icon="i-heroicons-users"
          icon-color="text-blue-600"
          value-color="text-blue-600"
        />
        <StatisticCard
          :value="ratingStatistics.men"
          label="Мужчин"
          icon="i-heroicons-user"
          icon-color="text-green-600"
          value-color="text-green-600"
        />
        <StatisticCard
          :value="ratingStatistics.women"
          label="Женщин"
          icon="i-heroicons-user"
          icon-color="text-pink-600"
          value-color="text-pink-600"
        />
        <StatisticCard
          :value="ratingStatistics.competitions"
          label="Соревнований"
          icon="i-heroicons-flag"
          icon-color="text-purple-600"
          value-color="text-purple-600"
        />
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center sm:hidden">
        <UIcon
          name="i-heroicons-funnel"
          class="mr-2 text-blue-600"
        />
        Фильтры
      </h2>
      <h2 class="hidden sm:flex text-lg font-semibold mb-4 items-center">
        <UIcon
          name="i-heroicons-funnel"
          class="mr-2 text-blue-600"
        />
        Фильтры и поиск
      </h2>

      <!-- Category Tabs -->
      <div class="mb-4">
        <UTabs
          :items="ratingTabs"
          :default-index="activeTabIndex"
          @change="handleTabChange"
        >
          <template #content="{ item }">
            <!-- Empty content - we'll render below -->
          </template>
        </UTabs>
      </div>

      <div class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
        <!-- Search -->
        <div class="sm:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="mr-1"
              size="16"
            />
            Поиск
          </label>
          <UInput
            v-model="searchQuery"
            type="text"
            placeholder="Имя спортсмена..."
            size="md"
            class="w-full"
          />
        </div>

        <!-- Filters in a row on mobile -->
        <div class="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-2 sm:gap-4">
          <!-- Club filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-building-office"
                class="mr-1"
                size="16"
              />
              Клуб
            </label>
            <USelect
              v-model="selectedClub"
              :items="clubOptions"
              :disabled="availableClubs.length === 0"
              size="md"
              class="w-full"
            />
            <div
              v-if="availableClubs.length === 0"
              class="text-xs text-gray-500 mt-1"
            >
              Нет данных
            </div>
          </div>

          <!-- Age group filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-tag"
                class="mr-1"
                size="16"
              />
              Возраст
            </label>
            <USelect
              v-model="selectedAgeGroup"
              :items="ageGroupOptions"
              :disabled="availableAgeGroups.length === 0"
              size="md"
              class="w-full"
            />
            <div
              v-if="availableAgeGroups.length === 0"
              class="text-xs text-gray-500 mt-1"
            >
              Нет данных
            </div>
          </div>
        </div>
      </div>
    </div>

    <RatingTable
      class="md:bg-white rounded-lg md:shadow-sm"
      :athletes="getCurrentData()"
      @show-details="showAthleteDetails"
    />

    <!-- Rating Details Drawer -->
    <RatingDetailsDrawer
      v-if="selectedAthlete"
      v-model:open="showDetailsDrawer"
      :athlete="selectedAthlete"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const year = route.params.year as string

// Mobile-optimized title
useHead({
  title: `Рейтинг ${route.params.year}`,
  meta: [
    { name: 'description', content: `Рейтинг лицензированных участников Любительской Лиги триатлона Беларуси за ${route.params.year} год. Результаты соревнований, очки и места спортсменов.` },
    { property: 'og:title', content: `Рейтинг ${route.params.year} - Любительская Лига Триатлона` },
    { property: 'og:description', content: `Рейтинг лицензированных участников Любительской Лиги триатлона Беларуси за ${route.params.year} год. Результаты соревнований, очки и места спортсменов.` },
  ],
})

// Fetch rating data
const { data: ratingData, pending, error } = await useFetch(`/api/${year}/rating`)

// State for search and filters
const searchQuery = ref('')
const selectedClub = ref('Все клубы')
const selectedAgeGroup = ref('Все группы')

// State for competition details drawer
const showDetailsDrawer = ref(false)
const selectedAthlete = ref<any>(null)

// Tab configuration
const activeTab = ref<'all' | 'men' | 'women'>('all')
const ratingTabs = [
  {
    key: 'all',
    label: 'Все',
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

// Options for USelect components
const clubOptions = computed(() => [
  'Все клубы',
  ...availableClubs.value,
])

const ageGroupOptions = computed(() => [
  'Все группы',
  ...availableAgeGroups.value,
])

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
      || athlete.fioEnglish.toLowerCase().includes(query),
    )
  }

  // Filter by club
  if (selectedClub.value && selectedClub.value !== 'Все клубы') {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
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
  if (selectedClub.value && selectedClub.value !== 'Все клубы') {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
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
      || athlete.fioEnglish.toLowerCase().includes(query),
    )
  }

  // Filter by club
  if (selectedClub.value && selectedClub.value !== 'Все клубы') {
    filtered = filtered.filter((athlete: any) => athlete.club === selectedClub.value)
  }

  // Filter by age group
  if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
    filtered = filtered.filter((athlete: any) => athlete.ageGroup === selectedAgeGroup.value)
  }

  return filtered
})

// Helper methods for current tab
const getCurrentData = () => {
  switch (activeTab.value) {
    case 'men':
      return filteredMenData.value
    case 'women':
      return filteredWomenData.value
    default:
      return filteredRatingData.value
  }
}

const getCurrentCount = () => {
  switch (activeTab.value) {
    case 'men':
      return filteredMenData.value.length
    case 'women':
      return filteredWomenData.value.length
    default:
      return filteredRatingData.value.length
  }
}

const getCurrentTabLabel = () => {
  switch (activeTab.value) {
    case 'men':
      return 'Мужчины'
    case 'women':
      return 'Женщины'
    default:
      return 'Все участники'
  }
}

const getCurrentTabIcon = () => {
  switch (activeTab.value) {
    case 'men':
      return 'i-heroicons-user'
    case 'women':
      return 'i-heroicons-user'
    default:
      return 'i-heroicons-users'
  }
}

const getCurrentTabColor = () => {
  switch (activeTab.value) {
    case 'men':
      return 'text-green-600'
    case 'women':
      return 'text-pink-600'
    default:
      return 'text-blue-600'
  }
}

// Method to show athlete details
const showAthleteDetails = (athlete: any) => {
  selectedAthlete.value = athlete
  showDetailsDrawer.value = true
}
</script>
