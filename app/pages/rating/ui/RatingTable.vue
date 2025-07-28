<template>
  <div class="space-y-4">
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-hashtag"
                  class="mr-1"
                />
                Место
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-user"
                  class="mr-1"
                />
                Спортсмен
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-building-office"
                  class="mr-1"
                />
                Клуб
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-star"
                  class="mr-1"
                />
                Очки
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(athlete) in athletes"
            :key="`row-${athlete.id}-${athlete.fioRussian}`"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('show-details', athlete)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div
                  :class="[
                    'text-center p-1 rounded',
                    getBestPlaceType(athlete) === 'absolute' ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50',
                  ]"
                >
                  <div class="text-xs text-gray-500 mb-1">
                    Общий
                  </div>
                  <div
                    :class="getBestPlaceType(athlete) === 'absolute' ? 'text-yellow-700 font-bold' : 'text-gray-700'"
                  >
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
                    'text-center p-1 rounded',
                    getBestPlaceType(athlete) === 'gender' ? (athlete.gender === 'Мужской' ? 'bg-blue-100 border border-blue-300' : 'bg-pink-100 border border-pink-300') : 'bg-gray-50',
                  ]"
                >
                  <div class="text-xs text-gray-500 mb-1">
                    {{ athlete.gender === 'Мужской' ? 'Муж' : 'Жен' }}
                  </div>
                  <div
                    :class="getBestPlaceType(athlete) === 'gender' ? (athlete.gender === 'Мужской' ? 'text-blue-700 font-bold' : 'text-pink-700 font-bold') : 'text-gray-700'"
                  >
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
                    'text-center p-1 rounded',
                    getBestPlaceType(athlete) === 'ageGroup' ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50',
                  ]"
                >
                  <div class="text-xs text-gray-500 mb-1">
                    {{ athlete.ageGroup || 'Возраст' }}
                  </div>
                  <div
                    :class="getBestPlaceType(athlete) === 'ageGroup' ? 'text-purple-700 font-bold' : 'text-gray-700'"
                  >
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
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="athlete.avatarSrc"
                  :alt="athlete.fioRussian"
                  size="sm"
                />
                <div class="space-y-1">
                  <div class="text-sm font-medium text-gray-900 flex items-center">
                    {{ athlete.fioRussian }}
                    <span
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <UIcon
                        name="i-heroicons-identification"
                        class="mr-1"
                        size="xs"
                      />
                      {{ athlete.id }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ athlete.fioEnglish }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ athlete.club || '—' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-blue-600">
                {{ formatPoints(athlete.totalPoints) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-3">
      <RatingCard
        v-for="athlete in athletes"
        :key="`card-${athlete.id}-${athlete.fioRussian}`"
        :athlete="athlete"
        @click="$emit('show-details', athlete)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { License } from '~/types'

interface Props {
  athletes: License[]
}

defineProps<Props>()

defineEmits(['show-details'])

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
