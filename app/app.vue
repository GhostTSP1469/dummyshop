<script setup lang="ts">
const tabs=[
  {to:'/products',label:'Каталог'},
  {to:'/carts',label:'Корзина'}
  
]

const {isLogin,logout}=useAuth()



</script>

<template>
  <div class="min-h-dvh">
    <NuxtRouteAnnouncer />

    <header class="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-7xl items-stretch justify-between px-4 sm:px-6">
        <NuxtLink to="/products" class="group flex items-center gap-2.5" aria-label="Dummy Shop, на главную">
          <img src="/cart.svg" alt="" width="26" height="26" class="size-[26px] transition-transform duration-200 group-hover:-translate-y-0.5 [image-rendering:pixelated]">
          <span class="font-display text-[1.375rem] leading-none font-bold uppercase italic -skew-x-6">
            Dummy<span class="text-acid">Shop</span>
          </span>
        </NuxtLink>

        <nav class="flex items-stretch">
          <template v-if="isLogin">
            <NuxtLink
              v-for="tab in tabs"
              :key="tab.to"
              :to="tab.to"
              class="flex items-center border-l border-line px-4 text-xs tracking-wide text-dim uppercase transition-colors hover:text-bone sm:px-6"
              active-class="bg-acid text-ink! hover:text-ink!"
            >
              {{ tab.label }}
            </NuxtLink>
          </template>
          <NuxtLink
            v-if="!isLogin"
            to="/login"
            class="flex items-center border-l border-line px-4 text-xs tracking-wide text-dim uppercase transition-colors hover:text-bone sm:px-6"
            active-class="bg-acid text-ink! hover:text-ink!"
          >
            Вход
          </NuxtLink>
          <button
            v-else
            type="button"
            @click="logout"
            class="group flex items-center gap-2.5 border-l border-line px-4 text-xs tracking-wide text-dim uppercase transition-colors hover:text-bone sm:px-6"
          >
            <img
              src="/exit.svg"
              alt=""
              width="20"
              height="20"
              class="size-5 drop-shadow-[0_0_4px_rgba(212,255,58,0.5)] transition-[filter,transform] duration-300 group-hover:translate-x-0.5 group-hover:drop-shadow-[0_0_8px_rgba(212,255,58,0.95)] group-active:scale-90 [image-rendering:pixelated]"
            >
            Выход
          </button>

        </nav>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
