<template>
  <div class="space-y-4">

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
    <div class="md:hidden space-y-3">
      <LicenseCard
        v-for="license in licenses"
        :key="license.id"
        :license="license"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
interface Props {
  licenses: any[]
}

defineProps<Props>()
</script>