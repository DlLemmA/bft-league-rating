<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <UBreadcrumb
        :items="breadcrumbLinks"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold mb-2 flex items-center">
        <UIcon
          name="i-heroicons-identification"
          class="mr-3 text-blue-600"
          size="lg"
        />
        Лицензии {{ year }}
      </h1>
      <p class="text-gray-600">
        База данных лицензированных участников Любительской Лиги триатлона за {{ year }} год
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="text-center py-12"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">
        Загрузка лицензий...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8"
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

    <!-- Content -->
    <div
      v-else
      class="space-y-8"
    >
      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 flex items-center">
          <UIcon
            name="i-heroicons-funnel"
            class="mr-2 text-blue-600"
          />
          Фильтры и поиск
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="mr-1"
              />
              Поиск по имени
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите имя или фамилию..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-user"
                class="mr-1"
              />
              Пол
            </label>
            <USelect
              v-model="selectedGender"
              :options="genderOptions"
              placeholder="Все"
              size="md"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-tag"
                class="mr-1"
              />
              Возрастная группа
            </label>
            <USelect
              v-model="selectedAgeGroup"
              :options="ageGroupOptions"
              placeholder="Все группы"
              size="md"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-building-office"
                class="mr-1"
              />
              Клуб
            </label>
            <USelect
              v-model="selectedClub"
              :options="clubOptions"
              placeholder="Все клубы"
              size="md"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
          <div class="flex items-center mb-2">
            <UIcon
              name="i-heroicons-identification"
              class="text-blue-600 mr-2"
              size="lg"
            />
            <div class="text-gray-600">
              Всего лицензий
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-600">
            {{ filteredLicenses.length }}
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6 shadow-sm border border-green-100">
          <div class="flex items-center mb-2">
            <UIcon
              name="i-heroicons-user"
              class="text-green-600 mr-2"
              size="lg"
            />
            <div class="text-gray-600">
              Мужчин
            </div>
          </div>
          <div class="text-3xl font-bold text-green-600">
            {{ menCount }}
          </div>
        </div>

        <div class="bg-pink-50 rounded-lg p-6 shadow-sm border border-pink-100">
          <div class="flex items-center mb-2">
            <UIcon
              name="i-heroicons-user"
              class="text-pink-600 mr-2"
              size="lg"
            />
            <div class="text-gray-600">
              Женщин
            </div>
          </div>
          <div class="text-3xl font-bold text-pink-600">
            {{ womenCount }}
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-6 shadow-sm border border-purple-100">
          <div class="flex items-center mb-2">
            <UIcon
              name="i-heroicons-building-office"
              class="text-purple-600 mr-2"
              size="lg"
            />
            <div class="text-gray-600">
              Активных клубов
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-600">
            {{ activeClubs }}
          </div>
        </div>
      </div>

      <LicensesTable
        :licenses="paginatedLicenses"
        :filtered-count="filteredLicenses.length"
        :current-page="currentPage"
        :total-pages="totalPages"
        :start-index="startIndex"
        :end-index="endIndex"
        :visible-pages="visiblePages"
        @update:current-page="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  year: string
}

const props = defineProps<Props>()

// Breadcrumb navigation
const breadcrumbLinks = [
  {
    label: 'Главная',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: `Лицензии ${props.year}`,
    icon: 'i-heroicons-identification',
  },
]

// Load licenses data from API
const { data: licenses, pending, error } = await useFetch(`/api/${props.year}/licenses`)

// Search and filter state
const searchQuery = ref('')
const selectedGender = ref('')
const selectedAgeGroup = ref('')
const selectedClub = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 50

// Computed values for filters
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

// Options for USelect components
const genderOptions = computed(() => [
  { label: 'Все', value: '' },
  { label: 'Мужчины', value: 'Мужской' },
  { label: 'Женщины', value: 'Женский' },
])

const ageGroupOptions = computed(() => [
  { label: 'Все группы', value: '' },
  ...ageGroups.value.map(ag => ({ label: ag, value: ag })),
])

const clubOptions = computed(() => [
  { label: 'Все клубы', value: '' },
  ...clubs.value.map(club => ({ label: club, value: club })),
])

// Filtered licenses
const filteredLicenses = computed(() => {
  if (!licenses.value) return []

  let filtered = licenses.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(license =>
      license.fioRussian.toLowerCase().includes(query)
      || license.fioEnglish.toLowerCase().includes(query),
    )
  }

  if (selectedGender.value) {
    filtered = filtered.filter(license => license.gender === selectedGender.value)
  }

  if (selectedAgeGroup.value) {
    filtered = filtered.filter(license => license.ageGroup === selectedAgeGroup.value)
  }

  if (selectedClub.value) {
    filtered = filtered.filter(license => license.club === selectedClub.value)
  }

  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredLicenses.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedLicenses = computed(() =>
  filteredLicenses.value.slice(startIndex.value, endIndex.value),
)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Statistics
const menCount = computed(() => filteredLicenses.value.filter(l => l.gender === 'Мужской').length)
const womenCount = computed(() => filteredLicenses.value.filter(l => l.gender === 'Женский').length)
const activeClubs = computed(() => {
  const clubSet = new Set(filteredLicenses.value.map(l => l.club).filter(Boolean))
  return clubSet.size
})

// Reset pagination when filters change
watch([searchQuery, selectedGender, selectedAgeGroup, selectedClub], () => {
  currentPage.value = 1
})
</script>