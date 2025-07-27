<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold flex items-center">
          <UIcon
            name="i-heroicons-list-bullet"
            class="mr-2 text-blue-600"
          />
          Список лицензий
        </h3>
        <span class="text-sm text-gray-500">
          Найдено: {{ filteredCount }}
        </span>
      </div>
    </div>

    <!-- Desktop Table -->
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
                Номер
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-user"
                  class="mr-1"
                />
                ФИО
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-user-circle"
                  class="mr-1"
                />
                Пол
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center">
                <UIcon
                  name="i-heroicons-tag"
                  class="mr-1"
                />
                Категория
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
                  name="i-heroicons-calendar"
                  class="mr-1"
                />
                Дата рождения
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="license in licenses"
            :key="license.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ license.id }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="license.avatarSrc"
                  :alt="license.fioRussian"
                  size="sm"
                />
                <div class="space-y-1">
                  <div class="text-sm font-medium text-gray-900">
                    {{ license.fioRussian }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ license.fioEnglish }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
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
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ license.ageGroup }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ license.club || '—' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 flex items-center">
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="mr-1 text-gray-400"
                />
                {{ license.birthDate }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden">
      <div class="divide-y divide-gray-200">
        <LicenseCard
          v-for="license in licenses"
          :key="license.id"
          :license="license"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          <UIcon
            name="i-heroicons-arrow-left"
            class="mr-1"
          />
          Назад
        </button>
        <button
          :disabled="currentPage >= totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          Вперед
          <UIcon
            name="i-heroicons-arrow-right"
            class="ml-1"
          />
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 flex items-center">
            <UIcon
              name="i-heroicons-document-text"
              class="mr-1"
            />
            Показано <span class="font-medium mx-1">{{ startIndex + 1 }}</span> -
            <span class="font-medium mx-1">{{ Math.min(endIndex, filteredCount) }}</span> из
            <span class="font-medium ml-1">{{ filteredCount }}</span> результатов
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              @click="$emit('update:currentPage', currentPage - 1)"
            >
              <UIcon name="i-heroicons-chevron-left" />
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
              @click="$emit('update:currentPage', page)"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              @click="$emit('update:currentPage', currentPage + 1)"
            >
              <UIcon name="i-heroicons-chevron-right" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  licenses: any[]
  filteredCount: number
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  visiblePages: number[]
}

defineProps<Props>()
defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>