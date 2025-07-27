<template>
  <UApp>
    <div class="min-h-screen bg-gray-50">
      <UContainer class="py-4">
        <!-- Main site header (all pages) -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted mb-6">
            ЛЛТ
          </h1>
          <!-- Visual separator -->
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
        </div>

        <!-- Page content -->
        <NuxtPage />

        <!-- Footer -->
        <div class="text-center pt-8 pb-4 border-t border-gray-200 mt-16">
          <p class="text-sm text-gray-500">
            Неофициальный сайт Любительской Лиги Триатлона Беларуси
          </p>
        </div>
      </UContainer>
    </div>
  </UApp>
</template>
