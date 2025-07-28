<template>
  <div class="mb-6">
    <UBreadcrumb
      :items="[
        { label: 'Главная', to: '/', icon: 'i-heroicons-home' },
        { label: `Лицензии ${year}` },
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
      Загрузка лицензий...
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
          :value="baseFilteredLicenses.length"
          label="Участников"
          icon="i-heroicons-users"
          icon-color="text-blue-600"
          value-color="text-blue-600"
        />
        <StatisticCard
          :value="menCount"
          label="Мужчин"
          icon="i-heroicons-user"
          icon-color="text-green-600"
          value-color="text-green-600"
        />
        <StatisticCard
          :value="womenCount"
          label="Женщин"
          icon="i-heroicons-user"
          icon-color="text-pink-600"
          value-color="text-pink-600"
        />
        <StatisticCard
          :value="activeClubs"
          label="Активных клубов"
          icon="i-heroicons-building-office"
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
          :items="genderTabs"
          :content="false"
          :default-index="activeTabIndex"
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
                name="i-heroicons-tag"
                class="mr-1"
                size="16"
              />
              Возраст
            </label>
            <USelect
              v-model="selectedAgeGroup"
              :items="ageGroupOptions"
              :disabled="ageGroups.length === 0"
              size="md"
              class="w-full"
            />
            <div
              v-if="ageGroups.length === 0"
              class="text-xs text-gray-500 mt-1"
            >
              Нет данных
            </div>
          </div>

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
              :disabled="clubs.length === 0"
              size="md"
              class="w-full"
            />
            <div
              v-if="clubs.length === 0"
              class="text-xs text-gray-500 mt-1"
            >
              Нет данных
            </div>
          </div>
        </div>
      </div>
    </div>

    <LicensesTable
      class="md:bg-white rounded-lg md:shadow-sm"
      :licenses="filteredLicenses"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  year: string
}

const props = defineProps<Props>()

const { data: licenses, pending, error } = await useFetch(`/api/${props.year}/licenses`)

const searchQuery = ref('')
const selectedAgeGroup = ref('Все группы')
const selectedClub = ref('Все клубы')

const activeTab = ref<'all' | 'men' | 'women'>('all')
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

const activeTabIndex = computed(() => {
  const index = genderTabs.findIndex(tab => tab.key === activeTab.value)
  return index >= 0 ? index : 0
})

const handleTabChange = (index: number | string) => {
  activeTab.value = genderTabs[index].key as 'all' | 'men' | 'women'
}

const ageGroups = computed(() => {
  if (!licenses.value) return []
  const groups = new Set(licenses.value.map(l => l.ageGroup).filter(Boolean))
  return Array.from(groups).sort()
})

const clubs = computed(() => {
  if (!licenses.value) return []
  const clubSet = new Set(licenses.value.map(l => l.club).filter(Boolean))
  return Array.from(clubSet).sort()
})

const ageGroupOptions = computed(() => [
  'Все группы',
  ...ageGroups.value,
])

const clubOptions = computed(() => [
  'Все клубы',
  ...clubs.value,
])

const baseFilteredLicenses = computed(() => {
  if (!licenses.value) return []

  let filtered = licenses.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(license =>
      license.fioRussian.toLowerCase().includes(query)
      || license.fioEnglish.toLowerCase().includes(query),
    )
  }

  if (selectedAgeGroup.value && selectedAgeGroup.value !== 'Все группы') {
    filtered = filtered.filter(license => license.ageGroup === selectedAgeGroup.value)
  }

  if (selectedClub.value && selectedClub.value !== 'Все клубы') {
    filtered = filtered.filter(license => license.club === selectedClub.value)
  }

  return filtered
})

const filteredLicenses = computed(() => {
  let filtered = baseFilteredLicenses.value

  switch (activeTab.value) {
    case 'men':
      filtered = filtered.filter(license => license.gender === 'Мужской')
      break
    case 'women':
      filtered = filtered.filter(license => license.gender === 'Женский')
      break
    default:
      break
  }

  return filtered
})

const menCount = computed(() => baseFilteredLicenses.value.filter(l => l.gender === 'Мужской').length)
const womenCount = computed(() => baseFilteredLicenses.value.filter(l => l.gender === 'Женский').length)
const activeClubs = computed(() => {
  const clubSet = new Set(baseFilteredLicenses.value.map(l => l.club).filter(Boolean))
  return clubSet.size
})
</script>
