<script setup lang="ts">
import type {ProductData} from '~/types/product'
import type {CommentData,CommentResponse,NewCommentResponse} from '~/types/comment'
import {Heart} from 'lucide-vue-next'

definePageMeta({middleware:'auth'})

const route=useRoute()
const {data,status,error}=await useFetch<ProductData>(`https://dummyjson.com/products/${route.params.id}`)
const activeImage=ref<number>(0)

const {data:commentsData}=await useFetch<CommentResponse>(`https://dummyjson.com/comments/post/${route.params.id}`)
const {userId,isLogin}=useAuth()

const {items,addToCart,loadCart,cartError}=useCart()
const adding=ref<boolean>(false)

await loadCart()

const inCartQuantity=computed(() => {
  const found=items.value.find(item => item.id === Number(route.params.id))
  if(found){
    return found.quantity
  }
  return 0
})

const inCart=computed(() => inCartQuantity.value > 0)

async function add(){
  if(!data.value){
    return
  }
  adding.value=true
  await addToCart(data.value)
  adding.value=false
}

const newText=ref<string>('')
const sending=ref<boolean>(false)
const commentError=ref<string>('')
const added=ref<CommentData[]>([])

const allComments=computed(() => {
  if(commentsData.value){
    return [...added.value,...commentsData.value.comments]
  }
  return added.value
})

async function sendComment(){
  if(newText.value.trim().length === 0){
    return
  }
  commentError.value=''
  sending.value=true

  try{
    const res=await $fetch<NewCommentResponse>('https://dummyjson.com/comments/add',{
      method:'POST',
      body:{body:newText.value,postId:Number(route.params.id),userId:userId.value}
    })
    added.value.unshift({...res,likes:0})
    newText.value=''
  } catch (err) {
    commentError.value='Не удалось отправить комментарий'
  } finally {
    sending.value=false
  }
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
    <NuxtLink
      to="/products"
      class="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-dim transition-colors hover:text-acid"
    >
      <span class="flex size-9 items-center justify-center border border-line transition-colors group-hover:border-acid">
        <img
          src="/back.svg"
          alt=""
          width="20"
          height="20"
          class="size-5 drop-shadow-[0_0_4px_rgba(212,255,58,0.5)] transition-[filter,transform] duration-300 group-hover:-translate-x-0.5 group-hover:drop-shadow-[0_0_8px_rgba(212,255,58,0.95)] [image-rendering:pixelated]"
        >
      </span>
      Назад в каталог
    </NuxtLink>

    <p v-if="status === 'error'" class="border-t border-line py-10 text-sm text-dim">
      Товар не найден: {{ error?.statusMessage || error?.message }}
    </p>

    <div v-if="data" class="grid border-t border-line lg:grid-cols-2">
      <section class="border-line lg:border-r">
        <div class="relative aspect-square border-b border-line">
          <img
            :src="data.images[activeImage]"
            :alt="data.title"
            width="600"
            height="600"
            class="h-full w-full object-contain p-8 sm:p-14"
          >
          <span class="absolute top-4 left-4 text-xs text-dim tabular-nums">
            #{{ String(data.id).padStart(3, '0') }}
          </span>
          <span
            v-if="data.discountPercentage >= 1"
            class="absolute top-4 right-4 bg-acid px-2 py-1 text-xs font-medium text-ink tabular-nums"
          >
            -{{ Math.round(data.discountPercentage) }}%
          </span>
        </div>

        <div v-if="data.images.length > 1" class="flex overflow-x-auto border-b border-line lg:border-b-0">
          <button
            v-for="(image, index) in data.images"
            :key="image"
            type="button"
            @click="activeImage=index"
            class="size-20 shrink-0 border-r border-line p-2 transition-colors"
            :class="activeImage === index ? 'bg-panel shadow-[inset_0_-2px_0_var(--color-acid)]' : 'opacity-50 hover:opacity-100'"
          >
            <img :src="image" :alt="`${data.title}, фото ${index + 1}`" width="80" height="80" class="h-full w-full object-contain">
          </button>
        </div>
      </section>

      <section class="min-w-0 py-8 lg:px-10 lg:py-10">
        <p class="text-xs tracking-wide text-dim uppercase">
          {{ data.category }}<template v-if="data.brand"> / {{ data.brand }}</template>
        </p>
        <h1 class="mt-3 text-4xl leading-[0.95] font-bold tracking-[-0.04em] uppercase sm:text-5xl">{{ data.title }}</h1>

        <div class="mt-8 flex items-baseline gap-4 tabular-nums">
          <p class="text-4xl font-medium text-acid">${{ data.price }}</p>
          <p class="text-sm text-dim">★ {{ data.rating.toFixed(1) }}</p>
        </div>
        <p class="mt-2 text-xs tracking-wide text-dim uppercase">
          {{ data.availabilityStatus }} / остаток {{ data.stock }}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            :disabled="adding"
            class="inline-flex min-h-12 items-center bg-acid px-8 font-display text-lg font-bold text-ink uppercase transition-opacity active:opacity-80 disabled:opacity-60"
            @click="add"
          >
            <span v-if="adding">Добавляем...</span>
            <span v-else-if="inCart">Добавить ещё</span>
            <span v-else>В корзину</span>
          </button>

          <NuxtLink
            v-if="inCart"
            to="/carts"
            class="inline-flex min-h-12 items-center border border-line px-6 text-sm tracking-wide uppercase transition-colors hover:border-acid hover:text-acid"
          >
            В корзине: {{ inCartQuantity }}
          </NuxtLink>
        </div>

        <p v-if="cartError" class="mt-3 text-sm text-red-400">{{ cartError }}</p>

        <p class="mt-8 max-w-[60ch] leading-relaxed text-bone/80">{{ data.description }}</p>

        <ul class="mt-6 flex flex-wrap gap-2">
          <li
            v-for="tag in data.tags"
            :key="tag"
            class="border border-line px-2.5 py-1 text-[0.6875rem] tracking-wide text-dim uppercase"
          >
            {{ tag }}
          </li>
        </ul>

        <dl class="mt-10 grid grid-cols-2 border-t border-l border-line text-sm">
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Артикул</dt>
            <dd class="mt-1">{{ data.sku }}</dd>
          </div>
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Вес</dt>
            <dd class="mt-1 tabular-nums">{{ data.weight }}</dd>
          </div>
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Размеры</dt>
            <dd class="mt-1 tabular-nums">{{ data.dimensions.width }} × {{ data.dimensions.height }} × {{ data.dimensions.depth }}</dd>
          </div>
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Мин. заказ</dt>
            <dd class="mt-1 tabular-nums">{{ data.minimumOrderQuantity }}</dd>
          </div>
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Гарантия</dt>
            <dd class="mt-1">{{ data.warrantyInformation }}</dd>
          </div>
          <div class="border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Доставка</dt>
            <dd class="mt-1">{{ data.shippingInformation }}</dd>
          </div>
          <div class="col-span-2 border-r border-b border-line p-4">
            <dt class="text-[0.6875rem] tracking-wide text-dim uppercase">Возврат</dt>
            <dd class="mt-1">{{ data.returnPolicy }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <section v-if="data" class="border-t border-line pt-10">
      <h2 class="text-3xl font-bold tracking-[-0.04em] uppercase">
        Отзывы <span class="text-base font-normal text-acid">{{ data.reviews.length }}</span>
      </h2>

      <ul class="mt-6 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="review in data.reviews"
          :key="review.reviewerEmail + review.date"
          class="border-r border-b border-line p-5"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="truncate font-medium">{{ review.reviewerName }}</p>
            <p class="shrink-0 text-xs text-acid">{{ '★'.repeat(review.rating) }}</p>
          </div>
          <p class="mt-3 leading-relaxed text-bone/80">{{ review.comment }}</p>
          <p class="mt-4 text-[0.6875rem] text-dim tabular-nums">
            {{ new Date(review.date).toLocaleDateString('ru-RU') }}
          </p>
        </li>
      </ul>
    </section>

    <section v-if="data" class="mt-14 border-t border-line pt-10">
      <h2 class="text-3xl">
        Комментарии <span class="text-base font-normal text-acid tabular-nums">{{ allComments.length }}</span>
      </h2>

      <p v-if="!isLogin" class="mt-6 border-l-2 border-line pl-3 text-dim">
        Чтобы оставить комментарий,
        <NuxtLink to="/login" class="text-acid underline underline-offset-4">войдите</NuxtLink>.
      </p>

      <form @submit.prevent="sendComment" class="mt-6 max-w-2xl">
        <label class="flex flex-col gap-2">
          <span class="text-xs text-dim uppercase">Ваш комментарий</span>
          <textarea
            v-model="newText"
            :disabled="!isLogin"
            rows="3"
            maxlength="300"
            class="resize-none border border-line bg-panel px-3 py-3 text-base outline-none focus:border-acid"
          ></textarea>
        </label>

        <p v-if="commentError" class="mt-3 border-l-2 border-red-400 pl-3 text-sm text-red-400">{{ commentError }}</p>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            :disabled="!isLogin || sending || newText.trim().length === 0"
            class="min-h-11 bg-acid px-6 font-display text-lg font-bold text-ink uppercase transition-opacity active:opacity-80 disabled:opacity-40"
          >
            {{ sending ? 'Отправляем...' : 'Отправить' }}
          </button>

          <button
            v-if="newText.length > 0"
            type="button"
            @click="newText=''; commentError=''"
            class="group flex min-h-11 items-center gap-2.5 border border-line px-4 text-sm text-dim transition-colors hover:border-acid hover:text-bone"
          >
            <img
              src="/close.svg"
              alt=""
              width="18"
              height="18"
              class="size-4.5 drop-shadow-[0_0_4px_rgba(212,255,58,0.5)] transition-[filter,transform] duration-300 group-hover:rotate-90 group-hover:drop-shadow-[0_0_8px_rgba(212,255,58,0.95)] [image-rendering:pixelated]"
            >
            Отмена
          </button>
        </div>
      </form>

      <ul v-if="allComments.length > 0" class="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="comment in allComments" :key="comment.id" class="border-r border-b border-line p-5">
          <div class="flex items-baseline justify-between gap-3">
            <p class="truncate font-medium">{{ comment.user.fullName }}</p>
            <p class="shrink-0 text-xs text-dim">@{{ comment.user.username }}</p>
          </div>
          <p class="mt-3 leading-relaxed text-bone/80">{{ comment.body }}</p>
          <p class="mt-4 flex items-center gap-1.5 text-xs text-dim tabular-nums">
            <Heart :size="14" :stroke-width="1.75" />
            {{ comment.likes }}
          </p>
        </li>
      </ul>

      <p v-else class="mt-8 text-dim">Комментариев пока нет.</p>
    </section>

    <NuxtLink
      to="/products"
      class="group mt-14 flex min-h-20 items-center justify-between gap-4 border-y border-line px-1 transition-colors hover:bg-panel sm:px-4"
    >
      <span class="flex items-center gap-4">
        <img
          src="/back.svg"
          alt=""
          width="28"
          height="28"
          class="size-7 drop-shadow-[0_0_5px_rgba(212,255,58,0.5)] transition-[filter,transform] duration-300 group-hover:-translate-x-1 group-hover:drop-shadow-[0_0_10px_rgba(212,255,58,0.95)] [image-rendering:pixelated]"
        >
        <span class="font-display text-2xl font-bold uppercase italic -skew-x-6 sm:text-3xl">К каталогу</span>
      </span>
      <span class="hidden text-xs text-dim uppercase sm:block">ещё товары</span>
    </NuxtLink>
  </main>
</template>
