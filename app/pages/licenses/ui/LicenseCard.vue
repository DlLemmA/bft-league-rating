<template>
  <div class="p-4 hover:bg-gray-50">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-3 flex-1">
        <UAvatar
          :alt="license.fioRussian"
          size="sm"
        />
        <div>
          <div class="font-medium text-gray-900">
            {{ license.fioRussian }}
          </div>
          <div class="text-sm text-gray-500">
            {{ license.fioEnglish }}
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span
          :class="[
            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
            license.gender === 'Мужской'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-pink-100 text-pink-800',
          ]"
        >
          {{ license.gender === 'Мужской' ? 'М' : 'Ж' }}
        </span>
        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded flex items-center">
          <UIcon
            name="i-heroicons-identification"
            class="mr-1"
            size="xs"
          />
          {{ license.id }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div class="text-gray-500 flex items-center">
          <UIcon
            name="i-heroicons-tag"
            class="mr-1"
            size="sm"
          />
          Категория
        </div>
        <div class="font-medium">
          {{ license.ageGroup }}
        </div>
      </div>
      <div>
        <div class="text-gray-500 flex items-center">
          <UIcon
            name="i-heroicons-building-office"
            class="mr-1"
            size="sm"
          />
          Клуб
        </div>
        <div class="font-medium">
          {{ license.club || '—' }}
        </div>
      </div>
      <div>
        <div class="text-gray-500 flex items-center">
          <UIcon
            name="i-heroicons-calendar"
            class="mr-1"
            size="sm"
          />
          Дата рождения
        </div>
        <div class="font-medium">
          {{ license.birthDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  license: any
}

defineProps<Props>()
</script>