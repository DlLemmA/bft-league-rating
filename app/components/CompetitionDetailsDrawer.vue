<template>
  <UDrawer :direction="isDesktop ? 'right' : 'bottom'">
    <template #header>
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold flex items-center">
          <UIcon name="i-heroicons-trophy" class="mr-2 text-blue-600" />
          Детали рейтинга
        </h2>
      </div>
    </template>
    <template #body>
      <div class="mb-6">
        <div class="flex items-center space-x-3 mb-4">
          <UAvatar :src="athlete.license ? athlete.license.avatarSrc : null" :alt="athlete.fioRussian" size="lg" />
          <div>
            <div class="text-lg font-medium">
              {{ athlete.fioRussian }}
            </div>
            <div class="text-sm text-gray-500">
              {{ athlete.fioEnglish }}
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
                {{ athlete.id }}
              </span>
              <span v-if="athlete.gender" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="athlete.gender === 'Мужской' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'">
                <UIcon name="i-heroicons-user" class="mr-1" size="xs" />
                {{ athlete.gender }}
              </span>
              <span v-if="athlete.ageGroup"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                <UIcon name="i-heroicons-tag" class="mr-1" size="xs" />
                {{ athlete.ageGroup }}
                <span v-if="athlete.ageGroupPlace" class="ml-1 font-bold">({{ athlete.ageGroupPlace }} место)</span>
              </span>
              <span v-if="athlete.club" class="text-sm text-gray-600">{{ athlete.club }}</span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div class="text-xl font-bold text-blue-700 flex items-center justify-between mb-2">
            <span>Итоговые очки:</span>
            <span>{{ athlete.totalPoints }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <div v-if="athlete.absolutePlace" class="text-sm flex items-center">
              <span class="font-medium">{{ athlete.absolutePlace }}</span>
              <span class="text-gray-600 ml-1">место в абсолюте</span>
              <span v-if="athlete.absolutePlace <= 3" class="ml-1">
                {{ athlete.absolutePlace === 1 ? '🥇' : athlete.absolutePlace === 2 ? '🥈' : '🥉' }}
              </span>
            </div>
            <div v-if="athlete.genderPlace" class="text-sm flex items-center">
              <span class="font-medium">{{ athlete.genderPlace }}</span>
              <span class="text-gray-600 ml-1">место среди {{ athlete.gender === 'Мужской' ? 'мужчин' : 'женщин'
              }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Prioritized categories -->
          <div class="bg-gray-50 rounded-md p-4 border border-gray-200">
            <h3 class="font-bold text-lg mb-3">
              Лучшие результаты по категориям:
            </h3>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <div class="font-medium flex items-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">С</span>
                  Спринт
                </div>
                <div>{{ bestResults.sprint ? `${bestResults.sprint.points} очков` : 'Не участвовал' }}</div>
              </div>
              <div v-if="bestResults.sprint" class="text-sm text-gray-600 pl-6">
                {{ bestResults.sprint.competitionTitle }}
              </div>

              <div class="flex justify-between items-center">
                <div class="font-medium flex items-center">
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">О</span>
                  Олимпийка
                </div>
                <div>{{ bestResults.olympic ? `${bestResults.olympic.points} очков` : 'Не участвовал' }}</div>
              </div>
              <div v-if="bestResults.olympic" class="text-sm text-gray-600 pl-6">
                {{ bestResults.olympic.competitionTitle }}
              </div>

              <div class="flex justify-between items-center">
                <div class="font-medium flex items-center">
                  <span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">Д</span>
                  Дуатлон
                </div>
                <div>{{ bestResults.duathlon ? `${bestResults.duathlon.points} очков` : 'Не участвовал' }}</div>
              </div>
              <div v-if="bestResults.duathlon" class="text-sm text-gray-600 pl-6">
                {{ bestResults.duathlon.competitionTitle }}
              </div>

              <div class="flex justify-between items-center">
                <div class="font-medium flex items-center">
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">К</span>
                  Кросс
                </div>
                <div>{{ bestResults.kross ? `${bestResults.kross.points} очков` : 'Не участвовал' }}</div>
              </div>
              <div v-if="bestResults.kross" class="text-sm text-gray-600 pl-6">
                {{ bestResults.kross.competitionTitle }}
              </div>
            </div>
          </div>

          <!-- Other events -->
          <div class="bg-gray-50 rounded-md p-4 border border-gray-200">
            <h3 class="font-bold text-lg mb-3">
              Лучшие 4 других результата:
            </h3>

            <div v-if="otherResults.length > 0" class="space-y-3">
              <div v-for="(result, index) in otherResults" :key="index" class="flex justify-between items-center">
                <div class="text-sm">
                  <div>{{ result.competitionTitle }}</div>
                  <div class="text-xs text-gray-500">
                    {{ getCategoryLabel(result.category) }}
                  </div>
                </div>
                <div class="font-medium text-blue-600">
                  {{ result.points }}
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">
              Нет дополнительных результатов
            </div>
          </div>

          <!-- All competitions -->
          <div v-if="athlete.competitions && athlete.competitions.length > 0" class="mt-6">
            <h3 class="font-bold text-lg mb-3">
              Все соревнования:
            </h3>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Соревнование
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Категория
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Очки
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Учтено
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="comp in sortedCompetitions" :key="comp.competition" class="hover:bg-gray-50">
                    <td class="px-4 py-2 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ comp.competitionTitle }}
                      </div>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <span :class="getCategoryBadgeClass(comp.category)">
                        {{ getCategoryLabel(comp.category) }}
                      </span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <div class="text-sm font-medium text-blue-600">
                        {{ comp.points }}
                      </div>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <UIcon v-if="isCountedCompetition(comp)" name="i-heroicons-check-circle" class="text-green-500" />
                      <UIcon v-else name="i-heroicons-x-circle" class="text-gray-300" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { License, CompetitionResult } from '~/types'
import { EventCategory } from '~/types'
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 768px)')

const props = defineProps<{
  athlete: License
}>()

// Prioritized categories
const prioritizedCategories = [
  EventCategory.Sprint,
  EventCategory.Olympic,
  EventCategory.Duathlon,
  EventCategory.Kross,
]

// Sort competitions by points
const sortedCompetitions = computed(() => {
  if (!props.athlete.competitions) return []
  return [...props.athlete.competitions].sort((a, b) => b.points - a.points)
})

// Get best result for each prioritized category
const bestResults = computed(() => {
  const results = {
    sprint: null as CompetitionResult | null,
    olympic: null as CompetitionResult | null,
    duathlon: null as CompetitionResult | null,
    kross: null as CompetitionResult | null,
  }

  if (props.athlete?.competitions) {
    props.athlete.competitions.forEach((comp) => {
      if (comp.category === EventCategory.Sprint && (!results.sprint || comp.points > results.sprint.points)) {
        results.sprint = comp
      }
      else if (comp.category === EventCategory.Olympic && (!results.olympic || comp.points > results.olympic.points)) {
        results.olympic = comp
      }
      else if (comp.category === EventCategory.Duathlon && (!results.duathlon || comp.points > results.duathlon.points)) {
        results.duathlon = comp
      }
      else if (comp.category === EventCategory.Kross && (!results.kross || comp.points > results.kross.points)) {
        results.kross = comp
      }
    })
  }

  return results
})

// Get other top results (not in prioritized categories or not the best in their category)
const otherResults = computed(() => {
  if (!props.athlete?.competitions) return []

  const otherComps = props.athlete.competitions.filter((comp) => {
    // Skip if it's one of the best results in prioritized categories
    if (comp === bestResults.value.sprint
      || comp === bestResults.value.olympic
      || comp === bestResults.value.duathlon
      || comp === bestResults.value.kross) {
      return false
    }

    return true
  })

  // Sort by points and take top 4
  return otherComps.sort((a, b) => b.points - a.points).slice(0, 4)
})

// Check if a competition is counted in the total points
const isCountedCompetition = (comp: CompetitionResult) => {
  // Check if it's one of the best results in prioritized categories
  if (comp === bestResults.value.sprint
    || comp === bestResults.value.olympic
    || comp === bestResults.value.duathlon
    || comp === bestResults.value.kross) {
    return true
  }

  // Check if it's one of the top 4 other results
  return otherResults.value.includes(comp)
}

// Get category label
const getCategoryLabel = (category: EventCategory) => {
  const labels = {
    [EventCategory.Sprint]: 'Спринт',
    [EventCategory.Olympic]: 'Олимпийка',
    [EventCategory.Duathlon]: 'Дуатлон',
    [EventCategory.Kross]: 'Кросс',
    [EventCategory.HalfIronman]: 'Half Ironman',
    [EventCategory.Ironman]: 'Ironman',
  }

  return labels[category] || category
}

// Get category badge class
const getCategoryBadgeClass = (category: EventCategory) => {
  const classes = {
    [EventCategory.Sprint]: 'bg-blue-100 text-blue-800',
    [EventCategory.Olympic]: 'bg-green-100 text-green-800',
    [EventCategory.Duathlon]: 'bg-orange-100 text-orange-800',
    [EventCategory.Kross]: 'bg-purple-100 text-purple-800',
    [EventCategory.HalfIronman]: 'bg-red-100 text-red-800',
    [EventCategory.Ironman]: 'bg-gray-100 text-gray-800',
  }

  return `${classes[category] || 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded`
}
</script>
