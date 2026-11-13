<script setup lang="ts">
import {X} from 'lucide-vue-next'
definePageMeta({middleware:'auth'})

const {items,loading,cartError,totalQuantity,total,discountedTotal,loadCart,removeFromCart}=useCart()
const removing=ref<number|null>(null)

await loadCart()

async function remove(id:number){
  removing.value=id
  await removeFromCart(id)
  removing.value=null
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-line py-10 sm:py-14">
      <h1 class="text-5xl leading-[0.9] sm:text-7xl">Корзина</h1>

      <p v-if="loading" class="text-xs tracking-wide text-dim uppercase">Загрузка...</p>
      <p v-else-if="items.length > 0" class="text-xs tracking-wide text-dim uppercase tabular-nums">
        <span class="text-acid">{{ totalQuantity }}</span> шт. в {{ items.length }} позициях
      </p>
    </header>

    <p v-if="cartError" class="border-b border-line py-6 text-red-400">{{ cartError }}</p>

    <div v-if="items.length > 0" class="grid lg:grid-cols-[1fr_22rem]">
      <ul class="border-line lg:border-r">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex gap-4 border-b border-line p-4 transition-opacity sm:gap-6 sm:p-6"
          :class="{'opacity-50':removing === item.id}"
        >
          <NuxtLink :to="`/products/${item.id}`" class="size-24 shrink-0 bg-panel p-2 sm:size-28">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              width="112"
              height="112"
              loading="lazy"
              class="h-full w-full object-contain"
            >
          </NuxtLink>

          <div class="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div class="flex items-start justify-between gap-3">
              <NuxtLink
                :to="`/products/${item.id}`"
                class="line-clamp-2 leading-snug font-medium transition-colors hover:text-acid"
              >
                {{ item.title }}
              </NuxtLink>

              <div class="flex shrink-0 items-start gap-2">
                <p
                  v-if="item.discountPercentage >= 1"
                  class="bg-acid px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink tabular-nums"
                >
                  -{{ Math.round(item.discountPercentage) }}%
                </p>
                <button
                  type="button"
                  :disabled="removing === item.id"
                  aria-label="Убрать из корзины"
                  class="grid size-8 place-items-center border border-line text-dim transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                  @click="remove(item.id)"
                >
                  <X :size="16" :stroke-width="1.75" />
                </button>
              </div>
            </div>

            <div class="flex items-end justify-between gap-3 tabular-nums">
              <p class="text-sm text-dim">${{ item.price }} × {{ item.quantity }}</p>
              <div class="text-right">
                <p v-if="item.discountPercentage >= 1" class="text-xs text-dim line-through">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </p>
                <p class="text-lg font-medium">
                  ${{ (item.price * (1 - item.discountPercentage / 100) * item.quantity).toFixed(2) }}
                </p>
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
            <dd>${{ total.toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-dim">Скидка</dt>
            <dd class="text-acid">-${{ (total - discountedTotal).toFixed(2) }}</dd>
          </div>
          <div class="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <dt class="font-medium">К оплате</dt>
            <dd class="text-3xl font-medium">${{ discountedTotal.toFixed(2) }}</dd>
          </div>
        </dl>
      </aside>
    </div>

    <div v-else-if="!loading" class="border-b border-line py-16">
      <p class="text-xl font-medium">В корзине пока пусто</p>
      <NuxtLink
        to="/products"
        class="mt-6 inline-flex min-h-11 items-center bg-acid px-6 font-display text-lg font-bold text-ink uppercase transition-opacity active:opacity-80"
      >
        В каталог
      </NuxtLink>
    </div>
  </main>
</template>
