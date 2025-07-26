<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <UBreadcrumb :items="breadcrumbLinks" class="mb-4" />
      <h1 class="text-4xl font-bold mb-2 flex items-center">
        <UIcon name="i-heroicons-identification" class="mr-3 text-blue-600" size="lg" />
        Лицензии {{ year }}
      </h1>
      <p class="text-gray-600">
        База данных лицензированных участников Любительской Лиги триатлона за {{ year }} год
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p class="mt-4 text-gray-600">
        Загрузка лицензий...
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
      <h2 class="font-bold flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="mr-2" />
        Ошибка загрузки данных:
      </h2>
      <pre class="mt-2 text-sm">{{ error }}</pre>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 flex items-center">
          <UIcon name="i-heroicons-funnel" class="mr-2 text-blue-600" />
          Фильтры и поиск
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-magnifying-glass" class="mr-1" />
              Поиск по имени
            </label>
            <input v-model="searchQuery" type="text" placeholder="Введите имя или фамилию..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-user" class="mr-1" />
              Пол
            </label>
            <USelect v-model="selectedGender" :options="genderOptions" placeholder="Все" size="md" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-tag" class="mr-1" />
              Возрастная группа
            </label>
            <USelect v-model="selectedAgeGroup" :options="ageGroupOptions" placeholder="Все группы" size="md"
              class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UIcon name="i-heroicons-building-office" class="mr-1" />
              Клуб
            </label>
            <USelect v-model="selectedClub" :options="clubOptions" placeholder="Все клубы" size="md" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-identification" class="text-blue-600 mr-2" size="lg" />
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
            <UIcon name="i-heroicons-user" class="text-green-600 mr-2" size="lg" />
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
            <UIcon name="i-heroicons-user" class="text-pink-600 mr-2" size="lg" />
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
            <UIcon name="i-heroicons-building-office" class="text-purple-600 mr-2" size="lg" />
            <div class="text-gray-600">
              Активных клубов
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-600">
            {{ activeClubs }}
          </div>
        </div>
      </div>

      <!-- Licenses Table/Cards -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold flex items-center">
              <UIcon name="i-heroicons-list-bullet" class="mr-2 text-blue-600" />
              Список лицензий
            </h3>
            <span class="text-sm text-gray-500">
              Найдено: {{ filteredLicenses.length }}
            </span>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-hashtag" class="mr-1" />
                    Номер
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-user" class="mr-1" />
                    ФИО
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-user-circle" class="mr-1" />
                    Пол
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-tag" class="mr-1" />
                    Категория
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-building-office" class="mr-1" />
                    Клуб
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-calendar" class="mr-1" />
                    Дата рождения
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="license in paginatedLicenses" :key="license.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ license.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <UAvatar :src="license.avatarSrc" :alt="license.fioRussian" size="sm" />
                    <div class="space-y-1">
                      <div class="text-sm font-medium text-gray-900">
                        {{ license.fioRussian }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ license.fioEnglish }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    license.gender === 'Мужской'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-pink-100 text-pink-800',
                  ]">
                    {{ license.gender === 'Мужской' ? 'М' : 'Ж' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ license.ageGroup }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ license.club || '—' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 flex items-center">
                    <UIcon name="i-heroicons-calendar-days" class="mr-1 text-gray-400" />
                    {{ license.birthDate }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden">
          <div class="divide-y divide-gray-200">
            <div v-for="license in paginatedLicenses" :key="license.id" class="p-4 hover:bg-gray-50">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3 flex-1">
                  <UAvatar :alt="license.fioRussian" size="sm" />
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ license.fioRussian }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ license.fioEnglish }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    license.gender === 'Мужской'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-pink-100 text-pink-800',
                  ]">
                    {{ license.gender === 'Мужской' ? 'М' : 'Ж' }}
                  </span>
                  <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded flex items-center">
                    <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
                    {{ license.id }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-gray-500 flex items-center">
                    <UIcon name="i-heroicons-tag" class="mr-1" size="sm" />
                    Категория
                  </div>
                  <div class="font-medium">
                    {{ license.ageGroup }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 flex items-center">
                    <UIcon name="i-heroicons-building-office" class="mr-1" size="sm" />
                    Клуб
                  </div>
                  <div class="font-medium">
                    {{ license.club || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 flex items-center">
                    <UIcon name="i-heroicons-calendar" class="mr-1" size="sm" />
                    Дата рождения
                  </div>
                  <div class="font-medium">
                    {{ license.birthDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              @click="currentPage > 1 && currentPage--">
              <UIcon name="i-heroicons-arrow-left" class="mr-1" />
              Назад
            </button>
            <button :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              @click="currentPage < totalPages && currentPage++">
              Вперед
              <UIcon name="i-heroicons-arrow-right" class="ml-1" />
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 flex items-center">
                <UIcon name="i-heroicons-document-text" class="mr-1" />
                Показано <span class="font-medium mx-1">{{ startIndex + 1 }}</span> -
                <span class="font-medium mx-1">{{ Math.min(endIndex, filteredLicenses.length) }}</span> из
                <span class="font-medium ml-1">{{ filteredLicenses.length }}</span> результатов
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button :disabled="currentPage <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  @click="currentPage > 1 && currentPage--">
                  <UIcon name="i-heroicons-chevron-left" />
                </button>
                <button v-for="page in visiblePages" :key="page" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]" @click="currentPage = page">
                  {{ page }}
                </button>
                <button :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  @click="currentPage < totalPages && currentPage++">
                  <UIcon name="i-heroicons-chevron-right" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const year = route.params.year as string

// Page metadata - mobile optimized title
useHead({
  title: `Лицензии ${year}`,
  meta: [
    { name: 'description', content: `База данных лицензированных участников Любительской Лиги триатлона Беларуси за ${year} год. Полный список спортсменов с лицензиями, возрастными группами и клубами.` },
    { name: 'keywords', content: `лицензии, триатлон, Беларусь, ${year}, спортсмены, участники, клубы` },
    { property: 'og:title', content: `Лицензии ${year} - Любительская Лига Триатлона` },
    { property: 'og:description', content: `База данных лицензированных участников Любительской Лиги триатлона Беларуси за ${year} год` },
    { property: 'og:type', content: 'website' },
  ],
})


// Breadcrumb navigation
const breadcrumbLinks = [
  {
    label: 'Главная',
    to: '/',
    icon: 'i-heroicons-home'
  },
  {
    label: `Лицензии ${year}`,
    icon: 'i-heroicons-identification'
  }
]

// Load licenses data from API
const { data: licenses, pending, error } = await useFetch(`/api/${year}/licenses`)

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
  { label: 'Женщины', value: 'Женский' }
])

const ageGroupOptions = computed(() => [
  { label: 'Все группы', value: '' },
  ...ageGroups.value.map(ag => ({ label: ag, value: ag }))
])

const clubOptions = computed(() => [
  { label: 'Все клубы', value: '' },
  ...clubs.value.map(club => ({ label: club, value: club }))
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
