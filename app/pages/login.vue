<script setup lang="ts">
import type {LoginResponse } from '../types/login'

const username=ref<string>('emilys')
const password=ref<string>('emilyspass')
const errorText=ref<string>('')
const loading=ref<boolean>(false)
const {token,userId}=useAuth()


async function submit(){
  errorText.value=''
  loading.value=true
  

 try{

    const res=await $fetch<LoginResponse>('https://dummyjson.com/auth/login',{
      method:'POST',
      body:{username:username.value,password:password.value}
      
    })
   token.value=res.accessToken
    userId.value=res.id
await navigateTo('/products')
  } catch (err) {
    
    errorText.value='Неверный логин или пароль'
  } finally {
    loading.value=false
    
  }
}
</script>

<template>
  <main class="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-7xl place-items-center px-4 py-10 sm:px-6">
    <form @submit.prevent="submit" class="w-full max-w-sm border border-line">
      <div class="border-b border-line px-6 py-6">
        <h1 class="text-4xl leading-none">Вход</h1>
        <p class="mt-3 text-sm text-dim">Пожалуйста войдите в аккаунт</p>
      </div>

      <div class="flex flex-col gap-5 px-6 py-6">
        <label class="flex flex-col gap-2">
          <span class="text-xs text-dim uppercase">Логин</span>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            class="border border-line bg-panel px-3 py-3 text-base outline-none focus:border-acid"
          >
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-xs text-dim uppercase">Пароль</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="border border-line bg-panel px-3 py-3 text-base outline-none focus:border-acid"
          >
        </label>

        <p v-if="errorText" class="border-l-2 border-red-400 pl-3 text-sm text-red-400">{{ errorText }}</p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-acid py-4 font-display text-lg font-bold text-ink uppercase transition-opacity active:opacity-80 disabled:opacity-40"
      >
        {{ loading ? 'Входим...' : 'Войти' }}
      </button>
    </form>
  </main>
</template>
