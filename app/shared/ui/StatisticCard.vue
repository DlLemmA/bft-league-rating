<template>
  <div class="bg-white rounded-lg border border-gray-200 p-3 flex items-center">
    <div class="flex-shrink-0 mr-3">
      <UIcon
        :name="icon"
        :class="iconColor"
        size="lg"
      />
    </div>
    <div class="flex-1">
      <div
        :class="valueColor"
        class="text-xl font-bold"
      >
        {{ value }}
      </div>
      <div class="text-xs text-gray-600">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string | number
  label: string
  icon: string
  iconColor?: string
  valueColor?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'text-blue-600',
  valueColor: 'text-gray-900',
})
</script>
