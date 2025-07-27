<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <UBreadcrumb
        :items="breadcrumbLinks"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold mb-2">
        <span class="hidden sm:inline">Калькулятор очков за дистанцию</span>
        <span class="sm:hidden">Калькулятор очков</span>
      </h1>

      <!-- Pre-filled data indicator -->
      <div
        v-if="isPreFilled"
        class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div class="flex items-center text-sm text-blue-800">
          <UIcon
            name="i-heroicons-information-circle"
            class="w-4 h-4 mr-2"
          />
          Данные автоматически заполнены из результатов соревнования
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form
        id="calculator-form"
        class="space-y-6"
        @submit.prevent
      >
        <div class="form-group">
          <label
            for="event-type"
            class="block text-sm font-medium text-gray-700 mb-1"
          >Дистанция:</label>
          <USelect
            v-model="selectedEvent"
            :options="eventOptions"
            placeholder="Выберите дистанцию"
            size="md"
            class="w-full"
          />
        </div>

        <div class="form-group">
          <label
            for="time1-hours"
            class="block text-sm font-medium text-gray-700 mb-1"
          >Время победителя:</label>
          <div class="flex items-center space-x-2">
            <input
              id="time1-hours"
              v-model="winnerTime.hours"
              type="number"
              placeholder="часы"
              min="0"
              max="23"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>час(ов),</span>
            <input
              id="time1-minutes"
              v-model="winnerTime.minutes"
              type="number"
              placeholder="мин."
              min="0"
              max="59"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>мин.,</span>
            <input
              id="time1-seconds"
              v-model="winnerTime.seconds"
              type="number"
              placeholder="сек."
              min="0"
              max="59"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>сек.</span>
          </div>
        </div>

        <div class="form-group">
          <label
            for="time2-hours"
            class="block text-sm font-medium text-gray-700 mb-1"
          >Ваше время:</label>
          <div class="flex items-center space-x-2">
            <input
              id="time2-hours"
              v-model="yourTime.hours"
              type="number"
              placeholder="часы"
              min="0"
              max="23"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>час(ов),</span>
            <input
              id="time2-minutes"
              v-model="yourTime.minutes"
              type="number"
              placeholder="мин."
              min="0"
              max="59"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>мин.,</span>
            <input
              id="time2-seconds"
              v-model="yourTime.seconds"
              type="number"
              placeholder="сек."
              min="0"
              max="59"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <span>сек.</span>
          </div>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Результат расчета:</label>
          <div
            v-if="resultError"
            class="p-4 bg-red-50 rounded-md border border-red-200 text-red-600"
          >
            {{ resultMessage }}
          </div>
          <div
            v-else
            class="space-y-4"
          >
            <!-- Quick result - more prominent -->
            <div class="p-6 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
              <div class="text-center">
                <div class="text-sm text-amber-800 mb-3">
                  Итоговый результат:
                </div>
                <div class="font-mono text-2xl text-amber-900 font-bold mb-2">
                  {{ calculatedPoints.toFixed(2) }} очков
                </div>
                <div class="font-mono text-lg text-amber-700">
                  {{ currentBasePoints }} × {{ coefficient.toFixed(3) }}
                </div>
                <div class="text-sm text-gray-600 mt-3 flex items-center justify-center">
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-4 h-4 mr-1"
                  />
                  Отставание от победителя: {{ timeDifferenceFormatted }}
                </div>
              </div>
            </div>

            <!-- Detailed calculation steps -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="text-sm font-medium text-gray-800 mb-3">
                Пошаговый расчет:
              </div>

              <!-- Step 1: Base formula -->
              <div class="bg-gray-50 rounded p-3 border border-gray-200 mb-3">
                <div class="text-xs text-gray-600 mb-1 font-medium">
                  Шаг 1: Базовая формула
                </div>
                <div class="font-mono text-sm text-gray-900">
                  Очки = Базовые очки × max(1 - (Ваше время - Время победителя) / (0.8 × Время победителя), 0)
                </div>
              </div>

              <!-- Step 2: Substitute values -->
              <div class="bg-gray-50 rounded p-3 border border-gray-200 mb-3">
                <div class="text-xs text-gray-600 mb-1 font-medium">
                  Шаг 2: Подставляем значения
                </div>
                <div class="font-mono text-sm text-gray-900">
                  Очки = {{ currentBasePoints }} × max(1 - ({{ formatTime(yourTimeSeconds) }} - {{
                    formatTime(winnerTimeSeconds) }}) / (0.8 × {{ formatTime(winnerTimeSeconds) }}), 0)
                </div>
              </div>

              <!-- Step 3: Calculate time difference -->
              <div class="bg-gray-50 rounded p-3 border border-gray-200 mb-3">
                <div class="text-xs text-gray-600 mb-1 font-medium">
                  Шаг 3: Вычисляем разность времен
                </div>
                <div class="font-mono text-sm text-gray-900">
                  Отставание = {{ formatTime(yourTimeSeconds) }} - {{ formatTime(winnerTimeSeconds) }} = {{
                    timeDifferenceFormatted }}
                </div>
              </div>

              <!-- Step 4: Calculate coefficient -->
              <div class="bg-gray-50 rounded p-3 border border-gray-200 mb-3">
                <div class="text-xs text-gray-600 mb-1 font-medium">
                  Шаг 4: Вычисляем коэффициент
                </div>
                <div class="font-mono text-sm text-gray-900">
                  Коэффициент = max(1 - {{ (yourTimeSeconds - winnerTimeSeconds).toFixed(0) }}с / (0.8 × {{
                    winnerTimeSeconds.toFixed(0) }}с), 0) = {{ coefficient.toFixed(3) }}
                </div>
              </div>

              <!-- Step 5: Final calculation -->
              <div class="bg-amber-100 rounded p-3 border border-amber-300">
                <div class="text-xs text-amber-700 mb-1 font-medium">
                  Шаг 5: Итоговый результат
                </div>
                <div class="font-mono text-base text-amber-900 font-bold">
                  Очки = {{ currentBasePoints }} × {{ coefficient.toFixed(3) }} = {{ calculatedPoints.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- Collapsible Formula Image Section -->
      <div class="mt-6 border-t border-gray-200 pt-6">
        <UButton
          variant="ghost"
          color="gray"
          size="sm"
          class="w-full justify-between"
          @click="showFormula = !showFormula"
        >
          <span class="flex items-center">
            <UIcon
              name="i-heroicons-document-text"
              class="w-4 h-4 mr-2"
            />
            {{ showFormula ? 'Скрыть формулу из Положения' : 'Показать формулу из Положения' }}
          </span>
          <UIcon
            :name="showFormula ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="transition-transform duration-200"
          />
        </UButton>

        <UCollapsible v-model:open="showFormula">
          <template #content>
            <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-700 mb-3">
                Пункт 14.7 Положения о Любительской Лиге триатлона:
              </div>
              <img
                src="/img/distance_points_formula.jpeg"
                alt="Пункт 14.7 Положения о Любительской Лиге триатлона"
                class="w-full h-auto rounded border border-gray-300"
              >
              <div class="mt-3 text-xs text-gray-500">
                <a
                  href="https://triatlon.by/assets/images/files/2025/polozhenie-lyubitelskaya-liga-triatlona-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:underline flex items-center"
                >
                  <UIcon
                    name="i-heroicons-arrow-top-right-on-square"
                    class="w-3 h-3 mr-1"
                  />
                  Открыть полное Положение
                </a>
              </div>
            </div>
          </template>
        </UCollapsible>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'

const route = useRoute()
const year = route.params.year as string

// Breadcrumb navigation
const breadcrumbLinks = [
  {
    label: 'Главная',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Калькулятор очков за дистанцию',
    icon: 'i-heroicons-calculator',
  },
]

// Page metadata - mobile optimized title
useHead({
  title: `Калькулятор очков ${year}`,
  meta: [
    { name: 'description', content: `Рассчитайте очки за дистанцию в соревнованиях Любительской Лиги триатлона ${year}. Введите время победителя и ваше время для автоматического расчета очков по официальной формуле.` },
  ],
})

// Load competition points data
const { data: competitionPointsData } = await useFetch(`/api/${year}/competition-points`)

// Extract data from API response
const predefinedTimes = computed(() => {
  const times: Record<string, { hours: number, minutes: number, seconds: number }> = {}
  const categories = competitionPointsData.value?.body?.categories
  if (categories) {
    Object.entries(categories).forEach(([_key, category]: [string, any]) => {
      times[category.name] = category.defaultWinnerTime
    })
  }
  return times
})

const basePoints = computed(() => {
  const points: Record<string, number> = {}
  const categories = competitionPointsData.value?.body?.categories
  if (categories) {
    Object.entries(categories).forEach(([_key, category]: [string, any]) => {
      points[category.name] = category.basePoints
    })
  }
  return points
})

const eventDescriptions = computed(() => {
  return competitionPointsData.value?.body?.eventDescriptions || {}
})

// Options for USelect component
const eventOptions = computed(() => {
  const categories = competitionPointsData.value?.body?.categories
  if (!categories) return []

  return Object.entries(categories).map(([key, category]: [string, any]) => ({
    label: `${category.name} ${eventDescriptions.value[key] || ''}`.trim(),
    value: category.name,
  }))
})

// Reactive state
const selectedEvent = ref('')
const winnerTime = ref({ hours: 0, minutes: 50, seconds: 0 })
const yourTime = ref({ hours: 0, minutes: 0, seconds: 0 })
const resultMessage = ref('-')
const resultError = ref(false)
const showFormula = ref(false)
const userHasModifiedData = ref(false)

// Parse time string (HH:MM:SS or MM:SS) to time object
function parseTimeString(timeStr: string): { hours: number, minutes: number, seconds: number } {
  if (!timeStr) return { hours: 0, minutes: 0, seconds: 0 }

  // Remove any whitespace and handle potential decimal seconds
  const cleanTimeStr = timeStr.trim()
  const parts = cleanTimeStr.split(':')

  if (parts.length === 3) {
    // HH:MM:SS format
    return {
      hours: Math.max(0, parseInt(parts[0]) || 0),
      minutes: Math.max(0, Math.min(59, parseInt(parts[1]) || 0)),
      seconds: Math.max(0, Math.min(59, Math.floor(parseFloat(parts[2]) || 0))),
    }
  }
  else if (parts.length === 2) {
    // MM:SS format - this is the most common case for competition times
    const minutes = parseInt(parts[0]) || 0
    const seconds = Math.floor(parseFloat(parts[1]) || 0)

    return {
      hours: Math.floor(minutes / 60), // Handle cases where minutes > 59
      minutes: minutes % 60,
      seconds: Math.max(0, Math.min(59, seconds)),
    }
  }
  else if (parts.length === 1) {
    // Just seconds
    const totalSeconds = Math.floor(parseFloat(parts[0]) || 0)
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    }
  }

  return { hours: 0, minutes: 0, seconds: 0 }
}

// Initialize default event when data loads
watch(competitionPointsData, (newData) => {
  const categories = newData?.categories || newData?.body?.categories
  if (categories && !selectedEvent.value) {
    const firstCategory = Object.values(categories)[0] as any
    if (firstCategory) {
      selectedEvent.value = firstCategory.name
    }
  }
}, { immediate: true })

// Initialize from URL parameters using VueUse
const urlParams = useUrlSearchParams('history')

// Initialize from URL parameters
onMounted(() => {
  let hasPrefilledData = false

  // Set winner time from URL parameter
  if (urlParams.winnerTime) {
    winnerTime.value = parseTimeString(urlParams.winnerTime as string)
    hasPrefilledData = true
  }

  // Set your time from URL parameter
  if (urlParams.yourTime) {
    yourTime.value = parseTimeString(urlParams.yourTime as string)
    hasPrefilledData = true
  }

  // Set base points and try to determine event type
  if (urlParams.basePoints) {
    const points = parseInt(urlParams.basePoints as string)
    // Try to match base points to event type
    const eventType = Object.entries(basePoints.value).find(([_, value]) => value === points)?.[0]
    if (eventType) {
      selectedEvent.value = eventType
      hasPrefilledData = true
    }
  }

  // Store initial values after URL parameters are processed
  nextTick(() => {
    initialValues.value = {
      selectedEvent: selectedEvent.value,
      winnerTime: { ...winnerTime.value },
      yourTime: { ...yourTime.value },
    }
  })

  // Show notification if data was pre-filled
  if (hasPrefilledData) {
    const toast = useToast()
    toast.add({
      title: 'Данные загружены',
      description: 'Форма автоматически заполнена данными из результатов соревнования',
      icon: 'i-heroicons-information-circle',
      color: 'blue',
      timeout: 5000,
    })
  }

  calculate()
})

// Remove duplicate - already defined above

// Watch for event type changes to update predefined winner time
watch(selectedEvent, (newEvent) => {
  const predefined = predefinedTimes.value[newEvent]
  if (predefined) {
    winnerTime.value = { ...predefined }
  }
  calculate()
})

// Watch for time changes to recalculate
watch([winnerTime, yourTime], () => {
  calculate()
}, { deep: true })

// Track initial values to detect user modifications
const initialValues = ref({
  selectedEvent: '',
  winnerTime: { hours: 0, minutes: 0, seconds: 0 },
  yourTime: { hours: 0, minutes: 0, seconds: 0 },
})

// Watch for user modifications to hide pre-filled indicator
watch([selectedEvent, winnerTime, yourTime], () => {
  // Only mark as modified if we had pre-filled data and values have actually changed
  if ((urlParams.winnerTime || urlParams.yourTime || urlParams.basePoints) && !userHasModifiedData.value) {
    const hasChanged
      = selectedEvent.value !== initialValues.value.selectedEvent
        || JSON.stringify(winnerTime.value) !== JSON.stringify(initialValues.value.winnerTime)
        || JSON.stringify(yourTime.value) !== JSON.stringify(initialValues.value.yourTime)

    if (hasChanged) {
      userHasModifiedData.value = true
    }
  }
}, { deep: true })

// Convert time object to seconds
function timeToSeconds(time: { hours: number, minutes: number, seconds: number }): number {
  return (
    (parseInt(time.hours?.toString() || '0') * 3600)
    + (parseInt(time.minutes?.toString() || '0') * 60)
    + parseInt(time.seconds?.toString() || '0')
  )
}

// Format seconds to time string
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

// Computed properties for step-by-step calculation
const winnerTimeSeconds = computed(() => timeToSeconds(winnerTime.value))
const yourTimeSeconds = computed(() => timeToSeconds(yourTime.value))
const currentBasePoints = computed(() => basePoints.value[selectedEvent.value] || 700.0)

const timeDifferenceFormatted = computed(() => {
  const diffSeconds = yourTimeSeconds.value - winnerTimeSeconds.value
  if (diffSeconds <= 0) return '00:00'

  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = Math.floor(diffSeconds % 60)

  if (hours > 0) {
    return `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  else {
    return `+${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
})

const coefficient = computed(() => {
  if (winnerTimeSeconds.value <= 0) return 0
  return Math.max(1 - (yourTimeSeconds.value - winnerTimeSeconds.value) / (0.8 * winnerTimeSeconds.value), 0)
})

const calculatedPoints = computed(() => {
  return currentBasePoints.value * coefficient.value
})

// Check if data was pre-filled from URL parameters and user hasn't modified it
const isPreFilled = computed(() => {
  return !!(urlParams.winnerTime || urlParams.yourTime || urlParams.basePoints) && !userHasModifiedData.value
})

// Calculate points
function calculate() {
  resultError.value = false

  if (winnerTimeSeconds.value <= 0 || yourTimeSeconds.value <= 0) {
    resultMessage.value = 'Пожалуйста, введите корректное время победителя и свое.'
    resultError.value = true
    return
  }

  if (yourTimeSeconds.value < winnerTimeSeconds.value) {
    resultMessage.value = 'Ваше время должно быть равно или больше времени победителя.'
    resultError.value = true
    return
  }

  // No need to set resultMessage here as we're using the computed properties in the template
}

// Remove duplicate - already defined above
</script>
