<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-blue-50 rounded-lg p-6">
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-users" class="text-blue-600 mr-2" size="lg" />
        <div class="text-gray-600">
          Всего участников
        </div>
      </div>
      <div class="text-3xl font-bold text-blue-600">
        {{ statistics.total }}
      </div>
    </div>

    <div class="bg-green-50 rounded-lg p-6">
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-user" class="text-green-600 mr-2" size="lg" />
        <div class="text-gray-600">
          Мужчин
        </div>
      </div>
      <div class="text-3xl font-bold text-green-600">
        {{ statistics.men }}
      </div>
    </div>

    <div class="bg-pink-50 rounded-lg p-6">
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-user" class="text-pink-600 mr-2" size="lg" />
        <div class="text-gray-600">
          Женщин
        </div>
      </div>
      <div class="text-3xl font-bold text-pink-600">
        {{ statistics.women }}
      </div>
    </div>

    <div class="bg-purple-50 rounded-lg p-6">
      <div class="flex items-center mb-2">
        <UIcon name="i-heroicons-identification" class="text-purple-600 mr-2" size="lg" />
        <div class="text-gray-600">
          С лицензией
        </div>
      </div>
      <div class="text-3xl font-bold text-purple-600">
        {{ statistics.licensed }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Statistics {
  total: number
  men: number
  women: number
  licensed: number
  unlicensed: number
}

interface Props {
  statistics: Statistics
}

defineProps<Props>()
</script>
