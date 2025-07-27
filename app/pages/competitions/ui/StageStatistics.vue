<template>
  <div class="bg-white rounded-lg shadow">
    <div class="border-b border-gray-100 px-6 py-4">
      <h4 class="text-lg font-semibold flex items-center">
        <UIcon
          name="i-heroicons-chart-bar-square"
          class="mr-2 text-blue-600"
        />
        Статистика по этапам
      </h4>
    </div>

    <div
      v-if="!hasStages"
      class="text-center text-gray-500 py-12"
    >
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="mx-auto mb-3"
        size="xl"
      />
      <p>Нет данных по этапам</p>
    </div>

    <div
      v-else
      class="p-6 space-y-8"
    >
      <div
        v-for="(stats, stageType) in stageStats"
        :key="stageType"
        class="bg-gray-50 rounded-lg p-4 border border-gray-100"
      >
        <div class="flex items-center mb-4 pb-2 border-b border-gray-200">
          <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-xl">
            {{ getStageEmoji(stageType) }}
          </div>
          <h5 class="text-lg font-medium text-gray-800">
            {{ translateStageType(stageType) }}
          </h5>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-50">
            <div class="text-sm text-gray-500 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-trophy"
                class="mr-2 text-amber-500"
              />
              Лучшее время
            </div>
            <div class="font-bold text-lg text-blue-700">
              {{ stats.best }}
            </div>
            <div
              v-if="stats.bestAthlete"
              class="text-xs text-gray-500 mt-1 truncate"
            >
              {{ stats.bestAthlete }}
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-50">
            <div class="text-sm text-gray-500 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-calculator"
                class="mr-2 text-gray-400"
              />
              Среднее время
            </div>
            <div class="font-bold text-lg">
              {{ stats.average }}
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-50">
            <div class="text-sm text-gray-500 mb-2 flex items-center">
              <UIcon
                name="i-heroicons-arrow-trending-up"
                class="mr-2 text-gray-400"
              />
              Медианное время
            </div>
            <div class="font-bold text-lg">
              {{ stats.median }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  results: any[]
}

const props = defineProps<Props>()

// Helper methods
const getStageEmoji = (type: string): string => {
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
  return emojis[type] || '🏁'
}

const translateStageType = (type: string): string => {
  const translations: Record<string, string> = {
    swim: 'Плавание',
    run: 'Бег',
    bike: 'Велосипед',
    transition: 'Транзит',
    transition1: 'T1',
    transition2: 'T2',
    ski: 'Лыжи',
    stage1: 'Этап 1',
    stage2: 'Этап 2',
    stage3: 'Этап 3',
  }
  return translations[type] || type
}

// Format seconds to time string
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '—'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Get all unique stage types from results
const stageTypes = computed(() => {
  if (!props.results || props.results.length === 0) return []

  const types = new Set<string>()

  props.results.forEach((result) => {
    if (result.stages && Array.isArray(result.stages)) {
      result.stages.forEach((stage: any) => {
        if (stage.type) types.add(stage.type)
      })
    }
  })

  return Array.from(types)
})

const hasStages = computed(() => stageTypes.value.length > 0)

// Calculate statistics for each stage type
const stageStats = computed(() => {
  const stats: Record<string, { best: string, bestAthlete?: string, average: string, median: string }> = {}

  stageTypes.value.forEach((stageType) => {
    // Get all times for this stage type
    const stageTimes: { seconds: number, time: string, athlete: string }[] = []

    props.results.forEach((result) => {
      if (result.stages && Array.isArray(result.stages)) {
        const stage = result.stages.find((s: any) => s.type === stageType)
        if (stage && stage.time && stage.durationSeconds) {
          stageTimes.push({
            seconds: stage.durationSeconds,
            time: stage.time,
            athlete: result.nickname,
          })
        }
      }
    })

    if (stageTimes.length === 0) {
      stats[stageType] = { best: '—', average: '—', median: '—' }
      return
    }

    // Sort by time
    stageTimes.sort((a, b) => a.seconds - b.seconds)

    // Best time
    const best = stageTimes[0]

    // Average time
    const totalSeconds = stageTimes.reduce((sum, item) => sum + item.seconds, 0)
    const averageSeconds = totalSeconds / stageTimes.length

    // Median time
    const mid = Math.floor(stageTimes.length / 2)
    const medianTime = stageTimes.length % 2 === 0
      ? stageTimes[mid - 1]
      : stageTimes[mid]

    stats[stageType] = {
      best: best.time,
      bestAthlete: best.athlete,
      average: formatTime(averageSeconds),
      median: medianTime.time,
    }
  })

  return stats
})
</script>
