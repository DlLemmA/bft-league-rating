<template>
  <div class="space-y-4">
    <h3 class="text-xl font-bold flex items-center">
      <UIcon name="i-heroicons-chart-bar" class="mr-2 text-blue-600" />
      Подробная статистика
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <!-- Time Statistics -->
      <div class="bg-white rounded-lg shadow p-6">
        <h4 class="text-lg font-semibold mb-4 flex items-center">
          <UIcon name="i-heroicons-clock" class="mr-2 text-blue-600" />
          Общая статистика по времени
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded p-4">
            <div class="text-sm text-gray-500 mb-1">
              Лучшее время
            </div>
            <div class="font-medium text-lg flex items-center">
              <UIcon name="i-heroicons-trophy" class="mr-2 text-amber-500" />
              {{ bestTime }}
            </div>
          </div>
          <div class="bg-gray-50 rounded p-4">
            <div class="text-sm text-gray-500 mb-1">
              Среднее время
            </div>
            <div class="font-medium text-lg">
              {{ averageTime }}
            </div>
          </div>
          <div class="bg-gray-50 rounded p-4">
            <div class="text-sm text-gray-500 mb-1">
              Медианное время
            </div>
            <div class="font-medium text-lg">
              {{ medianTime }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage Statistics -->
    <StageStatistics :results="results" />
  </div>
</template>

<script setup lang="ts">
import StageStatistics from './StageStatistics.vue'

interface Statistics {
  total: number
  men: number
  women: number
  licensed: number
  unlicensed: number
}

interface Props {
  statistics: Statistics
  results: any[]
}

const props = defineProps<Props>()

// Computed properties

const bestTime = computed((): string => {
  if (!props.results || props.results.length === 0) return '—'

  const bestResult = props.results.reduce((best, current) =>
    (current.totalTimeSeconds < best.totalTimeSeconds) ? current : best,
    props.results[0],
  )

  return bestResult.totalTime || '—'
})

const averageTime = computed((): string => {
  if (!props.results || props.results.length === 0) return '—'

  const validResults = props.results.filter(r => typeof r.totalTimeSeconds === 'number')
  if (validResults.length === 0) return '—'

  const totalSeconds = validResults.reduce((sum, result) => sum + result.totalTimeSeconds, 0)
  const averageSeconds = totalSeconds / validResults.length

  // Format seconds to time string (HH:MM:SS)
  const hours = Math.floor(averageSeconds / 3600)
  const minutes = Math.floor((averageSeconds % 3600) / 60)
  const seconds = Math.floor(averageSeconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
})

const medianTime = computed((): string => {
  if (!props.results || props.results.length === 0) return '—'

  const validResults = props.results.filter(r => typeof r.totalTimeSeconds === 'number')
  if (validResults.length === 0) return '—'

  // Sort by time
  const sortedTimes = [...validResults].sort((a, b) => a.totalTimeSeconds - b.totalTimeSeconds)

  // Get median
  const mid = Math.floor(sortedTimes.length / 2)
  const medianResult = sortedTimes.length % 2 === 0
    ? sortedTimes[mid - 1]
    : sortedTimes[mid]

  return medianResult.totalTime || '—'
})
</script>
