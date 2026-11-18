import type {CartItem} from '~/types/cart'
import type {ProductData} from '~/types/product'

export function useCart(){
    const items=useState<CartItem[]>('cart',() => [])
    const loading=useState<boolean>('cartLoading',() => false)
    const cartError=useState<string>('cartError',() => '')

    const totalQuantity=computed(() => {
        return items.value.reduce((sum,item) => sum + item.quantity,0)
    })

    const total=computed(() => {
        return items.value.reduce((sum,item) => sum + item.price * item.quantity,0)
    })

    const discountedTotal=computed(() => {
        return items.value.reduce((sum,item) => {
            const price=item.price * (1 - item.discountPercentage / 100)
            return sum + price * item.quantity
        },0)
    })

    async function loadCart(){
        loading.value=true
        cartError.value=''
        try{
            items.value=await $fetch<CartItem[]>('/api/cart')
        } catch (err) {
            cartError.value='Не удалось загрузить корзину'
        } finally {
            loading.value=false
        }
    }

    async function addToCart(product:ProductData,quantity:number=1){
        cartError.value=''
        try{
            items.value=await $fetch<CartItem[]>('/api/cart',{
                method:'POST',
                body:{
                    id:product.id,
                    title:product.title,
                    price:product.price,
                    discountPercentage:product.discountPercentage,
                    thumbnail:product.thumbnail,
                    quantity
                }
            })
        } catch (err) {
            cartError.value='Не удалось добавить товар'
        }
    }

    async function removeFromCart(id:number){
        cartError.value=''
        try{
            items.value=await $fetch<CartItem[]>(`/api/cart/${id}`,{method:'DELETE'})
        } catch (err) {
            cartError.value='Не удалось удалить товар'
        }
    }

    async function makeOrder(){
        cartError.value=''
        if('Notification' in window && Notification.permission === 'default'){
            await Notification.requestPermission()
        }
        try{
            const {text}=await $fetch<{text:string}>('/api/order',{method:'POST'})
            items.value=[]
            if('Notification' in window && Notification.permission === 'granted'){
                new Notification('Заказ отправлен',{body:text})
            }
            return true
        } catch (err:any) {
            cartError.value=err?.statusMessage || 'Не удалось отправить заказ'
            return false
        }
    }

    function isInCart(id:number){
        return items.value.some(item => item.id === id)
    }

    return {items,loading,cartError,totalQuantity,total,discountedTotal,loadCart,addToCart,removeFromCart,makeOrder,isInCart}
}
