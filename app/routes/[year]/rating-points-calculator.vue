<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <!-- Breadcrumb navigation -->
      <UBreadcrumb
        class="mb-4"
        :items="breadcrumbLinks"
      />

      <!-- Page title with mobile optimization -->
      <h1 class="text-4xl md:text-4xl font-bold mb-2">
        <span class="hidden sm:inline">Калькулятор рейтинга {{ year }}</span>
        <span class="sm:hidden">Калькулятор рейтинга</span>
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
          Данные автоматически заполнены из рейтинга
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form
        id="rating-form"
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        @submit.prevent
      >
        <div
          v-for="(category, eventId) in events"
          :key="eventId"
          class="form-group"
        >
          <label
            :for="eventId"
            class="block text-sm font-medium text-gray-700 mb-1"
          >{{ category.name }}:</label>
          <input
            :id="eventId"
            v-model="eventPoints[eventId]"
            type="number"
            :min="0"
            :max="category.maxPoints"
            :placeholder="`Макс: ${category.maxPoints}`"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div class="col-span-1 md:col-span-4 mt-6 space-y-6">
          <!-- Quick result - more prominent -->
          <div class="p-6 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
            <div class="text-center">
              <div class="text-sm text-amber-800 mb-3">
                Итоговый результат рейтинга:
              </div>
              <div class="font-mono text-3xl text-amber-900 font-bold mb-2">
                {{ calculatedResults.total.toFixed(2) }} очков
              </div>
              <div class="text-sm text-gray-600 mt-3">
                Сумма лучших результатов по категориям + 4 лучших других результата
              </div>
            </div>
          </div>

          <!-- Detailed calculation steps -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-medium text-gray-800 mb-4">
              Пошаговый расчет:
            </div>

            <!-- Step 1: Priority categories -->
            <div class="bg-gray-50 rounded p-4 border border-gray-200 mb-4">
              <div class="text-sm text-gray-600 mb-3 font-medium">
                Шаг 1: Лучшие результаты по приоритетным категориям
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span><strong>С</strong>принт:</span>
                  <span class="font-mono">{{ calculatedResults.sprint }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span><strong>О</strong>лимпийка:</span>
                  <span class="font-mono">{{ calculatedResults.olympic }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span><strong>Д</strong>уатлон:</span>
                  <span class="font-mono">{{ calculatedResults.duathlon }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span><strong>К</strong>росс:</span>
                  <span class="font-mono">{{ calculatedResults.kross }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span><strong>З</strong>имний дуатлон:</span>
                  <span class="font-mono">{{ calculatedResults.winterDuathlon }}</span>
                </div>
                <div class="border-t border-gray-300 pt-2 mt-2">
                  <div class="flex justify-between items-center font-medium">
                    <span>Сумма приоритетных:</span>
                    <span class="font-mono">{{ calculatedResults.priorityTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Other events -->
            <div class="bg-gray-50 rounded p-4 border border-gray-200 mb-4">
              <div class="text-sm text-gray-600 mb-3 font-medium">
                Шаг 2: Лучшие 4 результата из остальных соревнований
              </div>
              <div class="space-y-2">
                <div
                  v-for="(event, index) in calculatedResults.otherEvents"
                  :key="index"
                  class="flex justify-between items-center"
                >
                  <span>{{ event.name }}:</span>
                  <span class="font-mono">{{ event.points }}</span>
                </div>
                <div
                  v-if="calculatedResults.otherEvents.length === 0"
                  class="text-gray-500 italic"
                >
                  Нет дополнительных результатов
                </div>
                <div class="border-t border-gray-300 pt-2 mt-2">
                  <div class="flex justify-between items-center font-medium">
                    <span>Сумма дополнительных:</span>
                    <span class="font-mono">{{ calculatedResults.otherTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Final calculation -->
            <div class="bg-amber-100 rounded p-4 border border-amber-300">
              <div class="text-sm text-amber-700 mb-3 font-medium">
                Шаг 3: Итоговый результат
              </div>
              <div class="font-mono text-lg text-amber-900 font-bold">
                {{ calculatedResults.priorityTotal.toFixed(2) }} + {{ calculatedResults.otherTotal.toFixed(2) }} = {{
                  calculatedResults.total.toFixed(2) }}
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
                Пункт 14.8 Положения о Любительской Лиге триатлона:
              </div>
              <img
                src="/img/rating_points_formula.jpg"
                alt="Пункт 14.8 Положения о Любительской Лиге триатлона"
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
    label: 'Калькулятор рейтинга',
    icon: 'i-heroicons-calculator',
  },
]

// Page metadata - mobile optimized title
useHead({
  title: `Калькулятор рейтинга ${year}`,
  meta: [
    { name: 'description', content: `Рассчитайте очки рейтинга в соревнованиях Любительской Лиги триатлона ${year}. Введите результаты соревнований для автоматического расчета итогового рейтинга по официальной формуле.` },
  ],
})

// Load competition points data and competitions
const { data: competitionPointsData } = await useFetch(`/api/${year}/competition-points`)
const { data: competitionsData } = await useAsyncData('competitions', () => {
  return queryCollection('competitions').where('stem', 'LIKE', `${year}%`).all()
})

// Extract base points for each category
const basePoints = computed(() => {
  const points: Record<string, number> = {}
  const categories = competitionPointsData.value?.categories || competitionPointsData.value?.body?.categories
  if (categories) {
    Object.entries(categories).forEach(([key, category]: [string, any]) => {
      points[key] = category.basePoints
    })
  }
  return points
})

// Generate events from competitions data
const events = computed(() => {
  const eventsMap: Record<string, { name: string, category: string, maxPoints: number }> = {}

  if (competitionsData.value) {
    competitionsData.value.forEach((competition: any) => {
      if (competition.events && Array.isArray(competition.events)) {
        // Multi-event competition
        competition.events.forEach((event: any) => {
          const eventKey = `${competition.slug}-${event.slug}`
          eventsMap[eventKey] = {
            name: `${competition.title} - ${event.title}`,
            category: event.category,
            maxPoints: event.points || basePoints.value[event.category] || 700,
          }
        })
      }
      else {
        // Single event competition
        eventsMap[competition.slug] = {
          name: competition.title,
          category: competition.category,
          maxPoints: competition.points || basePoints.value[competition.category] || 700,
        }
      }
    })
  }

  return eventsMap
})

// Prioritized categories for rating calculation
const prioritisedCategories = ['Sprint', 'Olympic', 'Duathlon', 'Kross']

// Reactive state for event points
const eventPoints = ref<Record<string, number | null>>({})
const userHasModifiedData = ref(false)
const showFormula = ref(false)

// URL parameters using VueUse
const urlParams = useUrlSearchParams('history')

// Track initial values to detect user modifications
const initialEventPoints = ref<Record<string, number | null>>({})

// Initialize event points from URL query parameters
onMounted(() => {
  let hasPrefilledData = false

  Object.keys(events.value).forEach((eventId) => {
    const value = urlParams[eventId]
    if (value !== null && value !== undefined) {
      const parsedValue = parseFloat(value as string)
      if (!isNaN(parsedValue)) {
        eventPoints.value[eventId] = parsedValue
        hasPrefilledData = true
      }
    }
  })

  // Store initial values after URL parameters are processed
  nextTick(() => {
    initialEventPoints.value = { ...eventPoints.value }
  })

  // Check for scala total value for validation
  const scalaTotalValue = urlParams.scalaTotalValue
  if (scalaTotalValue) {
    const parsedValue = parseFloat(scalaTotalValue as string)
    if (!isNaN(parsedValue)) {
      // Compare with calculated total
      const calculatedTotal = calculateTotalPoints().total
      const roundedResult = Math.round(calculatedTotal * 100) / 100

      if (roundedResult !== parsedValue) {
        const toast = useToast()
        toast.add({
          title: 'Несоответствие в расчетах',
          description: `Результат калькулятора: ${roundedResult} не соответствует очкам в рейтинге: ${parsedValue}`,
          icon: 'i-heroicons-exclamation-triangle',
          color: 'red',
          timeout: 10000,
        })
      }
    }
  }

  // Show notification if data was pre-filled
  if (hasPrefilledData) {
    const toast = useToast()
    toast.add({
      title: 'Данные загружены',
      description: 'Форма автоматически заполнена данными из рейтинга',
      icon: 'i-heroicons-information-circle',
      color: 'blue',
      timeout: 5000,
    })
  }
})

// Watch for user modifications to hide pre-filled indicator
watch(eventPoints, () => {
  // Only mark as modified if we had pre-filled data and values have actually changed
  if (Object.keys(urlParams).some(key => key !== 'scalaTotalValue') && !userHasModifiedData.value) {
    const hasChanged = JSON.stringify(eventPoints.value) !== JSON.stringify(initialEventPoints.value)

    if (hasChanged) {
      userHasModifiedData.value = true
    }
  }
}, { deep: true })

// Check if data was pre-filled from URL parameters and user hasn't modified it
const isPreFilled = computed(() => {
  return Object.keys(urlParams).some(key => key !== 'scalaTotalValue') && !userHasModifiedData.value
})

// Calculate total points based on current event points
function calculateTotalPoints() {
  // Find maximum points for each prioritized category
  const categoryMax: Record<string, { eventId: string, points: number, name: string }> = {}

  Object.entries(events.value).forEach(([eventId, event]) => {
    const points = eventPoints.value[eventId] || 0
    const category = event.category

    if (prioritisedCategories.includes(category) && points > 0) {
      if (!categoryMax[category] || points > categoryMax[category].points) {
        categoryMax[category] = {
          eventId,
          points,
          name: event.name,
        }
      }
    }
  })

  // Find other events (not in prioritized categories or not the max in their category)
  const otherEvents: { eventId: string, points: number, name: string }[] = []

  Object.entries(events.value).forEach(([eventId, event]) => {
    const points = eventPoints.value[eventId] || 0
    const category = event.category

    if (points > 0) {
      if (!prioritisedCategories.includes(category)
        || !categoryMax[category]
        || categoryMax[category].eventId !== eventId) {
        otherEvents.push({
          eventId,
          points,
          name: event.name,
        })
      }
    }
  })

  // Sort other events by points and take top 4
  const topOtherEvents = otherEvents
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)

  // Calculate total points
  const prioritizedTotal = Object.values(categoryMax).reduce((sum, item) => sum + item.points, 0)
  const otherTotal = topOtherEvents.reduce((sum, item) => sum + item.points, 0)
  const total = prioritizedTotal + otherTotal

  return {
    sprint: categoryMax['Sprint']
      ? `${categoryMax['Sprint'].points} на ${categoryMax['Sprint'].name}`
      : 'Не участвовал',
    olympic: categoryMax['Olympic']
      ? `${categoryMax['Olympic'].points} на ${categoryMax['Olympic'].name}`
      : 'Не участвовал',
    duathlon: categoryMax['Duathlon']
      ? `${categoryMax['Duathlon'].points} на ${categoryMax['Duathlon'].name}`
      : 'Не участвовал',
    kross: categoryMax['Kross']
      ? `${categoryMax['Kross'].points} на ${categoryMax['Kross'].name}`
      : 'Не участвовал',
    otherEvents: topOtherEvents,
    priorityTotal: prioritizedTotal,
    otherTotal: otherTotal,
    total,
  }
}

// Computed results
const calculatedResults = computed(() => calculateTotalPoints())
</script>
