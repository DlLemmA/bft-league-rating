<template>
  <NuxtLink :to="`/${year}/competitions/${competition.slug}`"
    class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100 hover:border-blue-200">
    
    <!-- Card Header with Status Indicator -->
    <div class="relative p-6 flex-grow">
      <!-- Status Badge -->
      <div class="absolute top-4 right-4">
        <span v-if="competition.hasResults"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
          Завершено
        </span>
        <span v-else-if="isUpcoming(competition.startDate)"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1" />
          Скоро
        </span>
        <span v-else
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1" />
          Ожидается
        </span>
      </div>

      <!-- Competition Title -->
      <h4 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 pr-20 mb-3">
        {{ competition.title }}
      </h4>

      <!-- Competition Info -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <UIcon name="i-heroicons-calendar-days" class="mr-2 text-gray-400" />
          {{ formatDateRange(competition.startDate, competition.endDate) }}
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-600">
            <UIcon name="i-heroicons-users" class="mr-2 text-gray-400" />
            {{ competition.statistics.all }} участников
          </div>
          <div v-if="!hasMultipleEvents(competition)" class="flex items-center text-sm text-amber-600">
            <UIcon name="i-heroicons-star" class="mr-1 text-amber-500" />
            {{ competition.points }} очков
          </div>
        </div>
      </div>

      <!-- Category Badge for Single Events -->
      <div v-if="!hasMultipleEvents(competition)" class="mb-4">
        <span :class="getCategoryBadgeClass(competition.category)">
          {{ translateCategory(competition.category) }}
        </span>
      </div>
    </div>

    <!-- Multi-event competitions -->
    <div v-if="hasMultipleEvents(competition)" class="px-6 pb-4 border-t border-gray-50 bg-gray-50/50">
      <div class="text-sm font-semibold text-gray-700 mb-3 mt-4 flex items-center">
        <UIcon name="i-heroicons-list-bullet" class="mr-2 text-gray-500" />
        Дисциплины ({{ competition.events.length }})
      </div>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div v-for="event in competition.events" :key="event.slug"
          class="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-gray-100">
          <div class="flex items-center space-x-2">
            <span v-if="event.hasResults" class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            <span v-else class="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
            <span class="font-medium text-gray-800">{{ event.title }}</span>
            <span v-if="event.category" :class="getCategoryBadgeClass(event.category)">
              {{ translateCategory(event.category) }}
            </span>
          </div>
          <div class="flex items-center space-x-3 text-xs text-gray-500">
            <span v-if="event.points" class="flex items-center">
              <UIcon name="i-heroicons-star" class="mr-1 text-amber-400" />
              {{ event.points }}
            </span>
            <span class="flex items-center">
              <UIcon name="i-heroicons-user" class="mr-1" />
              {{ event.participantCount || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Footer with Action -->
    <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">
          {{ competition.hasResults ? 'Результаты доступны' : 'Нажмите для просмотра' }}
        </div>
        <div class="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
          <span class="text-sm font-medium mr-2">
            {{ competition.hasResults ? 'Смотреть результаты' : 'Подробнее' }}
          </span>
          <UIcon name="i-heroicons-arrow-right"
            class="group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { 
  hasMultipleEvents, 
  getCategoryBadgeClass, 
  translateCategory,
  formatDateRange,
  isUpcoming 
} from '../lib/competition-utils'

interface Props {
  competition: any
  year: string | number
}

defineProps<Props>()
</script>