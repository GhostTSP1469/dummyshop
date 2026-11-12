export function useAuth(){
    const token=useCookie<string|null>('token')
    const userId=useCookie<number|null>('userId')

    const isLogin=computed(() => {
        if(token.value){
            return true
        }
        return false
    })

    async function logout(){
        token.value=null
        userId.value=null
        await navigateTo('/login')
    }

    return {token,userId,isLogin,logout}
}
