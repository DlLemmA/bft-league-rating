<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">
            Всего спортсменов
          </p>
          <h3 class="text-2xl font-bold">
            {{ statistics.total }}
          </h3>
        </div>
        <UIcon name="i-heroicons-users" class="text-blue-600" size="lg" />
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">
            Мужчин
          </p>
          <h3 class="text-2xl font-bold">
            {{ statistics.men }}
          </h3>
        </div>
        <UIcon name="i-heroicons-user" class="text-green-600" size="lg" />
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">
            Женщин
          </p>
          <h3 class="text-2xl font-bold">
            {{ statistics.women }}
          </h3>
        </div>
        <UIcon name="i-heroicons-user" class="text-pink-600" size="lg" />
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">
            Соревнований
          </p>
          <h3 class="text-2xl font-bold">
            {{ statistics.competitions }}
          </h3>
        </div>
        <UIcon name="i-heroicons-flag" class="text-orange-600" size="lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RatingStatistics } from '~/types'

interface Props {
  statistics: RatingStatistics
}

defineProps<Props>()
</script>
