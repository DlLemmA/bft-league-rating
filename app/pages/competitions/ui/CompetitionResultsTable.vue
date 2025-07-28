<template>
  <div class="space-y-4">
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-hashtag" class="mr-1" />
                Место
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-user" class="mr-1" />
                Спортсмен
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-building-office" class="mr-1" />
                Клуб
              </div>
            </th>
            <th v-if="hasCategories"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-tag" class="mr-1" />
                Категория
              </div>
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center justify-center">
                <UIcon name="i-heroicons-clock" class="mr-1" />
                Время
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-star" class="mr-1" />
                Очки
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="result in results" :key="result.nickname" class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('show-details', result)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div :class="hasAgeGroupPlaces ? 'grid grid-cols-3 gap-2 text-xs' : 'grid grid-cols-2 gap-2 text-xs'">
                <div :class="[
                  'text-center p-1 rounded',
                  getBestPlaceType(result) === 'absolute' ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50',
                ]">
                  <div class="text-xs text-gray-500 mb-1">
                    Общий
                  </div>
                  <div :class="getBestPlaceType(result) === 'absolute' ? 'text-yellow-700 font-bold' : 'text-gray-700'">
                    {{ result.absolutePlace || '—' }}
                  </div>
                </div>

                <div :class="[
                  'text-center p-1 rounded',
                  getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'bg-blue-100 border border-blue-300' : 'bg-pink-100 border border-pink-300') : 'bg-gray-50',
                ]">
                  <div class="text-xs text-gray-500 mb-1">
                    {{ result.gender === 'male' ? 'Муж' : 'Жен' }}
                  </div>
                  <div
                    :class="getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'text-blue-700 font-bold' : 'text-pink-700 font-bold') : 'text-gray-700'">
                    <span v-if="result.genderAbsolutePlace && result.genderAbsolutePlace <= 3" class="mr-1">
                      {{ result.genderAbsolutePlace === 1 ? '🥇' : result.genderAbsolutePlace === 2 ? '🥈' : '🥉' }}
                    </span>
                    {{ result.genderAbsolutePlace || '—' }}
                  </div>
                </div>

                <div v-if="hasAgeGroupPlaces" :class="[
                  'text-center p-1 rounded',
                  getBestPlaceType(result) === 'ageGroup' ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50',
                ]">
                  <div class="text-xs text-gray-500 mb-1">
                    {{ result.ageGroup || 'Возраст' }}
                  </div>
                  <div :class="getBestPlaceType(result) === 'ageGroup' ? 'text-purple-700 font-bold' : 'text-gray-700'">
                    <span v-if="result.ageGroupPlace && result.ageGroupPlace <= 3" class="mr-1">
                      {{ result.ageGroupPlace === 1 ? '🥇' : result.ageGroupPlace === 2 ? '🥈' : '🥉' }}
                    </span>
                    {{ result.ageGroupPlace || '—' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <UAvatar :src="result.license ? result.license.avatarSrc : null" :alt="result.nickname" size="sm" />
                <div class="space-y-1">
                  <div class="text-sm font-medium text-gray-900 flex items-center">
                    {{ result.nickname }}
                    <span v-if="result.license"
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
                      {{ result.license.id }}
                    </span>
                  </div>
                  <div v-if="result.birthYear" class="text-xs text-gray-500">
                    {{ result.birthYear }} г.р.
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UTooltip :text="result.club || '—'">
                <div class="text-sm text-gray-900 truncate max-w-32">
                  {{ result.club || '—' }}
                </div>
              </UTooltip>
            </td>
            <td v-if="hasCategories" class="px-6 py-4 whitespace-nowrap">
              <div v-if="result.category" class="text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {{ result.category }}
                </span>
              </div>
              <div v-else class="text-sm text-gray-500">
                —
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="text-sm font-medium text-gray-900">
                {{ result.totalTime }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="result.points" class="text-sm font-medium text-blue-600">
                {{ result.points }}
              </div>
              <div v-else class="text-sm text-gray-500">
                —
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-3">
      <div v-for="result in results" :key="result.nickname"
        class="rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors bg-white"
        @click="$emit('show-details', result)">
        <div class="p-4 pb-3">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center flex-1 min-w-0">
              <div class="flex-shrink-0 mr-3">
                <UAvatar :src="result.license ? result.license.avatarSrc : null" :alt="result.nickname" size="sm" />
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ result.nickname }}
                </h3>
                <div class="flex items-center text-sm text-gray-600 mt-1">
                  <UIcon v-if="result.license" name="i-heroicons-identification" class="mr-1" size="14" />
                  <span v-if="result.license" class="mr-3">№{{ result.license.id }}</span>
                  <UIcon name="i-heroicons-user" class="mr-1" size="14" />
                  <span>{{ result.gender === 'male' ? 'Мужчина' : 'Женщина' }}</span>
                </div>
              </div>
            </div>

            <div class="flex-shrink-0 text-right">
              <div class="text-lg font-bold text-gray-900">
                {{ result.totalTime }}
              </div>
              <div v-if="result.points" class="text-sm text-blue-600">
                {{ result.points }} очков
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-4">
              <div v-if="result.club" class="flex items-center text-gray-600">
                <UIcon name="i-heroicons-building-office" class="mr-1" size="14" />
                <span class="truncate">{{ result.club }}</span>
              </div>
              <div v-if="hasCategories && result.category" class="flex items-center">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700">
                  {{ result.category }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          <div :class="hasAgeGroupPlaces ? 'grid grid-cols-3 gap-2 text-sm' : 'grid grid-cols-2 gap-2 text-sm'">
            <div :class="[
              'text-center p-2 rounded',
              getBestPlaceType(result) === 'absolute' ? 'bg-yellow-100 border border-yellow-300' : '',
            ]">
              <div class="text-xs text-gray-500 mb-1">
                Общий
              </div>
              <div :class="getBestPlaceType(result) === 'absolute' ? 'text-yellow-700 font-bold' : 'text-gray-700'">
                {{ result.absolutePlace || '—' }}
              </div>
            </div>

            <div :class="[
              'text-center p-2 rounded',
              getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'bg-blue-100 border border-blue-300' : 'bg-pink-100 border border-pink-300') : '',
            ]">
              <div class="text-xs text-gray-500 mb-1">
                {{ result.gender === 'male' ? 'Муж' : 'Жен' }}
              </div>
              <div
                :class="getBestPlaceType(result) === 'gender' ? (result.gender === 'male' ? 'text-blue-700 font-bold' : 'text-pink-700 font-bold') : 'text-gray-700'">
                <span v-if="result.genderAbsolutePlace && result.genderAbsolutePlace <= 3" class="mr-1">
                  {{ result.genderAbsolutePlace === 1 ? '🥇' : result.genderAbsolutePlace === 2 ? '�' : '🥉' }}
                </span>
                {{ result.genderAbsolutePlace || '—' }}
              </div>
            </div>

            <div v-if="hasAgeGroupPlaces" :class="[
              'text-center p-2 rounded',
              getBestPlaceType(result) === 'ageGroup' ? 'bg-purple-100 border border-purple-300' : '',
            ]">
              <div class="text-xs text-gray-500 mb-1">
                {{ result.ageGroup || 'Возраст' }}
              </div>
              <div :class="getBestPlaceType(result) === 'ageGroup' ? 'text-purple-700 font-bold' : 'text-gray-700'">
                <span v-if="result.ageGroupPlace && result.ageGroupPlace <= 3" class="mr-1">
                  {{ result.ageGroupPlace === 1 ? '🥇' : result.ageGroupPlace === 2 ? '🥈' : '🥉' }}
                </span>
                {{ result.ageGroupPlace || '—' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  results: unknown[]
}

const props = defineProps<Props>()

defineEmits(['show-details'])

const hasCategories = computed(() => {
  return props.results.some(result => result.category)
})

const hasAgeGroupPlaces = computed(() => {
  return props.results.some(result => result.ageGroupPlace)
})

const getBestPlaceType = (result: unknown): 'absolute' | 'gender' | 'ageGroup' | null => {
  const places = [
    { type: 'absolute' as const, place: result.absolutePlace },
    { type: 'gender' as const, place: result.genderAbsolutePlace },
    ...(hasAgeGroupPlaces.value ? [{ type: 'ageGroup' as const, place: result.ageGroupPlace }] : []),
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
