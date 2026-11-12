<script setup lang="ts">
import type {ProductResponse} from '~/types/product'
definePageMeta({middleware:'auth'})

 const { data,status,error,refresh ,clear } = await useFetch<ProductResponse>('https://dummyjson.com/products', {
    method: 'GET',
  })

</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-line py-10 sm:py-14">
      <h1 class="text-5xl leading-[0.9] font-bold tracking-[-0.05em] uppercase sm:text-7xl">
        Каталог
      </h1>

      <p v-if="status === 'pending'" class="text-xs tracking-wide text-dim uppercase">Загрузка...</p>
      <p v-if="status === 'error'" class="text-xs text-red-400">
        Ошибка: {{ error?.message || 'Неизвестная ошибка' }}
      </p>
      <p v-if="data" class="text-xs tracking-wide text-dim uppercase tabular-nums">
        <span class="text-acid">{{ data.products.length }}</span> из {{ data.total }} товаров
      </p>
    </header>

    <ul v-if="data" class="grid grid-cols-2 border-l border-line sm:grid-cols-3 lg:grid-cols-4">
      <li v-for="product in data.products" :key="product.id" class="border-r border-b border-line">
        <NuxtLink :to="`/products/${product.id}`" class="group flex h-full flex-col transition-colors duration-200 hover:bg-panel">
          <div class="relative aspect-square overflow-hidden">
            <img
              :src="product.thumbnail"
              :alt="product.title"
              width="300"
              height="300"
              loading="lazy"
              class="h-full w-full object-contain p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 sm:p-8"
            >
            <span class="absolute top-3 left-3 text-[0.6875rem] text-dim tabular-nums">
              #{{ String(product.id).padStart(3, '0') }}
            </span>
            <span
              v-if="product.discountPercentage >= 1"
              class="absolute top-3 right-3 bg-acid px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink tabular-nums"
            >
              -{{ Math.round(product.discountPercentage) }}%
            </span>
          </div>

          <div class="mt-auto border-t border-line p-3 sm:p-4">
            <p class="text-[0.6875rem] tracking-wide text-dim uppercase">{{ product.category }}</p>
            <h2 class="mt-1.5 line-clamp-2 min-h-[2.5rem] leading-tight font-medium">{{ product.title }}</h2>

            <div class="mt-3 flex items-baseline justify-between gap-2 tabular-nums">
              <p class="text-lg font-medium text-bone group-hover:text-acid">${{ product.price }}</p>
              <p class="text-xs text-dim">★ {{ product.rating.toFixed(1) }}</p>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>

</style>
