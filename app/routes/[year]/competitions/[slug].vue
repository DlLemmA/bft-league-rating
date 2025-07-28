<template>
  <div class="mb-6">
    <UBreadcrumb
      :items="breadcrumbLinks"
      class="mb-4"
    />
  </div>

  <div
    v-if="pending"
    class="text-center py-12"
  >
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
    <p class="mt-4 text-gray-600">
      Загрузка результатов...
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
    <div
      v-if="hasMultipleEvents"
      class="space-y-8"
    >
      <div class="hidden sm:block">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            :value="competitionData.statistics.total"
            label="Участников"
            icon="i-heroicons-users"
            icon-color="text-blue-600"
            value-color="text-blue-600"
          />
          <StatisticCard
            :value="competitionData.statistics.men"
            label="Мужчин"
            icon="i-heroicons-user"
            icon-color="text-green-600"
            value-color="text-green-600"
          />
          <StatisticCard
            :value="competitionData.statistics.women"
            label="Женщин"
            icon="i-heroicons-user"
            icon-color="text-pink-600"
            value-color="text-pink-600"
          />
          <StatisticCard
            :value="competitionData.statistics.licensed"
            label="С лицензией"
            icon="i-heroicons-identification"
            icon-color="text-purple-600"
            value-color="text-purple-600"
          />
        </div>
      </div>

      <div class="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <UIcon
            name="i-heroicons-list-bullet"
            class="mr-2"
          />
          События
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="event in competitionData.events"
            :key="event.slug"
            :class="[
              'rounded-lg p-3 transition-all duration-200 cursor-pointer border',
              selectedEvent && selectedEvent.slug === event.slug
                ? 'bg-white border-gray-300 shadow-lg ring-2 ring-white/50 transform scale-105'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm',
            ]"
            @click="selectEvent(event)"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium text-sm leading-tight">
                {{ event.title }}
              </h3>
              <span class="text-amber-600 font-medium text-xs flex items-center ml-2 flex-shrink-0">
                <UIcon
                  name="i-heroicons-star"
                  class="mr-1"
                  size="12"
                />
                {{ event.points }}
              </span>
            </div>

            <div class="flex flex-wrap gap-1 mb-2">
              <span
                v-if="event.category"
                :class="getCategoryBadgeClass(event.category)"
              >
                {{ translateCategory(event.category) }}
              </span>
              <span
                v-if="event.hasResults"
                class="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium"
              >
                Доступны
              </span>
              <span
                v-else
                class="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
              >
                Ожидается
              </span>
            </div>

            <div
              v-if="event.statistics"
              class="text-xs text-gray-600 mb-2 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span class="flex items-center">
                  <UIcon
                    name="i-heroicons-users"
                    class="mr-1"
                    size="12"
                  />
                  Участников:
                </span>
                <span class="font-medium text-gray-900">{{ event.statistics.total }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="flex items-center">
                  <UIcon
                    name="i-heroicons-identification"
                    class="mr-1"
                    size="12"
                  />
                  С лицензией:
                </span>
                <span class="font-medium text-gray-900">{{ event.statistics.licensed }}</span>
              </div>
            </div>

            <UButton
              v-if="event.hasResults"
              color="blue"
              variant="solid"
              size="xs"
              class="w-full"
            >
              Результаты
            </UButton>
            <UButton
              v-else
              color="gray"
              variant="outline"
              size="xs"
              class="w-full"
              disabled
            >
              Недоступны
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hasMultipleEvents || selectedEvent">
      <div class="hidden sm:block mb-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            :value="currentStatistics.total"
            label="Участников"
            icon="i-heroicons-users"
            icon-color="text-blue-600"
            value-color="text-blue-600"
          />
          <StatisticCard
            :value="currentStatistics.men"
            label="Мужчин"
            icon="i-heroicons-user"
            icon-color="text-green-600"
            value-color="text-green-600"
          />
          <StatisticCard
            :value="currentStatistics.women"
            label="Женщин"
            icon="i-heroicons-user"
            icon-color="text-pink-600"
            value-color="text-pink-600"
          />
          <StatisticCard
            :value="currentStatistics.licensed"
            label="С лицензией"
            icon="i-heroicons-identification"
            icon-color="text-purple-600"
            value-color="text-purple-600"
          />
        </div>
      </div>

      <div
        v-if="hasMultipleEvents && selectedEvent"
        class="mb-4"
      >
        <UButton
          color="gray"
          variant="outline"
          icon="i-heroicons-arrow-left"
          class="shadow-sm"
          @click="selectedEvent = null"
        >
          Назад к событиям
        </UButton>
      </div>

      <div v-if="currentStatistics.total > 0">
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="mb-4">
            <UTabs
              :items="mainTabs"
              :default-index="activeMainTabIndex"
              :content="false"
              @update:model-value="handleMainTabChange"
            />
          </div>

          <div v-if="activeMainTab === 'participants'">
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

            <div class="mb-4">
              <UTabs
                :items="genderTabs"
                :default-index="activeGenderTabIndex"
                :content="false"
                @update:model-value="handleGenderTabChange"
              />
            </div>

            <div class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
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
                  placeholder="Имя или клуб..."
                  size="md"
                  class="w-full"
                />
              </div>

              <div class="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-2 sm:gap-4">
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
        </div>

        <CompetitionResultsTable
          v-if="activeMainTab === 'participants'"
          class="md:bg-white rounded-lg md:shadow-sm"
          :results="filteredResults"
          @show-details="showResultDetails"
        />

        <div
          v-else-if="activeMainTab === 'statistics'"
          class="space-y-6"
        >
          <div class="bg-white rounded-lg shadow-sm p-6">
            <CompetitionStatistics
              :statistics="currentStatistics"
              :results="currentAllResults"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md border border-gray-100"
      >
        <UIcon
          name="i-heroicons-clock"
          class="mx-auto mb-4"
          size="xl"
        />
        <p class="text-lg">
          Результаты соревнования пока не доступны
        </p>
        <p class="text-sm mt-2">
          Они появятся здесь после завершения соревнования
        </p>
      </div>
    </div>
  </div>

  <CompetitionResultDetailsDrawer
    v-if="selectedResult"
    v-model:open="showDetailsDrawer"
    :result="selectedResult"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const year = route.params.year as string
const slug = route.params.slug as string

const { data: competitionData, pending, error } = await useFetch(`/api/${year}/competitions/${slug}`)

if (!competitionData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Соревнование не найдено: ${year}/${slug}`,
  })
}

useHead({
  title: `${competitionData.value.title} ${year} - Результаты | ЛЛТ`,
  meta: [
    {
      name: 'description',
      content: `Результаты соревнований ${competitionData.value.title} ${year} года. Рейтинг участников, статистика, детальные результаты по дистанциям. Любительская Лига Триатлона Беларуси.`,
    },
    {
      property: 'og:title',
      content: `${competitionData.value.title} ${year} - Результаты | ЛЛТ`,
    },
    {
      property: 'og:description',
      content: `Результаты соревнований ${competitionData.value.title} ${year} года. Рейтинг участников, статистика, детальные результаты по дистанциям.`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})

const selectedEvent = ref(null)

const selectedResult = ref(null)
const showDetailsDrawer = ref(false)

const breadcrumbLinks = computed(() => [
  {
    label: 'Главная',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: `${competitionData.value?.title || 'Соревнование'} ${year}`,
    icon: 'i-heroicons-flag',
  },
])

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

const searchQuery = ref('')
const selectedClub = ref('Все клубы')
const selectedAgeGroup = ref('Все группы')

const availableClubs = computed(() => {
  if (!currentAllResults.value || currentAllResults.value.length === 0) return []
  const clubSet = new Set(currentAllResults.value.map(r => r.club).filter(Boolean))
  return Array.from(clubSet).sort()
})

const availableAgeGroups = computed(() => {
  if (!currentAllResults.value || currentAllResults.value.length === 0) return []
  const ageGroupSet = new Set(currentAllResults.value.map(r => r.ageGroup).filter(Boolean))
  return Array.from(ageGroupSet).sort()
})

const clubOptions = computed(() => [
  'Все клубы',
  ...availableClubs.value,
])

const ageGroupOptions = computed(() => [
  'Все группы',
  ...availableAgeGroups.value,
])

const filteredResults = computed(() => {
  if (!currentAllResults.value) {
    return []
  }

  const query = searchQuery.value.toLowerCase()

  return currentAllResults.value.filter((result) => {
    if (searchQuery.value) {
      const matchesSearch = result.nickname.toLowerCase().includes(query)
        || (result.club && result.club.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    if (selectedClub.value && selectedClub.value !== 'Все клубы') {
      if (result.club !== selectedClub.value) return false
    }

    if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
      if (result.ageGroup !== selectedAgeGroup.value) return false
    }

    if (activeGenderTab.value === 'men' && result.gender !== 'male') return false
    if (activeGenderTab.value === 'women' && result.gender !== 'female') return false

    return true
  })
})

const activeMainTab = ref<'participants' | 'statistics'>('participants')
const activeGenderTab = ref<'all' | 'men' | 'women'>('all')

const mainTabs = [
  {
    key: 'participants',
    label: 'Участники',
    icon: 'i-heroicons-users',
  },
  {
    key: 'statistics',
    label: 'Статистика',
    icon: 'i-heroicons-chart-bar',
  },
]

const genderTabs = [
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

const activeMainTabIndex = computed(() => {
  const index = mainTabs.findIndex(tab => tab.key === activeMainTab.value)
  return index >= 0 ? index : 0
})

const activeGenderTabIndex = computed(() => {
  const index = genderTabs.findIndex(tab => tab.key === activeGenderTab.value)
  return index >= 0 ? index : 0
})

const handleMainTabChange = (index: number | string) => {
  activeMainTab.value = mainTabs[index].key as 'participants' | 'statistics'
}

const handleGenderTabChange = (index: number | string) => {
  activeGenderTab.value = genderTabs[index].key as 'all' | 'men' | 'women'
}

const selectEvent = (event: unknown) => {
  if (event.hasResults) {
    selectedEvent.value = event
  }
}

const badgeClasses = {
  Sprint: 'bg-sky-100 text-sky-700',
  Olympic: 'bg-emerald-100 text-emerald-700',
  Duathlon: 'bg-orange-100 text-orange-700',
  Kross: 'bg-violet-100 text-violet-700',
  HalfIronman: 'bg-rose-100 text-rose-700',
  Ironman: 'bg-slate-100 text-slate-700',
}

const getCategoryBadgeClass = (category: string) => {
  return `${badgeClasses[category] || 'bg-slate-100 text-slate-700'} text-xs font-medium px-1.5 py-0.5 rounded`
}

const translations = {
  Sprint: 'Спринт',
  Olympic: 'Олимпийка',
  Duathlon: 'Дуатлон',
  Kross: 'Кросс',
  HalfIronman: 'Ironman 70.3',
  Ironman: 'Ironman',
}

const translateCategory = (category: string) => {
  return translations[category] || category
}

const showResultDetails = (result: unknown) => {
  selectedResult.value = result
  showDetailsDrawer.value = true
}
</script>
