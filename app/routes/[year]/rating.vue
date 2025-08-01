<template>
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

      <div class="mb-4">
        <UTabs
          :items="ratingTabs"
          :default-index="activeTabIndex"
          :content="false"
          @update:model-value="handleTabChange"
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
            placeholder="Имя спортсмена..."
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

    <RatingTable
      class="md:bg-white rounded-lg md:shadow-sm"
      :athletes="displayedAthletes"
      @show-details="showAthleteDetails"
    />

    <RatingDetailsDrawer
      v-if="selectedAthlete"
      v-model:open="showDetailsDrawer"
      :athlete="selectedAthlete"
    />
  </div>
</template>

<script setup lang="ts">
import type { License } from '~/utils/transformers/license'

const route = useRoute()
const year = route.params.year as string

useHead({
  title: `Рейтинг ${route.params.year}`,
  meta: [
    { name: 'description', content: `Рейтинг лицензированных участников Любительской Лиги триатлона Беларуси за ${route.params.year} год. Результаты соревнований, очки и места спортсменов.` },
    { property: 'og:title', content: `Рейтинг ${route.params.year} - Любительская Лига Триатлона` },
    { property: 'og:description', content: `Рейтинг лицензированных участников Любительской Лиги триатлона Беларуси за ${route.params.year} год. Результаты соревнований, очки и места спортсменов.` },
  ],
})

const { data: ratingData, pending, error } = await useFetch(`/api/${year}/rating`)

const searchQuery = ref('')
const selectedClub = ref('Все клубы')
const selectedAgeGroup = ref('Все группы')

const showDetailsDrawer = ref(false)
const selectedAthlete = ref<License>()

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

const handleTabChange = (index: number | string) => {
  activeTab.value = ratingTabs[index].key as 'all' | 'men' | 'women'
}

const availableClubs = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return []
  const clubSet = new Set(ratingData.value.map(athlete => athlete.club).filter(Boolean))
  return Array.from(clubSet).sort()
})

const availableAgeGroups = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return []
  const ageGroupSet = new Set(ratingData.value.map(athlete => athlete.ageGroup).filter(Boolean))
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

const menCount = computed(() => {
  if (!ratingData.value) return 0
  return ratingData.value.filter(athlete => athlete.gender === 'Мужской').length
})

const womenCount = computed(() => {
  if (!ratingData.value) return 0
  return ratingData.value.filter(athlete => athlete.gender === 'Женский').length
})

const competitionsCount = computed(() => {
  if (!ratingData.value || ratingData.value.length === 0) return 0

  const competitionSet = new Set()
  ratingData.value.forEach((athlete) => {
    if (athlete.competitions) {
      athlete.competitions.forEach((comp) => {
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

const displayedAthletes = computed(() => {
  if (!ratingData.value) return []

  const query = searchQuery.value.toLowerCase()

  return ratingData.value.filter((athlete) => {
    let isShown = true

    if (activeTab.value === 'men') {
      isShown &&= athlete.gender === 'Мужской'
    }

    if (activeTab.value === 'women') {
      isShown &&= athlete.gender === 'Женский'
    }

    isShown &&= athlete.fioRussian.toLowerCase().includes(query)
      || athlete.fioEnglish.toLowerCase().includes(query)
    if (selectedClub.value && selectedClub.value !== 'Все клубы') {
      isShown &&= athlete.club === selectedClub.value
    }

    if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
      isShown &&= athlete.ageGroup === selectedAgeGroup.value
    }

    return isShown
  })
})

const showAthleteDetails = (athlete: License) => {
  selectedAthlete.value = athlete
  showDetailsDrawer.value = true
}
</script>
