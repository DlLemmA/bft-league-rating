<template>
  <div class="space-y-4">
    <!-- Desktop Rating Table -->
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon name="i-heroicons-star" class="mr-1" />
                Очки
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(athlete, index) in athletes" :key="athlete.id" class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('show-details', athlete)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col space-y-1">
                <!-- Show places in order of priority -->
                <div v-for="(ranking, rankingIndex) in getAthleteRankings(athlete)" :key="rankingIndex" :class="[
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
                <UAvatar :src="athlete.avatarSrc" :alt="athlete.fioRussian" size="sm" />
                <div class="space-y-1">
                  <div class="text-sm font-medium text-gray-900 flex items-center">
                    {{ athlete.fioRussian }}
                    <span
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
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
              <div v-if="athlete.ageGroup" class="text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {{ athlete.ageGroup }}
                </span>
              </div>
              <div v-else class="text-sm text-gray-500">
                —
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

    <!-- Mobile Rating Cards -->
    <div class="md:hidden space-y-4">
      <div v-for="(athlete, index) in athletes" :key="athlete.id"
        class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 cursor-pointer"
        @click="$emit('show-details', athlete)">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center">
            <!-- Badge with highest achievement -->
            <div :class="[
              'rounded-full h-8 w-8 flex items-center justify-center mr-2',
              getTopRanking(athlete) && getTopRanking(athlete).badgeClass ? getTopRanking(athlete).badgeClass : 'bg-gray-100',
            ]">
              <span v-if="getTopRanking(athlete) && getTopRanking(athlete).medal"
                :class="getTopRanking(athlete) && getTopRanking(athlete).medalColor ? getTopRanking(athlete).medalColor : ''"
                class="font-bold">
                {{ getTopRanking(athlete).medal }}
              </span>
              <span v-else class="text-sm font-medium">{{ athlete && athlete.absolutePlace ? athlete.absolutePlace : ''
                }}</span>
            </div>
            <div>
              <div class="flex items-center space-x-3">
                <UAvatar :src="athlete.avatarSrc" :alt="athlete.fioRussian" size="sm" />
                <div>
                  <div class="font-medium">
                    {{ athlete.fioRussian }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ athlete.fioEnglish }}
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-500 flex flex-wrap items-center gap-1 mt-1">
                <span v-if="athlete.club">{{ athlete.club }}</span>
                <span v-if="athlete.club && athlete.ageGroup" class="mx-1">•</span>
                <span v-if="athlete.ageGroup"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {{ athlete.ageGroup }}
                </span>

                <!-- Show positions with priority -->
                <span v-for="(ranking, rankingIndex) in getAthleteRankings(athlete)" :key="rankingIndex" :class="[
                  'ml-1 px-1.5 py-0.5 rounded text-xs',
                  ranking && ranking.badgeClass ? ranking.badgeClass : '',
                ]">
                  {{ ranking ? ranking.mobileLabel : '' }}
                  <span v-if="ranking && ranking.medal">{{ ranking.medal }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium text-blue-600">
              {{ formatPoints(athlete.totalPoints) }} очков
            </div>
          </div>
        </div>
        <div class="mt-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <UIcon name="i-heroicons-identification" class="mr-1" size="xs" />
            {{ athlete.id }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { License } from '~/types'

interface Props {
  athletes: License[]
}

const props = defineProps<Props>()

// Emit event when clicking on points to show details
defineEmits(['show-details'])

// Helper method to format points
const formatPoints = (points: number | undefined): string => {
  if (points === undefined) return '0'
  // Format to 2 decimal places if there are decimals, otherwise show as integer
  return Number.isInteger(points) ? points.toString() : points.toFixed(2)
}

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
  numericPlace?: number // Actual numeric place for sorting
}

type RankingType = 'absolute' | 'gender' | 'ageGroup'

const MEDALS = ['🥇', '🥈', '🥉']
const GENDER_BADGES = {
  Мужской: { base: 'bg-blue-100 text-blue-800', top: 'bg-blue-50 border border-blue-200', colors: ['text-blue-500', 'text-blue-400', 'text-blue-600'], text: 'М' },
  Женский: { base: 'bg-pink-100 text-pink-800', top: 'bg-pink-50 border border-pink-200', colors: ['text-pink-500', 'text-pink-400', 'text-pink-600'], text: 'Ж' },
}
const AGE_GROUP_COLORS = ['text-purple-500', 'text-purple-400', 'text-purple-600']

const createRanking = (
  type: RankingType,
  place: number,
  gender: string,
  ageGroup?: string,
  skipMedals = false,
): PlaceRanking => {
  const isTop3 = place <= 3
  let highlighted = isTop3
  let color = 'text-gray-600'
  let badgeClass = ''
  let suffix = ''
  let suffixClass = ''
  let medal = ''
  let medalColor = ''
  let value = ''
  let mobileLabel = ''
  let alwaysShow = false

  switch (type) {
    case 'absolute':
      color = isTop3 ? 'text-yellow-600' : 'text-gray-900'
      badgeClass = isTop3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-100'
      suffix = '(абс)'
      suffixClass = 'text-xs text-gray-500'
      value = `${place}`
      mobileLabel = `${place} место (абс)`
      alwaysShow = true
      highlighted = isTop3
      break

    case 'gender':
      const genderBadge = GENDER_BADGES[gender]
      color = isTop3 ? (genderBadge.colors[place - 1] || genderBadge.base) : 'text-gray-600'
      badgeClass = isTop3 ? genderBadge.top : genderBadge.base
      suffix = genderBadge.text
      suffixClass = `ml-1 px-1.5 py-0.5 rounded text-xs ${badgeClass}`
      value = `${place} место`
      mobileLabel = `${place} ${suffix}`
      if (!skipMedals && isTop3) {
        medal = MEDALS[place - 1]
        medalColor = genderBadge.colors[place - 1]
      }
      alwaysShow = isTop3
      break

    case 'ageGroup':
      color = isTop3 ? 'text-purple-600' : 'text-gray-600'
      badgeClass = isTop3 ? 'bg-purple-50 border border-purple-200' : 'bg-purple-100 text-purple-800'
      value = `${place} место в ${ageGroup}`
      mobileLabel = value
      alwaysShow = isTop3
      if (!skipMedals && isTop3) {
        medal = MEDALS[place - 1]
        medalColor = AGE_GROUP_COLORS[place - 1]
      }
      else {
        highlighted = false
      }
      break
  }

  return {
    type,
    value,
    suffix,
    suffixClass,
    medal,
    medalColor,
    highlighted,
    color,
    priority: getPriority(type, place, gender, skipMedals),
    badgeClass,
    mobileLabel,
    alwaysShow,
    numericPlace: place,
  }
}

const getPriority = (type: RankingType, place: number, gender: string, skipMedals: boolean): number => {
  if (!place || place > 3) return 6
  const typePriority: Record<RankingType, number> = { ageGroup: 3, gender: 2, absolute: 1 }
  return skipMedals && type === 'ageGroup' ? 6 : typePriority[type]
}

const getAthleteRankings = (athlete: License): PlaceRanking[] => {
  if (!athlete) return []

  const rankings: PlaceRanking[] = []

  // Add Absolute
  if (athlete.absolutePlace !== undefined) {
    rankings.push(createRanking('absolute', athlete.absolutePlace, athlete.gender))
  }

  // Add Gender
  const hasTopGender = athlete.genderPlace !== undefined && athlete.genderPlace <= 3
  if (athlete.genderPlace !== undefined) {
    rankings.push(createRanking('gender', athlete.genderPlace, athlete.gender))
  }

  // Add Age Group
  if (athlete.ageGroupPlace !== undefined && athlete.ageGroup) {
    rankings.push(createRanking('ageGroup', athlete.ageGroupPlace, athlete.gender, athlete.ageGroup, hasTopGender))
  }

  // Sort by place, then by type
  return rankings.sort((a, b) => {
    if (a.numericPlace !== b.numericPlace) return a.numericPlace - b.numericPlace
    const typeOrder = { ageGroup: 1, gender: 2, absolute: 3 }
    return typeOrder[a.type] - typeOrder[b.type]
  })
}

const getTopRanking = (athlete: License): PlaceRanking => {
  const rankings = getAthleteRankings(athlete)
  return rankings[0] || {
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
</script>
