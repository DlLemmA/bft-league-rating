<template>
  <UDrawer :direction="isDesktop ? 'right' : 'bottom'">
    <template #header>
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold flex items-center">
          <UIcon name="i-heroicons-trophy" class="mr-2 text-blue-600" />
          Детали результата
        </h2>
      </div>
    </template>
    <template #body>
      <div class="mb-6">
        <div class="flex items-center space-x-3 mb-4">
          <UAvatar :src="result.license ? result.license.avatarSrc : null" :alt="result.nickname" size="lg" />
          <div>
            <div class="text-lg font-medium">
              {{ result.nickname }}
            </div>
            <div v-if="result.birthYear" class="text-sm text-gray-500">
              {{ result.birthYear }} г.р.
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-1">
              <span v-if="result.license"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
                {{ result.license.id }}
              </span>
              <span v-if="result.gender" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="result.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'">
                <UIcon name="i-heroicons-user" class="mr-1" size="xs" />
                {{ result.gender === 'male' ? 'Мужчина' : 'Женщина' }}
              </span>
              <span v-if="result.ageGroup"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                <UIcon name="i-heroicons-tag" class="mr-1" size="xs" />
                {{ result.ageGroup }}
                <span v-if="result.ageGroupPlace" class="ml-1 font-bold">({{ result.ageGroupPlace }} место)</span>
              </span>
              <span v-if="result.club" class="text-sm text-gray-600">{{ result.club }}</span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div class="text-xl font-bold text-blue-700 flex items-center justify-between mb-4">
            <span>Общее время:</span>
            <span>{{ result.totalTime }}</span>
          </div>

          <div
            :class="result.ageGroup && result.ageGroupPlace ? 'grid grid-cols-1 sm:grid-cols-3 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'">
            <div :class="[
              'text-center p-3 rounded-lg',
              getBestPlaceType(result) === 'absolute' ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-white border border-gray-200',
            ]">
              <div class="text-xs text-gray-500 mb-1 font-medium">
                Общий результат
              </div>
              <div
                :class="getBestPlaceType(result) === 'absolute' ? 'text-yellow-700 font-bold text-lg' : 'text-gray-700 text-lg'">
                {{ result.absolutePlace || '—' }}
              </div>
            </div>

            <div :class="[
              'text-center p-3 rounded-lg',
              getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-pink-100 border-2 border-pink-300') : 'bg-white border border-gray-200',
            ]">
              <div class="text-xs text-gray-500 mb-1 font-medium">
                {{ result.gender === 'male' ? 'Среди мужчин' : 'Среди женщин' }}
              </div>
              <div
                :class="getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'text-blue-700 font-bold text-lg' : 'text-pink-700 font-bold text-lg') : 'text-gray-700 text-lg'">
                <span v-if="result.genderAbsolutePlace && result.genderAbsolutePlace <= 3" class="mr-1">
                  {{ result.genderAbsolutePlace === 1 ? '🥇' : result.genderAbsolutePlace === 2 ? '🥈' : '🥉' }}
                </span>
                {{ result.genderAbsolutePlace || '—' }}
              </div>
            </div>

            <div v-if="result.ageGroup && result.ageGroupPlace" :class="[
              'text-center p-3 rounded-lg',
              getBestPlaceType(result) === 'ageGroup' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-white border border-gray-200',
            ]">
              <div class="text-xs text-gray-500 mb-1 font-medium">
                {{ result.ageGroup }}
              </div>
              <div
                :class="getBestPlaceType(result) === 'ageGroup' ? 'text-purple-700 font-bold text-lg' : 'text-gray-700 text-lg'">
                <span v-if="result.ageGroupPlace && result.ageGroupPlace <= 3" class="mr-1">
                  {{ result.ageGroupPlace === 1 ? '🥇' : result.ageGroupPlace === 2 ? '🥈' : '🥉' }}
                </span>
                {{ result.ageGroupPlace }}
              </div>
            </div>
          </div>

          <div v-if="result.points" class="mt-4 pt-3 border-t border-blue-200">
            <div class="text-center">
              <div class="text-sm text-blue-600 mb-1">
                Очки за результат
              </div>
              <div class="text-2xl font-bold text-blue-700">
                {{ result.points }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="result.points && result.hasLicense" class="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-lg flex items-center">
              <UIcon name="i-heroicons-calculator" class="mr-2 text-amber-600" />
              Расчет очков
            </h3>
            <NuxtLink :to="calculatorLink" class="text-xs text-blue-600 hover:text-blue-800 flex items-center">
              <UIcon name="i-heroicons-calculator" class="w-3 h-3 mr-1" />
              Показать подробный расчет
            </NuxtLink>
          </div>

          <div class="bg-white rounded p-3 border border-amber-200 mb-4">
            <div class="text-sm text-amber-800 mb-2">
              Итоговый результат:
            </div>
            <div class="font-mono text-lg text-amber-900 font-bold">
              {{ result.points }} очков = {{ basePoints }} × {{ pointsCoefficient }}
            </div>
            <div class="text-xs text-gray-600 mt-1">
              Отставание от победителя: {{ timeDifference }}
            </div>
          </div>
        </div>

        <div v-if="result.stages && result.stages.length > 0" class="space-y-4">
          <div class="bg-gray-50 rounded-md p-4 border border-gray-200">
            <h3 class="font-bold text-lg mb-3 flex items-center">
              <UIcon name="i-heroicons-clock" class="mr-2 text-blue-600" />
              Результаты по этапам:
            </h3>

            <UTimeline :items="timelineItems" size="sm" :ui="{
              item: 'even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right',
            }" class="translate-x-[calc(50%-1rem)]">
              <template v-for="(stage, index) in result.stages" :key="index" #[`stage-${index}-indicator`]>
                <span class="text-lg">{{ getStageEmoji(stage.type) }}</span>
              </template>

              <template v-for="(stage, index) in result.stages" :key="index" #[`stage-${index}-title`]>
                <div>
                  <div class="font-semibold">
                    {{ translateStageType(stage.type) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    <span class="font-medium">{{ stage.time }}</span>
                    <span v-if="stage.pace" class="ml-2">{{ stage.pace }}</span>
                  </div>
                </div>
              </template>
            </UTimeline>
          </div>

          <div v-if="hasStageStatistics" class="bg-gray-50 rounded-md p-4 border border-gray-200">
            <h3 class="font-bold text-lg mb-3 flex items-center">
              <UIcon name="i-heroicons-chart-bar" class="mr-2 text-green-600" />
              Статистика по этапам:
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="bestStage" class="p-3 bg-green-50 rounded border border-green-200">
                <div class="text-sm text-green-700 font-medium">
                  Лучший этап
                </div>
                <div class="flex items-center mt-1">
                  <span class="mr-2">{{ getStageEmoji(bestStage.type) }}</span>
                  <span class="font-bold">{{ translateStageType(bestStage.type) }}</span>
                  <span v-if="bestStage.place" class="ml-2 text-sm">({{ bestStage.place }} место)</span>
                </div>
              </div>

              <div v-if="worstStage" class="p-3 bg-red-50 rounded border border-red-200">
                <div class="text-sm text-red-700 font-medium">
                  Слабый этап
                </div>
                <div class="flex items-center mt-1">
                  <span class="mr-2">{{ getStageEmoji(worstStage.type) }}</span>
                  <span class="font-bold">{{ translateStageType(worstStage.type) }}</span>
                  <span v-if="worstStage.place" class="ml-2 text-sm">({{ worstStage.place }} место)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-gray-50 rounded-md p-4 border border-gray-200 text-center">
          <UIcon name="i-heroicons-information-circle" class="mx-auto mb-2 text-gray-400" size="xl" />
          <p class="text-gray-600">
            Детальная информация по этапам недоступна
          </p>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { TimelineItem } from '@nuxt/ui'

const isDesktop = useMediaQuery('(min-width: 768px)')

const props = defineProps<{
  result: unknown
}>()

const emojis: Record<string, string> = {
  swim: '🏊',
  run: '🏃',
  bike: '🚴',
  transition: '🔄',
  transition1: '🔄',
  transition2: '🔄',
  ski: '⛷️',
  stage1: '1️⃣',
  stage2: '2️⃣',
  stage3: '3️⃣',
}

const getStageEmoji = (type: string): string => {
  return emojis[type] || '🏁'
}

const translations: Record<string, string> = {
  swim: 'Плавание',
  run: 'Бег',
  bike: 'Велосипед',
  transition1: 'Переход 1',
  transition2: 'Переход 2',
  ski: 'Лыжи',
  stage1: 'Этап 1',
  stage2: 'Этап 2',
  stage3: 'Этап 3',
}

const translateStageType = (type: string): string => {
  return translations[type] || type
}

const hasStageStatistics = computed(() => {
  return props.result?.stages && props.result.stages.length > 0
    && props.result.stages.some((stage: unknown) => stage.place)
})

const bestStage = computed(() => {
  if (!props.result?.stages) return null

  const stagesWithPlaces = props.result.stages.filter((stage: unknown) => stage.place)
  if (stagesWithPlaces.length === 0) return null

  return stagesWithPlaces.reduce((best: unknown, current: unknown) => {
    return !best || current.place < best.place ? current : best
  }, null)
})

const worstStage = computed(() => {
  if (!props.result?.stages) return null

  const stagesWithPlaces = props.result.stages.filter(stage => stage.place)
  if (stagesWithPlaces.length === 0) return null

  return stagesWithPlaces.reduce((worst: unknown, current: unknown) => {
    return !worst || current.place > worst.place ? current : worst
  }, null)
})

const basePoints = computed(() => {
  return props.result?.calculationData?.basePoints || 700
})

const winnerTime = computed(() => {
  return props.result?.calculationData?.winnerTime || '—'
})

const timeDifference = computed(() => {
  const diffSeconds = props.result?.calculationData?.timeDifferenceSeconds

  if (diffSeconds === undefined || diffSeconds === null) {
    return '—'
  }

  if (diffSeconds <= 0) {
    return '00:00'
  }

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

const pointsCoefficient = computed(() => {
  if (!props.result?.points || !basePoints.value) return '0.000'

  const coefficient = props.result.points / basePoints.value
  return coefficient.toFixed(3)
})

const calculatorLink = computed(() => {
  const route = useRoute()
  const params = new URLSearchParams()

  if (winnerTime.value && winnerTime.value !== '—') {
    params.set('winnerTime', winnerTime.value)
  }

  if (props.result?.totalTime) {
    params.set('yourTime', props.result.totalTime)
  }

  if (basePoints.value) {
    params.set('basePoints', basePoints.value.toString())
  }

  const queryString = params.toString()
  return `/${route.params.year}/distance-points-calculator${queryString ? '?' + queryString : ''}`
})

const timelineItems = computed((): TimelineItem[] => {
  if (!props.result?.stages) return []

  return props.result.stages.map((stage: any, index: number) => ({
    title: translateStageType(stage.type),
    color: 'primary',
    time: stage.time,
    pace: stage.pace,
    emoji: getStageEmoji(stage.type),
    slot: `stage-${index}`,
  } as TimelineItem & { time: string, pace?: string, emoji: string, slot: string }))
})

const getBestPlaceType = (result: any): 'absolute' | 'gender' | 'ageGroup' | null => {
  const places = [
    { type: 'absolute' as const, place: result.absolutePlace },
    { type: 'gender' as const, place: result.genderAbsolutePlace },
    { type: 'ageGroup' as const, place: result.ageGroupPlace },
  ].filter(p => p.place && p.place > 0)

  if (places.length === 0) return null

  const bestPlace = Math.min(...places.map(p => p.place))

  const bestPlaces = places.filter(p => p.place === bestPlace)
  if (bestPlaces.length > 1) {
    const genderPlace = bestPlaces.find(p => p.type === 'gender')
    if (genderPlace) return 'gender'
  }

  return bestPlaces[0].type
}
</script>
