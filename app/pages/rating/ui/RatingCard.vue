<template>
  <div class="rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors bg-white">
    <div class="p-4 pb-3">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center flex-1 min-w-0">
          <div class="flex-shrink-0 mr-3">
            <UAvatar
              :src="athlete.avatarSrc"
              :alt="athlete.fioRussian"
              size="sm"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">
              {{ athlete.fioRussian }}
            </h3>
            <div class="flex items-center text-sm text-gray-600 mt-1">
              <UIcon
                name="i-heroicons-identification"
                class="mr-1"
                size="14"
              />
              <span class="mr-3">№{{ athlete.id }}</span>
              <UIcon
                name="i-heroicons-user"
                class="mr-1"
                size="14"
              />
              <span>{{ athlete.gender === 'Мужской' ? 'Мужчина' : 'Женщина' }}</span>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 text-right">
          <div class="text-lg font-bold text-blue-600">
            {{ formatPoints(athlete.totalPoints) }}
          </div>
          <div class="text-sm text-gray-500">
            очков
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <div
            v-if="athlete.club"
            class="flex items-center text-gray-600"
          >
            <UIcon
              name="i-heroicons-building-office"
              class="mr-1"
              size="14"
            />
            <span class="truncate">{{ athlete.club }}</span>
          </div>
          <div
            v-if="athlete.ageGroup"
            class="flex items-center"
          >
            <span class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700">
              {{ athlete.ageGroup }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div
          :class="[
            'text-center p-2 rounded',
            getBestPlaceType(athlete) === 'absolute' ? 'bg-yellow-100 border border-yellow-300' : '',
          ]"
        >
          <div class="text-xs text-gray-500 mb-1">
            Общий
          </div>
          <div :class="getBestPlaceType(athlete) === 'absolute' ? 'text-yellow-700 font-bold' : 'text-gray-700'">
            {{ athlete.absolutePlace || '—' }}
          </div>
          <div
            v-if="athlete.previousAbsolutePlace && athlete.absolutePlace"
            class="text-xs mt-1"
          >
            <span
              v-if="athlete.absolutePlace < athlete.previousAbsolutePlace"
              class="text-green-600"
            >
              ↗ {{ athlete.previousAbsolutePlace }}→{{ athlete.absolutePlace }}
            </span>
            <span
              v-else-if="athlete.absolutePlace > athlete.previousAbsolutePlace"
              class="text-red-600"
            >
              ↘ {{ athlete.previousAbsolutePlace }}→{{ athlete.absolutePlace }}
            </span>
            <span
              v-else
              class="text-gray-500"
            >
              = {{ athlete.absolutePlace }}
            </span>
          </div>
        </div>

        <div
          :class="[
            'text-center p-2 rounded',
            getBestPlaceType(athlete) === 'gender' ? (athlete.gender === 'Мужской' ? 'bg-blue-100 border border-blue-300' : 'bg-pink-100 border border-pink-300') : '',
          ]"
        >
          <div class="text-xs text-gray-500 mb-1">
            {{ athlete.gender === 'Мужской' ? 'Муж' : 'Жен' }}
          </div>
          <div :class="getBestPlaceType(athlete) === 'gender' ? (athlete.gender === 'Мужской' ? 'text-blue-700 font-bold' : 'text-pink-700 font-bold') : 'text-gray-700'">
            <span
              v-if="athlete.genderPlace <= 3"
              class="mr-1"
            >
              {{ athlete.genderPlace === 1 ? '🥇' : athlete.genderPlace === 2 ? '🥈' : '🥉' }}
            </span>
            {{ athlete.genderPlace || '—' }}
          </div>
          <div
            v-if="athlete.previousGenderPlace && athlete.genderPlace"
            class="text-xs mt-1"
          >
            <span
              v-if="athlete.genderPlace < athlete.previousGenderPlace"
              class="text-green-600"
            >
              ↗ {{ athlete.previousGenderPlace }}→{{ athlete.genderPlace }}
            </span>
            <span
              v-else-if="athlete.genderPlace > athlete.previousGenderPlace"
              class="text-red-600"
            >
              ↘ {{ athlete.previousGenderPlace }}→{{ athlete.genderPlace }}
            </span>
            <span
              v-else
              class="text-gray-500"
            >
              = {{ athlete.genderPlace }}
            </span>
          </div>
        </div>

        <div
          :class="[
            'text-center p-2 rounded',
            getBestPlaceType(athlete) === 'ageGroup' ? 'bg-purple-100 border border-purple-300' : '',
          ]"
        >
          <div class="text-xs text-gray-500 mb-1">
            {{ athlete.ageGroup || 'Возраст' }}
          </div>
          <div :class="getBestPlaceType(athlete) === 'ageGroup' ? 'text-purple-700 font-bold' : 'text-gray-700'">
            <span
              v-if="athlete.ageGroupPlace <= 3"
              class="mr-1"
            >
              {{ athlete.ageGroupPlace === 1 ? '🥇' : athlete.ageGroupPlace === 2 ? '🥈' : '🥉' }}
            </span>
            {{ athlete.ageGroupPlace || '—' }}
          </div>
          <div
            v-if="athlete.previousAgeGroupPlace && athlete.ageGroupPlace"
            class="text-xs mt-1"
          >
            <span
              v-if="athlete.ageGroupPlace < athlete.previousAgeGroupPlace"
              class="text-green-600"
            >
              ↗ {{ athlete.previousAgeGroupPlace }}→{{ athlete.ageGroupPlace }}
            </span>
            <span
              v-else-if="athlete.ageGroupPlace > athlete.previousAgeGroupPlace"
              class="text-red-600"
            >
              ↘ {{ athlete.previousAgeGroupPlace }}→{{ athlete.ageGroupPlace }}
            </span>
            <span
              v-else
              class="text-gray-500"
            >
              = {{ athlete.ageGroupPlace }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { License } from '~/types'

interface Props {
  athlete: License
}

defineProps<Props>()

const formatPoints = (points: number | undefined): string => {
  if (points === undefined) return '0'
  return Number.isInteger(points) ? points.toString() : points.toFixed(2)
}

const getBestPlaceType = (athlete: License): 'absolute' | 'gender' | 'ageGroup' | null => {
  const places = [
    { type: 'absolute' as const, place: athlete.absolutePlace },
    { type: 'gender' as const, place: athlete.genderPlace },
    { type: 'ageGroup' as const, place: athlete.ageGroupPlace },
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
