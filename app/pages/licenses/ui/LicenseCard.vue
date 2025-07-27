<template>
  <div class="rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors bg-white">
    <!-- Card Header -->
    <div class="p-4 pb-3">
      <div class="flex items-start justify-between mb-3">
        <!-- License Info -->
        <div class="flex items-center flex-1 min-w-0">
          <!-- Avatar -->
          <div class="flex-shrink-0 mr-3">
            <UAvatar
              :src="license.avatarSrc"
              :alt="license.fioRussian"
              size="sm"
            />
          </div>

          <!-- Name and Details -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">
              {{ license.fioRussian }}
            </h3>
            <div class="flex items-center text-sm text-gray-600 mt-1">
              <UIcon
                name="i-heroicons-identification"
                class="mr-1"
                size="14"
              />
              <span class="mr-3">№{{ license.id }}</span>
              <UIcon
                name="i-heroicons-user"
                class="mr-1"
                size="14"
              />
              <span>{{ license.gender === 'Мужской' ? 'Мужчина' : 'Женщина' }}</span>
            </div>
          </div>
        </div>

        <!-- Birth Date -->
        <div class="flex-shrink-0 text-right">
          <div class="text-sm font-medium text-gray-900">
            {{ license.birthDate }}
          </div>
          <div class="text-xs text-gray-500">
            дата рождения
          </div>
        </div>
      </div>

      <!-- Additional Info Row -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <div
            v-if="license.club"
            class="flex items-center text-gray-600"
          >
            <UIcon
              name="i-heroicons-building-office"
              class="mr-1"
              size="14"
            />
            <span class="truncate">{{ license.club }}</span>
          </div>
          <div
            v-if="license.ageGroup"
            class="flex items-center"
          >
            <span class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700">
              {{ license.ageGroup }}
            </span>
          </div>
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
