<template>
  <NuxtLink
    :to="`/${year}/competitions/${competition.slug}`"
    class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 active:scale-[0.98] block h-full min-h-[200px]"
  >

    <!-- Mobile-optimized card layout with consistent height -->
    <div class="p-4 h-full flex flex-col min-h-[200px]">
      <!-- Header: Title and Status -->
      <div class="flex items-start justify-between mb-3">
        <h4 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight flex-1 pr-2">
          {{ competition.title }}
        </h4>
        <div class="flex-shrink-0">
          <span
            v-if="competition.hasResults"
            class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
          >
            ✓ Завершено
          </span>
          <span
            v-else-if="isUpcoming(competition.startDate)"
            class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
          >
            ⏰ Скоро
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600"
          >
            📅 Ожидается
          </span>
        </div>
      </div>

      <!-- Key Info Row -->
      <div class="flex items-center justify-between mb-3 text-sm">
        <div class="flex items-center text-gray-600">
          <UIcon
            name="i-heroicons-calendar-days"
            class="mr-1.5 text-gray-400 flex-shrink-0"
            size="16"
          />
          <span class="truncate">{{ formatDateRange(competition.startDate, competition.endDate) }}</span>
        </div>
        <div class="flex items-center text-gray-600 ml-2">
          <UIcon
            name="i-heroicons-users"
            class="mr-1 text-gray-400 flex-shrink-0"
            size="16"
          />
          <span class="font-medium">{{ competition.statistics.all }}</span>
        </div>
      </div>

      <!-- Category and Points Row -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex-1">
          <span
            v-if="!hasMultipleEvents(competition)"
            :class="getCategoryBadgeClass(competition.category)"
            class="text-sm"
          >
            {{ translateCategory(competition.category) }}
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700"
          >
            <UIcon
              name="i-heroicons-list-bullet"
              class="mr-1"
              size="14"
            />
            {{ competition.events.length }} дисциплин
          </span>
        </div>

        <div
          v-if="!hasMultipleEvents(competition) && competition.points"
          class="flex items-center text-amber-600 ml-2"
        >
          <UIcon
            name="i-heroicons-star"
            class="mr-1 text-amber-500 flex-shrink-0"
            size="16"
          />
          <span class="font-semibold">{{ competition.points }}</span>
        </div>
      </div>

      <!-- Content area that grows to fill space -->
      <div class="flex-1 flex flex-col">
        <!-- Multi-event preview (fixed height) -->
        <div
          v-if="hasMultipleEvents(competition)"
          class="border-t border-gray-100 pt-3 mb-3 flex-1"
        >
          <div class="space-y-2 h-16 overflow-y-auto">
            <div
              v-for="event in competition.events.slice(0, 2)"
              :key="event.slug"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center flex-1 min-w-0">
                <span
                  :class="event.hasResults ? 'w-2 h-2 bg-green-500' : 'w-2 h-2 bg-gray-300'"
                  class="rounded-full flex-shrink-0 mr-2"
                />
                <span class="font-medium text-gray-700 truncate">{{ event.title }}</span>
              </div>
              <div class="flex items-center space-x-2 text-gray-500 ml-2">
                <span
                  v-if="event.points"
                  class="flex items-center"
                >
                  <UIcon
                    name="i-heroicons-star"
                    class="mr-0.5 text-amber-400"
                    size="14"
                  />
                  {{ event.points }}
                </span>
                <span class="flex items-center">
                  <UIcon
                    name="i-heroicons-user"
                    class="mr-0.5"
                    size="14"
                  />
                  {{ event.participantCount || 0 }}
                </span>
              </div>
            </div>
            <div
              v-if="competition.events.length > 2"
              class="text-sm text-gray-500 text-center pt-1"
            >
              +{{ competition.events.length - 2 }} ещё
            </div>
          </div>
        </div>

        <!-- Spacer for single events to maintain consistent height -->
        <div
          v-else
          class="flex-1 min-h-[4rem]"
        />
      </div>

      <!-- Action indicator (always at bottom) -->
      <div class="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <span class="text-sm text-gray-500">
          {{ competition.hasResults ? 'Результаты доступны' : 'Нажмите для просмотра' }}
        </span>
        <UIcon
          name="i-heroicons-chevron-right"
          class="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200"
          size="18"
        />
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
  isUpcoming,
} from '../lib/competition-utils'

interface Props {
  competition: any
  year: string | number
}

defineProps<Props>()
</script>
