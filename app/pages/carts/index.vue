<script setup lang="ts">
import type {CartResponse} from '~/types/cart'
definePageMeta({middleware:'auth'})

const {userId}=useAuth()

const {data,status,error}=await useFetch<CartResponse>(`https://dummyjson.com/carts/user/${userId.value}`,{
  immediate:!!userId.value
})

const cart=computed(() => {
  if(data.value && data.value.carts.length > 0){
    return data.value.carts[0]
  }
  return null
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-line py-10 sm:py-14">
      <h1 class="text-5xl leading-[0.9] sm:text-7xl">Корзина</h1>

      <p v-if="status === 'pending'" class="text-xs tracking-wide text-dim uppercase">Загрузка...</p>
      <p v-if="cart" class="text-xs tracking-wide text-dim uppercase tabular-nums">
        <span class="text-acid">{{ cart.totalQuantity }}</span> шт. в {{ cart.totalProducts }} позициях
      </p>
    </header>

    <div v-if="!userId" class="border-b border-line py-16">
      <p class="text-xl font-medium">Корзина привязана к аккаунту</p>
      <p class="mt-2 text-dim">Войдите, чтобы увидеть свои товары.</p>
      <NuxtLink
        to="/login"
        class="mt-6 inline-flex min-h-11 items-center bg-acid px-6 font-display text-lg font-bold text-ink uppercase transition-opacity active:opacity-80"
      >
        Войти
      </NuxtLink>
    </div>

    <p v-else-if="status === 'error'" class="border-b border-line py-16 text-red-400">
      Не удалось загрузить корзину: {{ error?.statusMessage || error?.message }}
    </p>

    <div v-else-if="cart" class="grid lg:grid-cols-[1fr_22rem]">
      <ul class="border-line lg:border-r">
        <li
          v-for="product in cart.products"
          :key="product.id"
          class="flex gap-4 border-b border-line p-4 sm:gap-6 sm:p-6"
        >
          <NuxtLink :to="`/products/${product.id}`" class="size-24 shrink-0 bg-panel p-2 sm:size-28">
            <img
              :src="product.thumbnail"
              :alt="product.title"
              width="112"
              height="112"
              loading="lazy"
              class="h-full w-full object-contain"
            >
          </NuxtLink>

          <div class="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div class="flex items-start justify-between gap-3">
              <NuxtLink
                :to="`/products/${product.id}`"
                class="line-clamp-2 leading-snug font-medium transition-colors hover:text-acid"
              >
                {{ product.title }}
              </NuxtLink>
              <p
                v-if="product.discountPercentage >= 1"
                class="shrink-0 bg-acid px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink tabular-nums"
              >
                -{{ Math.round(product.discountPercentage) }}%
              </p>
            </div>

            <div class="flex items-end justify-between gap-3 tabular-nums">
              <p class="text-sm text-dim">${{ product.price }} × {{ product.quantity }}</p>
              <div class="text-right">
                <p v-if="product.discountPercentage >= 1" class="text-xs text-dim line-through">
                  ${{ product.total.toFixed(2) }}
                </p>
                <p class="text-lg font-medium">${{ product.discountedTotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <aside class="p-6 lg:sticky lg:top-14 lg:self-start">
        <h2 class="text-2xl">Итого</h2>

        <dl class="mt-6 grid gap-3 tabular-nums">
          <div class="flex justify-between gap-4">
            <dt class="text-dim">Товары</dt>
            <dd>${{ cart.total.toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-dim">Скидка</dt>
            <dd class="text-acid">-${{ (cart.total - cart.discountedTotal).toFixed(2) }}</dd>
          </div>
          <div class="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <dt class="font-medium">К оплате</dt>
            <dd class="text-3xl font-medium">${{ cart.discountedTotal.toFixed(2) }}</dd>
          </div>
        </dl>
      </aside>
    </div>

    <p v-else-if="status === 'success'" class="border-b border-line py-16 text-dim">В корзине пока пусто.</p>
  </main>
</template>
