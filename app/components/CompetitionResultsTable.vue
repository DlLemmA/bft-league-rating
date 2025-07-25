<template>
  <div class="space-y-4">
    <!-- Desktop Results Table -->
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
          <tr v-for="result in filteredResults" :key="result.nickname" class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('show-details', result)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col space-y-1">
                <!-- Show places in order of priority -->
                <div v-for="(ranking, rankingIndex) in getResultRankings(result)" :key="rankingIndex" :class="[
                  rankingIndex === 0 ? 'text-sm font-medium' : 'text-xs text-gray-600',
                  ranking.highlighted ? ranking.color : '',
                ]" class="flex items-center">
                  <span v-if="ranking.medal" class="mr-1" :class="ranking.medalColor">{{ ranking.medal }}</span>
                  {{ ranking.value }}
                  <span v-if="ranking.suffix" class="ml-1" :class="ranking.suffixClass">{{ ranking.suffix }}</span>
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
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="result.ageGroup" class="text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {{ result.ageGroup }}
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

    <!-- Mobile Results Cards -->
    <div class="md:hidden space-y-4">
      <div v-for="result in filteredResults" :key="result.nickname"
        class="bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer"
        :class="result.license ? 'border-blue-500' : 'border-gray-200'" @click="$emit('show-details', result)">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center">
            <!-- Badge with highest achievement -->
            <div :class="[
              'rounded-full h-8 w-8 flex items-center justify-center mr-2',
              getTopRanking(result) && getTopRanking(result).badgeClass ? getTopRanking(result).badgeClass : 'bg-gray-100',
            ]">
              <span v-if="getTopRanking(result) && getTopRanking(result).medal"
                :class="getTopRanking(result) && getTopRanking(result).medalColor ? getTopRanking(result).medalColor : ''"
                class="font-bold">
                {{ getTopRanking(result).medal }}
              </span>
              <span v-else class="text-sm font-medium">{{ result && result.absolutePlace ? result.absolutePlace : ''
                }}</span>
            </div>
            <div>
              <div class="flex items-center space-x-3">
                <UAvatar :src="result.license ? result.license.avatarSrc : null" :alt="result.nickname" size="sm" />
                <div>
                  <div class="font-medium">
                    {{ result.nickname }}
                  </div>
                  <div v-if="result.birthYear" class="text-xs text-gray-500">
                    {{ result.birthYear }} г.р.
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-500 flex flex-wrap items-center gap-1 mt-1">
                <span v-if="result.club">{{ result.club }}</span>
                <span v-if="result.club && result.ageGroup" class="mx-1">•</span>
                <span v-if="result.ageGroup"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {{ result.ageGroup }}
                </span>

                <!-- Show positions with priority -->
                <span v-for="(ranking, rankingIndex) in getResultRankings(result)"
                  v-if="rankingIndex === 0 || (ranking && ranking.alwaysShow)" :key="rankingIndex" :class="[
                    'ml-1 px-1.5 py-0.5 rounded text-xs',
                    ranking && ranking.badgeClass ? ranking.badgeClass : '',
                  ]">
                  {{ ranking ? ranking.mobileLabel : '' }}
                  <span v-if="ranking && ranking.medal">{{ ranking.medal }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="text-center">
            <div class="font-medium">
              {{ result.totalTime }}
            </div>
            <div v-if="result.points" class="text-xs text-blue-600">
              {{ result.points }} очков
            </div>
            <div v-if="result.license" class="text-xs text-blue-600">
              <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
              {{ result.license.id }}
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
  searchQuery?: string
  selectedClub?: string
  selectedAgeGroup?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  selectedClub: '',
  selectedAgeGroup: '',
})

// Emit event when clicking on result to show details
defineEmits(['show-details'])

// Interface for place ranking
interface PlaceRanking {
  type: 'absolute' | 'gender' | 'ageGroup'
  value: string
  suffix?: string
  suffixClass?: string
  medal?: string
  medalColor?: string
  highlighted?: boolean
  color?: string
  priority: number
  badgeClass?: string
  mobileLabel: string
  alwaysShow?: boolean
  numericPlace?: number
}

// Filter results based on search query, selected club, and age group
const filteredResults = computed(() => {
  if (!props.results) return []

  let filtered = props.results

  // Filter by search query
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(result =>
      result.nickname.toLowerCase().includes(query)
      || (result.club && result.club.toLowerCase().includes(query)),
    )
  }

  // Filter by club
  if (props.selectedClub) {
    filtered = filtered.filter(result => result.club === props.selectedClub)
  }

  // Filter by age group
  if (props.selectedAgeGroup) {
    filtered = filtered.filter(result => result.ageGroup === props.selectedAgeGroup)
  }

  return filtered
})

// Get result rankings in order of priority
const getResultRankings = (result: any): PlaceRanking[] => {
  if (!result) return []

  const rankings: PlaceRanking[] = []

  // Absolute place - always show but no medals
  if (result && result.absolutePlace !== undefined) {
    let highlighted = false
    let color = 'text-gray-900'
    let badgeClass = 'bg-gray-100'

    if (result.absolutePlace <= 3) {
      highlighted = true
      color = 'text-yellow-600'
      badgeClass = 'bg-yellow-50 border border-yellow-200'
    }

    rankings.push({
      type: 'absolute',
      value: `${result.absolutePlace}`,
      suffix: '(абс)',
      suffixClass: 'text-xs text-gray-500',
      medal: '',
      medalColor: '',
      highlighted,
      color,
      priority: result.absolutePlace <= 3 ? 1 : 4,
      badgeClass,
      mobileLabel: `${result.absolutePlace} место (абс)`,
      alwaysShow: true,
    })
  }

  // Gender place - show medals for top 3
  if (result && result.genderAbsolutePlace !== undefined) {
    let medal = ''
    let medalColor = ''
    let highlighted = false
    let color = 'text-gray-600'
    let badgeClass = result.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'

    if (result.genderAbsolutePlace <= 3) {
      highlighted = true
      color = result.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
      badgeClass = result.gender === 'male' ? 'bg-blue-50 border border-blue-200' : 'bg-pink-50 border border-pink-200'

      if (result.genderAbsolutePlace === 1) {
        medal = '🥇'
        medalColor = result.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
      }
      else if (result.genderAbsolutePlace === 2) {
        medal = '🥈'
        medalColor = result.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
      }
      else if (result.genderAbsolutePlace === 3) {
        medal = '🥉'
        medalColor = result.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
      }
    }

    rankings.push({
      type: 'gender',
      value: `${result.genderAbsolutePlace} место`,
      suffix: result.gender === 'male' ? 'М' : 'Ж',
      suffixClass: `ml-1 px-1.5 py-0.5 rounded text-xs ${badgeClass}`,
      medal,
      medalColor,
      highlighted,
      color,
      priority: result.genderAbsolutePlace <= 3 ? 2 : 5,
      badgeClass,
      mobileLabel: `${result.genderAbsolutePlace} ${result.gender === 'male' ? 'М' : 'Ж'}`,
      alwaysShow: result.genderAbsolutePlace <= 3,
    })
  }

  // Age group place - show medals for top 3 if not in top 3 gender
  if (result && result.ageGroupPlace !== undefined && result.ageGroup) {
    let medal = ''
    let medalColor = ''
    let highlighted = false
    let color = 'text-gray-600'
    let badgeClass = 'bg-purple-100 text-purple-800'

    const isTopGender = result.genderAbsolutePlace !== undefined && result.genderAbsolutePlace <= 3

    if (result.ageGroupPlace <= 3 && !isTopGender) {
      highlighted = true
      color = 'text-purple-600'
      badgeClass = 'bg-purple-50 border border-purple-200'

      if (result.ageGroupPlace === 1) {
        medal = '🥇'
        medalColor = 'text-purple-500'
      }
      else if (result.ageGroupPlace === 2) {
        medal = '🥈'
        medalColor = 'text-purple-400'
      }
      else if (result.ageGroupPlace === 3) {
        medal = '🥉'
        medalColor = 'text-purple-600'
      }
    }

    rankings.push({
      type: 'ageGroup',
      value: `${result.ageGroupPlace} место в ${result.ageGroup}`,
      medal,
      medalColor,
      highlighted,
      color,
      priority: result.ageGroupPlace <= 3 && !isTopGender ? 3 : 6,
      badgeClass,
      mobileLabel: `${result.ageGroupPlace} место в ${result.ageGroup}`,
      alwaysShow: result.ageGroupPlace <= 3,
    })
  }

  // Sort by numeric place
  rankings.forEach((ranking) => {
    const placeMatch = ranking.value.match(/^(\d+)/)
    ranking.numericPlace = placeMatch ? parseInt(placeMatch[1]) : 999
  })

  return rankings.sort((a, b) => {
    if (a.numericPlace !== b.numericPlace) {
      return a.numericPlace - b.numericPlace
    }

    if (a.type === 'absolute' && b.type !== 'absolute') {
      return 1
    }
    if (a.type !== 'absolute' && b.type === 'absolute') {
      return -1
    }

    const typePriority = {
      ageGroup: 1,
      gender: 2,
      absolute: 3,
    }

    return typePriority[a.type] - typePriority[b.type]
  })
}

// Get the top ranking for a result (for mobile badge)
const getTopRanking = (result: any): PlaceRanking => {
  if (!result) return {
    type: 'absolute',
    value: '',
    priority: 10,
    badgeClass: 'bg-gray-100',
    mobileLabel: '',
    medal: '',
    medalColor: '',
    highlighted: false,
    color: '',
    alwaysShow: false,
    numericPlace: 999,
  }

  const places = []

  // Age group place
  if (result.ageGroupPlace !== undefined && result.ageGroup) {
    let medal = ''
    let medalColor = ''
    let badgeClass = 'bg-purple-100 text-purple-800'
    let highlighted = false

    const isTopGender = result.genderAbsolutePlace !== undefined && result.genderAbsolutePlace <= 3

    if (result.ageGroupPlace <= 3 && !isTopGender) {
      highlighted = true
      badgeClass = 'bg-purple-50 border border-purple-200'

      if (result.ageGroupPlace === 1) {
        medal = '🥇'
        medalColor = 'text-purple-500'
      }
      else if (result.ageGroupPlace === 2) {
        medal = '🥈'
        medalColor = 'text-purple-400'
      }
      else if (result.ageGroupPlace === 3) {
        medal = '🥉'
        medalColor = 'text-purple-600'
      }
    }

    places.push({
      type: 'ageGroup',
      value: `${result.ageGroupPlace}`,
      numericPlace: result.ageGroupPlace,
      priority: 2,
      badgeClass,
      mobileLabel: `${result.ageGroupPlace} в ${result.ageGroup}`,
      medal,
      medalColor,
      highlighted,
      color: highlighted ? 'text-purple-600' : 'text-gray-600',
      alwaysShow: result.ageGroupPlace <= 3,
    })
  }

  // Gender place
  if (result.genderAbsolutePlace !== undefined) {
    let medal = ''
    let medalColor = ''
    let highlighted = false
    let badgeClass = result.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'

    if (result.genderAbsolutePlace <= 3) {
      highlighted = true
      badgeClass = result.gender === 'male' ? 'bg-blue-50 border border-blue-200' : 'bg-pink-50 border border-pink-200'

      if (result.genderAbsolutePlace === 1) {
        medal = '🥇'
        medalColor = result.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
      }
      else if (result.genderAbsolutePlace === 2) {
        medal = '🥈'
        medalColor = result.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
      }
      else if (result.genderAbsolutePlace === 3) {
        medal = '🥉'
        medalColor = result.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
      }
    }

    places.push({
      type: 'gender',
      value: `${result.genderAbsolutePlace}`,
      numericPlace: result.genderAbsolutePlace,
      priority: 1,
      badgeClass,
      mobileLabel: `${result.genderAbsolutePlace} ${result.gender === 'male' ? 'М' : 'Ж'}`,
      medal,
      medalColor,
      highlighted,
      color: highlighted ? (result.gender === 'male' ? 'text-blue-600' : 'text-pink-600') : 'text-gray-600',
      alwaysShow: result.genderAbsolutePlace <= 3,
    })
  }

  // Absolute place
  if (result.absolutePlace !== undefined) {
    places.push({
      type: 'absolute',
      value: `${result.absolutePlace}`,
      numericPlace: result.absolutePlace,
      priority: 3,
      badgeClass: result.absolutePlace <= 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-100',
      mobileLabel: `${result.absolutePlace} (абс)`,
      medal: '',
      medalColor: '',
      highlighted: result.absolutePlace <= 3,
      color: result.absolutePlace <= 3 ? 'text-yellow-600' : 'text-gray-900',
      alwaysShow: true,
    })
  }

  places.sort((a, b) => {
    if (a.numericPlace !== b.numericPlace) {
      return a.numericPlace - b.numericPlace
    }

    if (a.type === 'absolute' && b.type !== 'absolute') {
      return 1
    }
    if (a.type !== 'absolute' && b.type === 'absolute') {
      return -1
    }

    const typePriority = {
      ageGroup: 1,
      gender: 2,
      absolute: 3,
    }

    return typePriority[a.type] - typePriority[b.type]
  })

  if (places.length > 0) {
    return places[0]
  }

  return {
    type: 'absolute',
    value: '',
    numericPlace: 999,
    priority: 10,
    badgeClass: 'bg-gray-100',
    mobileLabel: '',
    medal: '',
    medalColor: '',
    highlighted: false,
    color: '',
    alwaysShow: false,
  }
}

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
    transition1: 'T1',
    transition2: 'T2',
    ski: 'Лыжи',
    stage1: 'Этап 1',
    stage2: 'Этап 2',
    stage3: 'Этап 3',
  }
  return translations[type] || type
}

const getStageTime = (result: any, stageType: string): string => {
  if (!result || !result.stages) return '—'
  const stage = result.stages.find((s: any) => s.type === stageType)
  return stage ? stage.time : '—'
}
</script>
